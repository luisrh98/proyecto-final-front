<template>
  <div class="page-container">
    <!-- Cabecera -->
    <Header />

    <!-- Barra de navegación -->
    <div class="nav-bar">
      <Navbar />
    </div>

    <!-- Contenido principal -->
    <div class="content-wrapper py-12 px-6">
      <section class="hero-section text-center">
        <h2 class="text-3xl font-bold mb-8">Productos Destacados</h2>

        <!-- Barra de filtrado -->
        <div
          class="filter-bar mb-12 flex flex-col md:flex-row items-center justify-center gap-6"
        >
          <input
            type="text"
            v-model="filtroNombre"
            placeholder="Buscar por nombre..."
            @input="onFilterChange"
            class="search-input py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-1/3"
          />
          <select
            v-model="ordenPrecio"
            @change="onFilterChange"
            class="order-select py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-1/4"
          >
            <option value="">Ordenar por...</option>
            <option value="asc">Precio más bajo</option>
            <option value="desc">Precio más alto</option>
          </select>
        </div>

        <!-- Lista de productos -->
        <div class="product-list-container mb-12">
          <ProductoList :productos="productos" />
        </div>

        <!-- Paginación -->
        <div
          v-if="totalPages > 1"
          class="pagination flex justify-center items-center gap-6 mt-8"
        >
          <button
            @click="changePage(page - 1)"
            :disabled="page === 1"
            class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-500 transition duration-300"
          >
            Anterior
          </button>
          <span class="text-lg font-semibold">
            Página {{ page }} de {{ totalPages }}
          </span>
          <button
            @click="changePage(page + 1)"
            :disabled="page === totalPages"
            class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-500 transition duration-300"
          >
            Siguiente
          </button>
        </div>
      </section>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useNuxtApp } from '#app';
import { useAuthStore } from '~/stores/auth';


const { $axios } = useNuxtApp();
const route = useRoute();
const authStore = useAuthStore();

// Estados
const productos = ref([]);
const page = ref(1);
const totalPages = ref(1);
const filtroNombre = ref('');
const ordenPrecio = ref('');

// Fijamos el tamaño de página (coincide con PAGE_SIZE en settings.py)
const PAGE_SIZE = 9;

// Construye y realiza la llamada al backend
const fetchProductos = async () => {
  const params = {
    page: page.value,
    search: filtroNombre.value || undefined,
    ordering:
      ordenPrecio.value === 'asc'
        ? 'precio'
        : ordenPrecio.value === 'desc'
        ? '-precio'
        : undefined,
    categoria: route.query.categoria || undefined,
  };

  try {
    const { data } = await $axios.get('/products/productos/', { params });
    productos.value = data.results;
    totalPages.value = Math.ceil(data.count / PAGE_SIZE);
  } catch (err) {
    console.error('Error cargando productos:', err);
  }
};

// Resetear página a 1 y refetch al cambiar filtros
const onFilterChange = () => {
  page.value = 1;
  fetchProductos();
};

// Cambio de página
const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    page.value = newPage;
    fetchProductos();
  }
};

// Al montar
onMounted(async () => {
  authStore.cargarTokensDesdeSession();
  await fetchProductos();
});

// Reactividad a cambios de categoría en la URL
watch(() => route.query.categoria, () => {
  page.value = 1;
  fetchProductos();
});
</script>

<style scoped>
/* ... tus estilos existentes ... */
</style>
