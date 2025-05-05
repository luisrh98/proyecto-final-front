<template>
  <nav class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
      <!-- Logo -->
      <NuxtLink to="/" class="text-2xl font-bold tracking-wider hover:text-indigo-100 transition duration-300">
        Inicio
      </NuxtLink>
      
      <!-- Contenedor de acciones -->
      <div class="flex gap-4 items-center space-x-6">
        <!-- Menú Categorías -->
        <div class="relative">
          <button class="nav-btn bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-full text-white flex items-center gap-2 focus:outline-none">
            Categorías
            <Icon name="mdi:menu-down" class="text-xl" />
          </button>
          <div class="dropdown-menu absolute hidden bg-white text-gray-800 rounded-lg shadow-lg mt-2 w-48 z-10">
            <div class="py-2">
              <NuxtLink 
                :to="{ path: '/' }" 
                class="menu-item block px-4 py-2 hover:bg-indigo-500 hover:text-white transition duration-200"
              >
                Mostrar todo
              </NuxtLink>
              <NuxtLink 
                v-for="cat in categorias" 
                :key="cat.id" 
                :to="{ path: '/', query: { categoria: cat.id } }" 
                class="menu-item block px-4 py-2 hover:bg-indigo-500 hover:text-white transition duration-200"
              >
                {{ cat.nombre }}
              </NuxtLink>
            </div>
          </div>
        </div>
        
        <!-- Botones de navegación -->
        <NuxtLink 
          to="/panel_administrador" 
          class="nav-btn bg-purple-700 hover:bg-purple-800 text-white rounded-full py-2 px-4 flex items-center gap-2 transition duration-300"
        >
          <Icon name="mdi:account-circle" class="text-xl" />
          Panel administrador
        </NuxtLink>
        
        <NuxtLink 
          to="/gestor/gestion_pedidos" 
          class="nav-btn bg-purple-700 hover:bg-purple-800 text-white rounded-full py-2 px-4 flex items-center gap-2 transition duration-300"
        >
          <Icon name="mdi:account-circle" class="text-xl" />
          Gestionar productos
        </NuxtLink>

        <NuxtLink 
          to="/perfil" 
          class="nav-btn bg-purple-700 hover:bg-purple-800 text-white rounded-full py-2 px-4 flex items-center gap-2 transition duration-300"
        >
          <Icon name="mdi:account-circle" class="text-xl" />
          Perfil
        </NuxtLink>

        <NuxtLink 
          to="/pedidos" 
          class="nav-btn bg-purple-700 hover:bg-purple-800 text-white rounded-full py-2 px-4 flex items-center gap-2 transition duration-300"
        >
          <Icon name="mdi:account-circle" class="text-xl" />
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
    categorias.value = data.slice(0, 10);  // Limitar a las primeras 10 categorías
  } catch (error) {
    console.error("Error fetching categorias:", error);
  }
};

onMounted(fetchCategorias);
</script>

<style scoped>
/* Estilos para el dropdown */
.nav-btn:hover + .dropdown-menu, .dropdown-menu:hover {
  display: block;
}
.dropdown-menu {
  display: none;
}

/* Estilo general para los items de menú */
.menu-item {
  font-size: 1rem;
  padding: 0.5rem 1rem;
  color: #4B5563;
  text-decoration: none;
}
.menu-item:hover {
  background-color: #5B21B6; /* Fondo hover */
  color: white;
}
</style>
