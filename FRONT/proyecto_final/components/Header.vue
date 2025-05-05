<template>
  <header class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md py-4 px-6 flex items-center justify-between">
    
    <!-- Logo -->
    <div class="flex items-center gap-2">
      <h1 class="text-2xl font-bold tracking-wide">🛍️ BonShop</h1>
    </div>

    <!-- Usuario y botón -->
    <div class="flex items-center gap-4 flex-wrap justify-end">
      <p class="text-sm sm:text-base">{{ user ? `Bienvenido ${user.username}` : 'Bienvenido Invitado' }}</p>
      <button 
        class="px-4 py-2 bg-white text-indigo-600 font-semibold rounded-full hover:bg-indigo-100 transition duration-300"
        @click="user ? logout() : navigateTo('/login')"
      >
        {{ user ? 'Cerrar Sesión' : 'Iniciar Sesión' }}
      </button>
    </div>
    
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { navigateTo } from '#app';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const user = ref(null);

onMounted(() => {
  if (import.meta.client) {
    authStore.cargarTokensDesdeSession();
    if (authStore.isLoggedIn) {
      user.value = authStore.user;
    }
  }
});

const logout = () => {
  authStore.logout();
  navigateTo('/login');
};
</script>
