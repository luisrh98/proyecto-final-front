<template>
  <div class="auth-container container fade-in">
    <form @submit.prevent="handleSubmit" class="auth-form">
      <h2 class="auth-title">Restablecer Contraseña</h2>
      <input
        v-model="password"
        type="password"
        placeholder="Nueva contraseña"
        required
        class="form-control"
      />
      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Confirmar contraseña"
        required
        class="form-control"
      />
      <button type="submit" class="btn btn-accent w-100" :disabled="loading">
        <span v-if="!loading">Restablecer</span>
        <span v-else>Cargando...</span>
      </button>
    </form>

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
const route = useRoute();

const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const notification = ref({ message: '', type: '', show: false });

// Capturamos los parámetros de la URL (uid y token)
const uid = route.params.uid;
const token = route.params.token;

const showNotification = (message, type = 'error') => {
  notification.value = { message, type, show: true };
  setTimeout(() => {
    notification.value.show = false;
  }, 3000);
};

const handleSubmit = async () => {
  if (password.value !== confirmPassword.value) {
    showNotification('Las contraseñas no coinciden.');
    return;
  }

  loading.value = true;
  try {
    await $axios.post('/accounts/password-reset-confirm/', {
      uid: uid,
      token: token,
      new_password: password.value
    });
    showNotification('Contraseña actualizada.', 'success');
    setTimeout(() => router.push('/login'), 2000);
  } catch (error) {
    showNotification('Token inválido o expirado.');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Agrega tus estilos o importa variables SCSS */
</style>
