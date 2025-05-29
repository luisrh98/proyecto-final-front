<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-100 px-4">
    <form @submit.prevent="handleSubmit" class="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl space-y-5 border border-gray-200">
      <h2 class="text-3xl font-semibold text-center text-blue-700">Crear cuenta</h2>

      <!-- Mensaje de éxito -->
      <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-lg p-3">
        <p class="text-green-700 text-sm text-center font-medium flex items-center justify-center gap-2">
          <i class="fas fa-check-circle"></i>
          {{ successMessage }}
        </p>
      </div>

      <!-- Mensaje de error general -->
      <div v-if="errors.general" class="bg-red-50 border border-red-200 rounded-lg p-3">
        <p class="text-red-700 text-sm text-center font-medium flex items-center justify-center gap-2">
          <i class="fas fa-exclamation-triangle"></i>
          {{ errors.general }}
        </p>
      </div>

      <!-- Indicador de carga -->
      <div v-if="isLoading" class="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p class="text-blue-700 text-sm text-center font-medium flex items-center justify-center gap-2">
          <i class="fas fa-spinner fa-spin"></i>
          Creando cuenta...
        </p>
      </div>

      <!-- Nombre de usuario -->
      <div>
        <input 
          v-model="username" 
          placeholder="Nombre de usuario" 
          required
          :disabled="isLoading"
          :class="[
            'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors',
            errors.username ? 'border-red-300 bg-red-50' : 'border-gray-300',
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          ]"
        />
        <p v-if="errors.username" class="text-red-500 text-sm mt-1 flex items-center gap-1">
          <i class="fas fa-exclamation-circle text-xs"></i>
          {{ errors.username }}
        </p>
      </div>

      <!-- Correo electrónico -->
      <div>
        <input 
          v-model="email" 
          type="email" 
          placeholder="Correo electrónico" 
          required
          :disabled="isLoading"
          :class="[
            'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors',
            errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300',
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          ]"
        />
        <p v-if="errors.email" class="text-red-500 text-sm mt-1 flex items-center gap-1">
          <i class="fas fa-exclamation-circle text-xs"></i>
          {{ errors.email }}
        </p>
      </div>

      <!-- Contraseña -->
      <div>
        <input 
          v-model="password" 
          type="password" 
          placeholder="Contraseña" 
          required
          :disabled="isLoading"
          @input="checkPasswordStrength"
          :class="[
            'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors',
            errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300',
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          ]"
        />
        <div class="mt-2 h-2 rounded bg-gray-200 overflow-hidden">
          <div 
            :class="strengthBarClass" 
            class="h-full transition-all duration-300 ease-in-out"
            :style="{ width: passwordStrength.width }"
          ></div>
        </div>
        <p class="text-sm mt-1 font-medium" :class="strengthTextClass">
          {{ passwordStrength.label }}
        </p>
        <ul class="text-xs text-gray-500 mt-2 list-disc list-inside">
          <li>Mínimo 8 caracteres</li>
          <li>Incluye mayúsculas, minúsculas y números</li>
          <li>Recomendado: usar símbolos (@, #, %, etc.)</li>
        </ul>
        <p v-if="errors.password" class="text-red-500 text-sm mt-1 flex items-center gap-1">
          <i class="fas fa-exclamation-circle text-xs"></i>
          {{ errors.password }}
        </p>
      </div>

      <!-- Confirmar contraseña -->
      <div>
        <input 
          v-model="password1" 
          type="password" 
          placeholder="Confirmar contraseña" 
          required
          :disabled="isLoading"
          :class="[
            'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors',
            errors.password1 ? 'border-red-300 bg-red-50' : 'border-gray-300',
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          ]"
        />
        <p v-if="errors.password1" class="text-red-500 text-sm mt-1 flex items-center gap-1">
          <i class="fas fa-exclamation-circle text-xs"></i>
          {{ errors.password1 }}
        </p>
      </div>

      <!-- Teléfono -->
      <div>
        <input 
          v-model="telefono" 
          type="tel" 
          placeholder="Teléfono (opcional)"
          pattern="^[0-9]{9,15}$"
          title="Debe contener entre 9 y 15 dígitos numéricos"
          :disabled="isLoading"
          :class="[
            'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors',
            errors.telefono ? 'border-red-300 bg-red-50' : 'border-gray-300',
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          ]"
        />
        <p v-if="errors.telefono" class="text-red-500 text-sm mt-1 flex items-center gap-1">
          <i class="fas fa-exclamation-circle text-xs"></i>
          {{ errors.telefono }}
        </p>
      </div>

      <!-- Botón de registro -->
      <button
        type="submit"
        :disabled="isLoading"
        :class="[
          'w-full py-3 font-medium rounded-lg transition duration-200 flex justify-center items-center gap-2',
          isLoading 
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
        ]"
      >
        <template v-if="isLoading">
          <i class="fas fa-spinner fa-spin"></i>
          Creando cuenta...
        </template>
        <template v-else>
          Registrarse
          <i class="fas fa-arrow-right"></i>
        </template>
      </button>
    </form>
  </div>
</template>

<script setup>
const { $axios } = useNuxtApp();
const router = useRouter();

const username = ref('');
const email = ref('');
const password = ref('');
const password1 = ref('');
const telefono = ref('');
const successMessage = ref('');
const isLoading = ref(false);

// Manejo de errores mejorado
const errors = reactive({
  username: '',
  email: '',
  password: '',
  password1: '',
  telefono: '',
  general: ''
});

// Password strength
const passwordStrength = reactive({
  label: 'Introduce una contraseña',
  width: '0%',
  level: 0,
});

const strengthBarClass = computed(() => {
  switch (passwordStrength.level) {
    case 1: return 'bg-red-500';
    case 2: return 'bg-yellow-400';
    case 3: return 'bg-green-500';
    default: return 'bg-gray-300';
  }
});

const strengthTextClass = computed(() => {
  switch (passwordStrength.level) {
    case 1: return 'text-red-500';
    case 2: return 'text-yellow-600';
    case 3: return 'text-green-600';
    default: return 'text-gray-500';
  }
});

function checkPasswordStrength() {
  const value = password.value;
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;

  if (score <= 1) {
    passwordStrength.label = 'Poco segura';
    passwordStrength.width = '25%';
    passwordStrength.level = 1;
  } else if (score === 2 || score === 3) {
    passwordStrength.label = 'Segura';
    passwordStrength.width = '60%';
    passwordStrength.level = 2;
  } else if (score >= 4) {
    passwordStrength.label = 'Muy segura';
    passwordStrength.width = '100%';
    passwordStrength.level = 3;
  } else {
    passwordStrength.label = 'Introduce una contraseña';
    passwordStrength.width = '0%';
    passwordStrength.level = 0;
  }
}

function clearErrors() {
  Object.keys(errors).forEach(key => errors[key] = '');
}

function validateForm() {
  clearErrors();
  let isValid = true;

  if (password.value !== password1.value) {
    errors.password1 = 'Las contraseñas no coinciden';
    isValid = false;
  }
  
  if (telefono.value && !/^[0-9]{9,15}$/.test(telefono.value)) {
    errors.telefono = 'El teléfono debe tener entre 9 y 15 dígitos';
    isValid = false;
  }
  
  return isValid;
}

function handleBackendErrors(error) {
  console.log('Error completo:', error);
  
  // Si el error tiene las propiedades especiales del interceptor mejorado
  if (error.isValidationError || error.response?.status === 400) {
    // Manejo específico de errores de validación
    const responseData = error.response?.data;
    
    if (responseData && typeof responseData === 'object') {
      // Manejo de errores de campo específicos
      Object.keys(responseData).forEach(field => {
        const fieldErrors = responseData[field];
        
        if (field === 'non_field_errors') {
          errors.general = Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors;
        } else if (field in errors) {
          errors[field] = Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors;
        } else {
          // Si es un campo que no reconocemos, lo ponemos en errores generales
          const errorMsg = Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors;
          errors.general = errors.general ? `${errors.general}; ${errorMsg}` : errorMsg;
        }
      });
    } else {
      // Si no es un objeto, usar el mensaje del error procesado por el interceptor
      errors.general = error.message || 'Error de validación en los datos enviados.';
    }
  } else if (error.isNetworkError) {
    errors.general = 'Error de conexión. Verifica tu conexión a internet.';
  } else if (error.isForbidden) {
    errors.general = 'No tienes permisos para realizar esta acción.';
  } else if (error.isServerError) {
    errors.general = 'Error del servidor. Intenta más tarde.';
  } else {
    // Error genérico o no manejado por el interceptor
    errors.general = error.message || 'Ha ocurrido un error inesperado. Intenta nuevamente.';
  }
}

async function handleSubmit() {
  if (!validateForm()) return;

  isLoading.value = true;
  clearErrors();

  try {
    const response = await $axios.post('/accounts/register/', {
      username: username.value,
      email: email.value,
      password: password.value,
      password1: password1.value,
      telefono: telefono.value || null,
    });

    // Éxito
    successMessage.value = 'Se ha enviado un correo para verificar tu cuenta.';
    
    // Limpiar formulario después del éxito
    username.value = '';
    email.value = '';
    password.value = '';
    password1.value = '';
    telefono.value = '';
    
    // Redireccionar después de 4 segundos
    setTimeout(() => {
      router.push('/login');
    }, 4000);

  } catch (error) {
    handleBackendErrors(error);
  } finally {
    isLoading.value = false;
  }
}

// Limpiar errores cuando el usuario empiece a escribir
watch([username, email, password, password1, telefono], () => {
  if (errors.general) {
    errors.general = '';
  }
});
</script>