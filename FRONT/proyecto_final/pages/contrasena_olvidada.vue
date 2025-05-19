<template>
  <div class="auth-container max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
    <form @submit.prevent="handleSubmit" class="auth-form space-y-4">
      <h2 class="auth-title text-2xl font-semibold text-center text-gray-700">Restablecer Contraseña</h2>

      <!-- Campo para el correo electrónico -->
      <input
        v-model="email"
        type="email"
        placeholder="Correo electrónico"
        required
        class="form-control w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        autocomplete="email"
      />

      <!-- Botón de envío -->
      <button
        type="submit"
        class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="loading"
      >
        <span v-if="!loading">Enviar enlace</span>
        <span v-else>Enviando...</span>
      </button>

      <!-- Enlace para volver al inicio de sesión -->
      <NuxtLink to="/login" class="text-center text-sm text-gray-500 hover:text-gray-700 mt-3 block">
        Volver al inicio de sesión
      </NuxtLink>
    </form>

    <!-- Notificación de éxito o error -->
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
import { ref } from 'vue';
const { $axios } = useNuxtApp();
const email = ref('');
const loading = ref(false);
const notification = ref({ show: false, type: '', message: '' });

// Función para mostrar las notificaciones
const showNotification = (message, type = 'error') => {
  notification.value = { message, type, show: true };
  setTimeout(() => (notification.value.show = false), 3000);
};

// Función para manejar el envío del formulario
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

