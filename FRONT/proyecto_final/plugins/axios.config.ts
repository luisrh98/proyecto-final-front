import axios from 'axios';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error?: any) => {
  failedQueue.forEach(prom => error ? prom.reject(error) : prom.resolve());
  failedQueue = [];
};

export default defineNuxtPlugin(() => {
  const apiClient = axios.create({
    baseURL: useRuntimeConfig().public.API_BASE_URL,  
    headers: { 'Content-Type': 'application/json' },
  });

  // —— Opcional: loguea TODAS las requests para que veas URL completa
  apiClient.interceptors.request.use(config => {
    console.log('📤 Request:', config.method?.toUpperCase(), config.baseURL + config.url);
    return config;
  });

  apiClient.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      if (!error.response) {
        return Promise.reject(error);
      }

      switch (error.response.status) {
        case 400:
          return Promise.reject(new Error('Error de validación: ' + JSON.stringify(error.response.data)));
        case 401:
          if (!isRefreshing && !originalRequest._retry) {
            isRefreshing = true;
            const refreshToken = sessionStorage.getItem('refreshToken');

            if (!refreshToken) {
              sessionStorage.clear();
              useRouter().push('/login');
              return Promise.reject(new Error('No hay refreshToken disponible'));
            }

            try {
              // —— Antes de lanzar la petición, logueamos lo que vamos a llamar
              console.log('🔄 Refresh token request:', {
                method: 'POST',
                fullURL: apiClient.defaults.baseURL + '/accounts/refresh/',
                headers: { Origin: window.location.origin },
                body: { refresh: refreshToken },
              });

              const { data } = await apiClient.post(
                '/accounts/refresh/',               // coincide con path('refresh/', ...) en accounts/urls.py
                { refresh: refreshToken }
                
              );

              // Guardamos y aplicamos los nuevos tokens
              sessionStorage.setItem('authToken', data.access);
              sessionStorage.setItem('refreshToken', data.refresh);
              apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + data.access;
              originalRequest.headers['Authorization'] = 'Bearer ' + data.access;

              processQueue();
              return apiClient(originalRequest);

            } catch (err) {
              console.error('❌ Error al refrescar el token:', err);
              sessionStorage.clear();
              useRouter().push('/login');
              processQueue(err);
              return Promise.reject(new Error('La sesión ha expirado. Por favor, inicia sesión nuevamente.'));
            } finally {
              isRefreshing = false;
            }
          }

          // Cola para peticiones concurrentes
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
            setTimeout(() => {
              reject(new Error('La solicitud ha expirado mientras esperaba el refresco del token.'));
            }, 10000);
          }).then(() => apiClient(originalRequest));

        case 403:
          return Promise.reject(new Error('No tienes permisos para acceder a este recurso.'));
        case 404:
          return Promise.reject(new Error('Recurso no encontrado.'));
        case 500:
          return Promise.reject(new Error('Error interno del servidor. Por favor, intenta más tarde.'));
        default:
          return Promise.reject(new Error('Ha ocurrido un error inesperado.'));
      }
    }
  );

  return { provide: { axios: apiClient } };
});
