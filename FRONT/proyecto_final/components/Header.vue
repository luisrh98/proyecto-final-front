<template>
  <header class="header">
    <div class="logo">
      <h1>Tienda Pro</h1>
    </div>
    <div class="user-info">
      <p>{{ user ? `Bienvenido ${user.username}` : 'Bienvenido Invitado' }}</p>
      <button 
        class="btn btn-secondary" 
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

// Al montarse, cargamos el estado de sesión y verificamos si hay token.
onMounted(() => {
  if (import.meta.client) {
    authStore.cargarTokensDesdeSession();
    if (authStore.isLoggedIn) {
      user.value = authStore.user;
    } 
  }
});

// Función para cerrar sesión
const logout = () => {
  authStore.logout();
  navigateTo('/login');
};
</script>

<style scoped lang="scss">
@import '../assets/scss/global.scss';

.header {
  @extend .container;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba($secondary, 0.95);
  color: $white;
  padding: 1rem 4rem;
  box-shadow: $box-shadow;
  width: 100%;
  
  .logo {
    font-family: $font-display;
    font-size: 1.5rem;
  }
  
  button {
    @extend .btn, .btn-secondary;
  }
}
</style>
