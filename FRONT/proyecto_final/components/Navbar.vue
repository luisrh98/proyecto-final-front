<template>
  <nav class="navbar">
    <div class="container">
      <!-- Logo -->
      <NuxtLink to="/index" class="logo">Mi Tienda</NuxtLink>
      
      <!-- Contenedor de acciones -->
      <div class="nav-actions">
        <!-- Menú Categorías -->
        <div class="dropdown">
          <button class="nav-btn btn-primary">
            Categorías 
            <Icon name="mdi:menu-down" class="icon" />
          </button>
          <div class="dropdown-menu">
            <div class="menu-inner">
              <NuxtLink 
                :to="{ path: '/index' }" 
                class="menu-item"
              >
              Mostrar todo
              </NuxtLink>
              <NuxtLink 
                v-for="cat in categorias" 
                :key="cat.id" 
                :to="{ path: '/index', query: { categoria: cat.id } }" 
                class="menu-item"
              >
                {{ cat.nombre }}
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Botón Perfil -->
        <NuxtLink to="/perfil" class="nav-btn btn-accent">
          <button name="mdi:account-circle" class="icon" />
          Perfil
        </NuxtLink>
        <NuxtLink to="/pedidos" class="nav-btn btn-accent">
          <button name="mdi:account-circle" class="icon" />
          Mis pedidos
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const { $axios } = useNuxtApp();

const categorias = ref([]);

const fetchCategorias = async () => {
  try {
    const { data } = await $axios.get('/products/categorias/');
    categorias.value = data.slice(0, 10);
  } catch (error) {
    console.error("Error fetching categorias:", error);
  }
};

onMounted(fetchCategorias);
</script>

<style scoped lang="scss">
@import '../assets/scss/_variables.scss';
@import '../assets/scss/global.scss';

.navbar {
  position: sticky;
  top: 0;
  background: rgba($secondary, 0.90);
  backdrop-filter: blur(6px);
  z-index: 1000;
  padding: 0.5rem;
  transition: all 0.3s;
  width: 100%;
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  
  
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%; // Eliminado el límite de 1200px [[6]]
    margin: 0 auto;
    padding: 0 2rem; // Espaciado lateral mantenido [[8]]
  }

  .logo {
    font-size: 1.75rem;
    color: $white;
    transition: color 0.3s;
    
    &:hover {
      color: $accent;
    }
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: nowrap;
  }

  .nav-btn {
    display: flex;
    align-items: center;
    padding: 12px 24px;
    background: none;
    border: none;
    color: $white;
    transition: all 0.3s;
    
    .icon {
      margin-left: 0.5rem;
      transition: transform 0.3s;
    }
  }

  .dropdown {
    position: relative;
    
    &:hover {
      .icon {
        transform: rotate(-180deg);
      }
    }
  }

  .dropdown-menu {
    position: absolute;
    top: 110%;
    left: 50%;
    transform: translateX(-50%);
    background: $secondary;
    border-radius: 12px;
    min-width: 200px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s;
    
    .menu-inner {
      max-height: 400px;
      overflow-y: auto;
      scrollbar-color: $white;
    }
  }

  .dropdown:hover .dropdown-menu {
    top: 100%;
    opacity: 1;
    visibility: visible;
  }

  .menu-item {
    display: flex;
    padding: 12px 20px;
    width: 100%;
    color: $white;
    transition: all 0.3s;
    
    &:hover {
      background: $primary;
      transform: translateX(10px);
    }
    
    &.router-link-active {
      background: $accent;
      font-weight: 600;
    }
  }
}
</style>