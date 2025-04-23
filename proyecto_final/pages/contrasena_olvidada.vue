<template>
    <div class="auth-container container fade-in">
      <form @submit.prevent="handleSubmit" class="auth-form">
        <h2 class="auth-title">Restablecer Contraseña</h2>
  
        <input
          v-model="email"
          type="email"
          placeholder="Correo electrónico"
          required
          class="form-control"
          autocomplete="email"
        />
  
        <button type="submit" class="btn btn-accent w-100" :disabled="loading">
          <span v-if="!loading">Enviar enlace</span>
          <span v-else>Enviando...</span>
        </button>
  
        <NuxtLink to="/login" class="link-secondary mt-3 d-block text-center">
          Volver al inicio de sesión
        </NuxtLink>
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
  const email = ref('');
  const loading = ref(false);
  const notification = ref({ show: false, type: '', message: '' });
  
  const showNotification = (message, type = 'error') => {
    notification.value = { message, type, show: true };
    setTimeout(() => (notification.value.show = false), 3000);
  };
  
  const handleSubmit = async () => {
    loading.value = true;
    try {
      await $axios.post('/accounts/password-reset/', { email: email.value });
      showNotification('Se ha enviado un correo con instrucciones.', 'success');
    } catch (error) {
      showNotification('No se pudo enviar el correo. Revisa el email ingresado.');
    } finally {
      loading.value = false;
    }
  };
  </script>
  