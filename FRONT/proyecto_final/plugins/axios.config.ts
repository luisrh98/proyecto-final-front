import axios from 'axios';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error?: any) => {
  failedQueue.forEach(prom => error ? prom.reject(error) : prom.resolve());
  failedQueue = [];
};

// Función para extraer mensajes de error del backend
const extractErrorMessage = (errorResponse: any) => {
  // Maneja diferentes estructuras de error del backend
  if (errorResponse?.data) {
    const data = errorResponse.data;
    
    // Si hay un mensaje directo
    if (data.message) return data.message;
    if (data.error) return data.error;
    if (data.detail) return data.detail;
    
    // Si hay errores de validación (típico en Django/DRF)
    if (data.errors) {
      if (typeof data.errors === 'string') return data.errors;
      if (typeof data.errors === 'object') {
        // Convierte objeto de errores a string legible
        return Object.entries(data.errors)
          .map(([field, errors]: [string, any]) => {
            const errorList = Array.isArray(errors) ? errors : [errors];
            return `${field}: ${errorList.join(', ')}`;
          })
          .join('; ');
      }
    }
    
    // Si hay errores de campo específicos (Django forms)
    if (typeof data === 'object' && !Array.isArray(data)) {
      const fieldErrors = Object.entries(data)
        .filter(([key]) => key !== 'non_field_errors')
        .map(([field, errors]: [string, any]) => {
          const errorList = Array.isArray(errors) ? errors : [errors];
          return `${field}: ${errorList.join(', ')}`;
        });
      
      if (data.non_field_errors) {
        const nonFieldErrors = Array.isArray(data.non_field_errors) 
          ? data.non_field_errors.join(', ') 
          : data.non_field_errors;
        fieldErrors.unshift(nonFieldErrors);
      }
      
      if (fieldErrors.length > 0) return fieldErrors.join('; ');
    }
    
    // Si es un array de errores
    if (Array.isArray(data)) {
      return data.join(', ');
    }
    
    // Fallback: convertir a JSON string
    return JSON.stringify(data);
  }
  
  return null;
};

export default defineNuxtPlugin(() => {
  const apiClient = axios.create({
    baseURL: useRuntimeConfig().public.API_BASE_URL,  
    headers: { 'Content-Type': 'application/json' },
  });

  // Request interceptor
  apiClient.interceptors.request.use(config => {
    console.log('📤 Request:', config.method?.toUpperCase(), config.baseURL + config.url);
    return config;
  });

  // Response interceptor
  apiClient.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      if (!error.response) {
        // Error de red o conexión
        const networkError = new Error('Error de conexión. Verifica tu conexión a internet.');
        (networkError as any).isNetworkError = true;
        return Promise.reject(networkError);
      }

      const status = error.response.status;
      const backendMessage = extractErrorMessage(error.response);

      switch (status) {
        case 400: {
          const validationError = new Error(
            backendMessage || 'Error de validación en los datos enviados.'
          );
          (validationError as any).response = error.response;
          (validationError as any).isValidationError = true;
          return Promise.reject(validationError);
        }

        case 401: {
          if (!isRefreshing && !originalRequest._retry) {
            isRefreshing = true;
            const refreshToken = sessionStorage.getItem('refreshToken');

            if (!refreshToken) {
              sessionStorage.clear();
              useRouter().push('/login');
              return Promise.reject(new Error('Sesión expirada. Por favor, inicia sesión nuevamente.'));
            }

            try {
              console.log('🔄 Refresh token request:', {
                method: 'POST',
                fullURL: apiClient.defaults.baseURL + '/accounts/refresh/',
                headers: { Origin: window.location.origin },
                body: { refresh: refreshToken },
              });

              const { data } = await apiClient.post('/accounts/refresh/', { 
                refresh: refreshToken 
              });

              // Actualizar tokens
              sessionStorage.setItem('authToken', data.access);
              sessionStorage.setItem('refreshToken', data.refresh);
              apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + data.access;
              originalRequest.headers['Authorization'] = 'Bearer ' + data.access;

              processQueue();
              return apiClient(originalRequest);

            } catch (refreshError: any) {
              console.error('❌ Error al refrescar el token:', refreshError);
              sessionStorage.clear();
              useRouter().push('/login');
              
              const refreshMessage = extractErrorMessage(refreshError.response) || 
                'La sesión ha expirado. Por favor, inicia sesión nuevamente.';
              
              processQueue(new Error(refreshMessage));
              return Promise.reject(new Error(refreshMessage));
            } finally {
              isRefreshing = false;
            }
          }

          // Cola para peticiones concurrentes durante el refresh
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
            setTimeout(() => {
              reject(new Error('Tiempo de espera agotado para el refresco del token.'));
            }, 10000);
          }).then(() => apiClient(originalRequest));
        }
        
        case 403: {
          const forbiddenError = new Error(
            backendMessage || 'No tienes permisos para acceder a este recurso.'
          );
          (forbiddenError as any).response = error.response;
          (forbiddenError as any).isForbidden = true;
          return Promise.reject(forbiddenError);
        }

        case 404: {
          const notFoundError = new Error(
            backendMessage || 'Recurso no encontrado.'
          );
          (notFoundError as any).response = error.response;
          (notFoundError as any).isNotFound = true;
          return Promise.reject(notFoundError);
        }

        case 422: {
          // Errores de validación específicos (común en FastAPI)
          const validationError = new Error(
            backendMessage || 'Error de validación en los datos.'
          );
          (validationError as any).response = error.response;
          (validationError as any).isValidationError = true;
          return Promise.reject(validationError);
        }

        case 429: {
          const rateLimitError = new Error(
            backendMessage || 'Demasiadas solicitudes. Intenta más tarde.'
          );
          (rateLimitError as any).response = error.response;
          (rateLimitError as any).isRateLimit = true;
          return Promise.reject(rateLimitError);
        }

        case 500: {
          const serverError = new Error(
            backendMessage || 'Error interno del servidor. Por favor, intenta más tarde.'
          );
          (serverError as any).response = error.response;
          (serverError as any).isServerError = true;
          return Promise.reject(serverError);
        }

        default: {
          const unexpectedError = new Error(
            backendMessage || `Error inesperado (${status}). Intenta más tarde.`
          );
          (unexpectedError as any).response = error.response;
          (unexpectedError as any).status = status;
          return Promise.reject(unexpectedError);
        }
      }
    }
  );

  return { provide: { axios: apiClient } };
});