<template>
  <div class="page-container">

    <!-- Cabecera -->
    <Header />

    <!-- Barra de navegación con menú desplegable -->
    <div class="nav-bar">
      <Navbar />
    </div>

    <!-- Contenido principal -->
    <div class="content-wrapper py-12 px-6">
      <!-- Sección destacada -->
      <section class="hero-section text-center">

        <h2 class="text-3xl font-bold mb-8">Productos Destacados</h2>

        <!-- Barra de filtrado -->
        <div class="filter-bar mb-12 flex flex-col md:flex-row items-center justify-center gap-6">
          <input
            type="text"
            v-model="filtroNombre"
            placeholder="Buscar por nombre..."
            @input="changePage(1)"
            class="search-input py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-1/3"
          />
          <select
            v-model="ordenPrecio"
            @change="changePage(1)"
            class="order-select py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-1/4"
          >
            <option value="">Ordenar por...</option>
            <option value="asc">Precio más bajo</option>
            <option value="desc">Precio más alto</option>
          </select>
        </div>

        <!-- Lista de productos -->
        <div class="product-list-container mb-12">
          <ProductoList :productos="paginatedProducts" />
        </div>

        <!-- Paginación (solo si hay más productos) -->
        <div v-if="productos.length > itemsPerPage" class="pagination flex justify-center items-center gap-6 mt-8">
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
import ProductoList from '../components/producto/ProductoList.vue';
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '~/stores/auth';  // Importa la tienda de autenticación

// Variables reactivas
const productos = ref([]);
const page = ref(1);
const itemsPerPage = 6;
const { $axios } = useNuxtApp();
const route = useRoute();

// Usa la tienda de autenticación
const authStore = useAuthStore();

// Función para obtener productos
const fetchProductos = async () => {
  try {
    const categoriaId = route.query.categoria;
    let response;
    if (categoriaId) {
      response = await $axios.get('products/productos', {
        params: { categoria: categoriaId },
      });
    } else {
      response = await $axios.get('products/productos');
    }
    productos.value = response.data;
    page.value = 1;
  } catch (err) {
    console.error('Error cargando datos de la API:', err);
  }
};

// Verificar sesión del usuario usando authStore
onMounted(() => {
  authStore.cargarTokensDesdeSession();  // Cargar los datos desde sessionStorage
  fetchProductos();
  if (import.meta.client) {
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const s1 = document.createElement("script");
    s1.async = true;
    s1.src = "https://embed.tawk.to/6819bfae5510d619105dd3bd/1iqi99gjf";
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");

    const s0 = document.getElementsByTagName("script")[0];
    if (s0?.parentNode) {
      s0.parentNode.insertBefore(s1, s0);
    }
  }
});

// Observar cambios en la categoría
watch(
  () => route.query.categoria,
  () => {
    fetchProductos();
  }
);

// Filtros
const filtroNombre = ref('');
const ordenPrecio = ref('');

// Productos filtrados
const productosFiltrados = computed(() => {
  let resultado = productos.value;

  if (filtroNombre.value.trim()) {
    resultado = resultado.filter((producto) =>
      producto.titulo.toLowerCase().includes(filtroNombre.value.toLowerCase())
    );
  }

  if (ordenPrecio.value === 'asc') {
    resultado = resultado.sort((a, b) => a.precio - b.precio);
  } else if (ordenPrecio.value === 'desc') {
    resultado = resultado.sort((b, a) => a.precio - b.precio);
  }

  return resultado;
});

// Productos paginados
const paginatedProducts = computed(() => {
  const start = (page.value - 1) * itemsPerPage;
  const end = page.value * itemsPerPage;
  return productosFiltrados.value.slice(start, end);
});

// Total de páginas
const totalPages = computed(() => {
  return Math.ceil(productos.value.length / itemsPerPage);
});

// Cambiar página
const changePage = (newPage) => {
  if (newPage > 0 && newPage <= totalPages.value) {
    page.value = newPage;
  }
};

// Cerrar sesión
const logout = () => {
  if (import.meta.client) {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('authUser');
    authStore.logout(); // Llama al método de logout en el authStore para manejar el estado
    navigateTo('/login');
  }
};
</script>