<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-tr from-white via-blue-50 to-purple-100 px-4 py-16">
    <div class="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-10 border border-gray-200 animate-fade-in space-y-6">
      <h2 class="text-3xl font-bold text-center text-indigo-700 tracking-tight">
        Iniciar Sesión
      </h2>

      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" class="space-y-5">

        <!-- Usuario -->
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Usuario</label>
          <input
            v-model="username"
            placeholder="Tu nombre de usuario"
            required
            autocomplete="username"
            class="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
          />
        </div>

        <!-- Contraseña -->
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Contraseña</label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              required
              autocomplete="current-password"
              class="w-full px-4 py-2 pr-10 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>

        <!-- Botón -->
        <div>
          <button
            type="submit"
            class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="loading"
          >
            <span v-if="!loading">Entrar <i class="fas fa-sign-in-alt ml-2"></i></span>
            <span v-else>Cargando... <i class="fas fa-spinner fa-spin ml-2"></i></span>
          </button>
        </div>
      </form>

      <!-- Enlaces -->
      <div class="text-center text-sm text-gray-600 mt-4">
        <p>
          ¿No tienes cuenta?
          <NuxtLink to="/register" class="text-indigo-600 hover:underline font-medium">
            Regístrate
          </NuxtLink>
        </p>
        <p class="mt-3">
          <NuxtLink to="/contrasena_olvidada" class="text-indigo-600 hover:underline font-medium">
            ¿Olvidaste tu contraseña?
          </NuxtLink>
        </p>
      </div>
    </div>

    <!-- Notificación -->
    <div
      v-if="notification.show"
      :class="[ 
        'fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white transition-all duration-300',
        notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
      ]"
    >
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup>
const { $axios } = useNuxtApp();
const router = useRouter();

const username = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);

const notification = ref({
  message: '',
  type: '',
  show: false,
});

const showNotification = (message, type = 'error') => {
  notification.value = { message, type, show: true };
  setTimeout(() => {
    notification.value.show = false;
  }, 2000);
};

const handleSubmit = async () => {
  if (!username.value || !password.value) {
    showNotification('Por favor, completa todos los campos.');
    return;
  }

  loading.value = true;

  try {
    const { data } = await $axios.post('/accounts/login/', {
      username: username.value,
      password: password.value,
    });

    sessionStorage.setItem('authToken', data.access);
    sessionStorage.setItem('refreshToken', data.refresh);
    sessionStorage.setItem('authUser', JSON.stringify(data.user));

    router.push('/');
    showNotification('¡Bienvenido de nuevo!', 'success');
  } catch (error) {
    if (error.response?.status === 400) {
      showNotification('Error de validación: ' + JSON.stringify(error.response.data));
    } else if (error.response?.status === 401) {
      showNotification('Credenciales inválidas. Verifica tu usuario y contraseña.');
    } else {
      showNotification('Ha ocurrido un error inesperado. Por favor, intenta nuevamente.');
    }
  } finally {
    loading.value = false;
  }
};
</script>
