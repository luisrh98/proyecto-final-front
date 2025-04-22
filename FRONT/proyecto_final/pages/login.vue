<template>
  <div class="auth-container container fade-in">
    <form @submit.prevent="handleSubmit" class="auth-form">
      <h2 class="auth-title">Iniciar Sesión</h2>

      <input
        v-model="username"
        placeholder="Usuario"
        required
        class="form-control"
        autocomplete="username"
      />

      <div class="password-wrapper">
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Contraseña"
          required
          class="form-control"
          autocomplete="current-password"
        />
        <button
          type="button"
          class="password-toggle"
          @click="showPassword = !showPassword"
        >
          <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </button>
      </div>

      <button
        type="submit"
        class="btn btn-accent w-100"
        :disabled="loading"
      >
        <span v-if="!loading">Entrar <i class="fas fa-sign-in-alt ml-2"></i></span>
        <span v-else>Cargando... <i class="fas fa-spinner fa-spin ml-2"></i></span>
      </button>

      <div class="auth-footer">
        <p>
          ¿No tienes cuenta?
          <NuxtLink to="/register" class="link-secondary">Regístrate</NuxtLink>
        </p>
        <p class="mt-3 text-center">
          <NuxtLink to="/contrasena_olvidada" class="link-secondary">¿Olvidaste tu contraseña?</NuxtLink>
        </p>
      </div>
    </form>

    <!-- Notificación -->
    <div
      v-if="notification.show"
      :class="[
        'fixed bottom-5 right-5 z-50 p-4 rounded-lg shadow-lg text-white',
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

// Estado para las notificaciones
const notification = ref({
  message: '',
  type: '', // 'success', 'error', etc.
  show: false,
});

// Función para mostrar notificaciones
const showNotification = (message, type = 'error') => {
  notification.value = { message, type, show: true };

  // Ocultar la notificación después de 2 segundos
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

    router.push('/home');
    showNotification('¡Bienvenido de nuevo!', 'success'); // Notificación de éxito
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

<style lang="scss" scoped>
@import '../assets/scss/_variables.scss';
@import '../assets/scss/global.scss';

.password-wrapper {
  position: relative;
  margin: 15px 0;
}

.password-toggle {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: $secondary;
  cursor: pointer;
  transition: $transition;
  
  &:hover {
    color: $accent;
  }
}

.auth-container {
  padding: 40px 0;
  max-width: 500px;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
}

.auth-form {
  background: rgba($secondary, 0.05);
  padding: 30px;
  border-radius: 12px;
  box-shadow: $box-shadow;
  border: 1px solid $gray;
}

.auth-title {
  color: $secondary;
  font-family: $font-display;
  margin-bottom: 25px;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background: $primary;
    margin: 10px auto;
    border-radius: 2px;
  }
}

.form-control {
  margin: 15px 0;
  
  &:focus {
    border-color: $accent;
    box-shadow: 0 0 0 2px rgba($accent, 0.2);
  }
}

.btn-accent {
  margin-top: 20px;
  padding: 14px;
  
  i {
    transition: $transition;
  }
  
  &:hover {
    i {
      transform: translateX(5px);
    }
  }
}
</style>