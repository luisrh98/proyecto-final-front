<template>
  <nav class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
      <!-- Logo -->
      <NuxtLink to="/" class="text-2xl font-bold tracking-wider hover:text-indigo-100 transition duration-300">
        Inicio
      </NuxtLink>

      <!-- Botón de menú móvil -->
      <button @click="menuOpen = !menuOpen" class="lg:hidden focus:outline-none">
        <Icon :name="menuOpen ? 'mdi:close' : 'mdi:menu'" class="text-3xl" />
      </button>

      <!-- Navegación escritorio -->
      <div class="hidden lg:flex gap-4 items-center space-x-6">
        <!-- Categorías -->
        <div
          class="relative"
          @mouseenter="isDropdownOpen = true"
          @mouseleave="isDropdownOpen = false"
        >
          <button
            class="nav-btn bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-full flex items-center gap-2"
          >
            Categorías
            <Icon name="mdi:menu-down" class="text-xl" />
          </button>

          <div
            v-if="isDropdownOpen"
            class="absolute bg-white text-gray-800 rounded-lg shadow-lg mt-2 w-48 z-10"
          >
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

        <!-- Otros enlaces -->
        <NuxtLink
          v-if="authStore.user && authStore.user.tipo === 'admin'"
          to="/panel_administrador"
          class="nav-btn bg-purple-700 hover:bg-purple-800 text-white rounded-full py-2 px-4 flex items-center gap-2"
        >
          <Icon name="mdi:account-circle" class="text-xl" />
          Panel administrador
        </NuxtLink>

        <NuxtLink
          to="/gestor/gestion_pedidos"
          class="nav-btn bg-purple-700 hover:bg-purple-800 text-white rounded-full py-2 px-4 flex items-center gap-2"
        >
          <Icon name="mdi:account-circle" class="text-xl" />
          Gestionar productos
        </NuxtLink>
        <NuxtLink
          to="/perfil"
          class="nav-btn bg-purple-700 hover:bg-purple-800 text-white rounded-full py-2 px-4 flex items-center gap-2"
        >
          <Icon name="mdi:account-circle" class="text-xl" />
          Perfil
        </NuxtLink>
        <NuxtLink
          to="/pedidos"
          class="nav-btn bg-purple-700 hover:bg-purple-800 text-white rounded-full py-2 px-4 flex items-center gap-2"
        >
          <Icon name="mdi:account-circle" class="text-xl" />
          Mis pedidos
        </NuxtLink>
      </div>
    </div>

    <!-- Menú lateral (aside) para móviles -->
    <transition name="slide">
      <aside
        v-if="menuOpen"
        class="fixed top-0 left-0 h-full w-64 bg-white text-gray-800 z-50 shadow-xl px-6 py-4 flex flex-col gap-4"
      >
        <!-- Cerrar botón -->
        <button @click="menuOpen = false" class="self-end text-gray-500 text-2xl">
          <Icon name="mdi:close" />
        </button>

        <!-- Categorías -->
        <div>
          <button @click="toggleDropdown" class="flex items-center justify-between w-full text-left font-semibold text-indigo-600 mb-2">
            Categorías
            <Icon :name="isDropdownOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'" />
          </button>
          <div v-if="isDropdownOpen" class="space-y-2 ml-2">
            <NuxtLink
              :to="{ path: '/' }"
              class="block text-gray-700 hover:text-indigo-600"
              @click="menuOpen = false"
            >
              Mostrar todo
            </NuxtLink>
            <NuxtLink
              v-for="cat in categorias"
              :key="cat.id"
              :to="{ path: '/', query: { categoria: cat.id } }"
              class="block text-gray-700 hover:text-indigo-600"
              @click="menuOpen = false"
            >
              {{ cat.nombre }}
            </NuxtLink>
          </div>
        </div>

        <!-- Otros enlaces (móviles) -->
        <NuxtLink
          v-if="authStore.user && authStore.user.tipo === 'admin'" 
          to="/panel_administrador"
          class="mobile-link"
          @click="menuOpen = false"
        >
          Panel administrador
        </NuxtLink>

        <NuxtLink to="/gestor/gestion_pedidos" class="mobile-link" @click="menuOpen = false">
          Gestionar productos
        </NuxtLink>
        <NuxtLink to="/perfil" class="mobile-link" @click="menuOpen = false">
          Perfil
        </NuxtLink>
        <NuxtLink to="/pedidos" class="mobile-link" @click="menuOpen = false">
          Mis pedidos
        </NuxtLink>
      </aside>
    </transition>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth'; // Asegúrate de importar la tienda correctamente

const authStore = useAuthStore();
const categorias = ref([]);
const menuOpen = ref(false);
const isDropdownOpen = ref(false);

// Cargar categorías al montar
onMounted(() => {
  fetchCategorias();
  authStore.cargarTokensDesdeSession(); // Asegúrate de que los datos se carguen correctamente

});

// Función para obtener las categorías
const fetchCategorias = async () => {
  try {
    const { data } = await useNuxtApp().$axios.get('/products/categorias/');
    categorias.value = data.slice(0, 10); // Limitar a las primeras 10 categorías
  } catch (error) {
    console.error('Error fetching categorias:', error);
  }
};

// Función para alternar el dropdown de categorías
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};
</script>

<style scoped>
.menu-item {
  font-size: 1rem;
  padding: 0.5rem 1rem;
  color: #4B5563;
  text-decoration: none;
}
.menu-item:hover {
  background-color: #5B21B6;
  color: white;
}

.mobile-link {
  font-weight: 500;
  color: #4B5563;
  padding: 0.5rem 0;
  display: block;
  border-bottom: 1px solid #e5e7eb;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from {
  transform: translateX(-100%);
}
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
