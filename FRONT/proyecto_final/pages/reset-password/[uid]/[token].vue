<template>
  <div class="auth-container max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 fade-in">
    <form @submit.prevent="handleSubmit" class="auth-form space-y-4">
      <h2 class="auth-title text-2xl font-semibold text-center text-gray-700">Restablecer Contraseña</h2>

      <!-- Campo de nueva contraseña -->
      <input
        v-model="password"
        type="password"
        placeholder="Nueva contraseña"
        required
        class="form-control w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <!-- Campo de confirmar contraseña -->
      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Confirmar contraseña"
        required
        class="form-control w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <!-- Botón de restablecer contraseña -->
      <button
        type="submit"
        class="btn w-full py-3 bg-green-600 text-white rounded-lg font-semibold disabled:bg-gray-400 transition-all"
        :disabled="loading"
      >
        <span v-if="!loading">Restablecer</span>
        <span v-else>Cargando...</span>
      </button>
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
import { useRouter, useRoute } from 'vue-router';

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
