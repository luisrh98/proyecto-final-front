<template>
  <div class="page-container">
    <!-- Cabecera -->
    <Header></Header>

    <!-- Barra de navegación con menú desplegable -->
    <div class="nav-bar">
      <Navbar />
    </div>

    <!-- Contenido principal -->
    <div class="content-wrapper">
      <!-- Sección destacada -->
      <section class="hero-section">
        <h2>Productos Destacados</h2>

        <!-- Barra de filtrado -->
        <div class="filter-bar">
          <input
            type="text"
            v-model="filtroNombre"
            placeholder="Buscar por nombre..."
            @input="changePage(1)"
            class="search-input"
          />
          <select
            v-model="ordenPrecio"
            @change="changePage(1)"
            class="order-select"
          >
            <option value="">Ordenar por...</option>
            <option value="asc">Precio más bajo</option>
            <option value="desc">Precio más alto</option>
          </select>
        </div>

        <!-- Lista de productos -->
        <div class="product-grid">
          <ProductoList :productos="paginatedProducts" />
        </div>

        <!-- Paginación (solo si hay más productos) -->
        <div v-if="productos.length > itemsPerPage" class="pagination">
          <button @click="changePage(page - 1)" :disabled="page === 1">
            Anterior
          </button>
          <span>{{ page }} de {{ totalPages }}</span>
          <button @click="changePage(page + 1)" :disabled="page === totalPages">
            Siguiente
          </button>
        </div>
      </section>
    </div>

    <!-- Footer -->
    <Footer></Footer>
  </div>
</template>

<script setup>
import ProductoList from '../components/producto/ProductoList.vue';
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { jwtDecode } from 'jwt-decode';
import { navigateTo, useNuxtApp } from '#app';

// Variables reactivas
const user = ref(null);
const productos = ref([]);
const page = ref(1);
const itemsPerPage = 6;

const { $axios } = useNuxtApp();
const route = useRoute();

// Función para obtener productos
const fetchProductos = async () => {
  try {
    const categoriaId = route.query.categoria;
    console.log('ID de categoría:', categoriaId);
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

// Verificar sesión del usuario
if (import.meta.client) {
  onMounted(() => {
    const authToken = sessionStorage.getItem('authToken');
    if (authToken) {
      try {
        const decodedToken = jwtDecode(authToken);
        if (decodedToken.exp * 1000 < Date.now()) {
          sessionStorage.removeItem('authToken');
          navigateTo('/login');
        }
      } catch {
        sessionStorage.removeItem('authToken');
        navigateTo('/login');
      }
    }
    const authUser = sessionStorage.getItem('authUser');
    if (authUser) {
      user.value = authUser;
    }
  });
}

// Obtener productos al montar
onMounted(() => {
  fetchProductos();
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
    navigateTo('/login');
  }
};
</script>

<style lang="scss" scoped>
@import '../assets/scss/_variables.scss';
@import '../assets/scss/global.scss';

.page-container {
  min-height: 100vh;
  justify-items: center;
}

/* Nav Bar */
.nav-bar {
  width: 100%;
  justify-content: center;
}

/* Contenido principal */
.content-wrapper {
  grid-area: content;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  width: 100%;
  max-width: 1200px;
}

.hero-section {
  background: $white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: $box-shadow;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.product-grid {
  gap: 20px;
  width: 100%;
  max-width: 1200px;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;

  button {
    padding: 10px 20px;
    background: $accent;
    border: none;
    color: white;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s ease;

    &:hover {
      background: darken($accent, 10%);
    }

    &:disabled {
      background: $gray;
      cursor: not-allowed;
    }
  }

  span {
    font-size: 1.2rem;
    display: flex;
    align-items: center;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .page-container {
    grid-template-areas:
      'header'
      'nav'
      'content'
      'footer';
    grid-template-columns: 1fr;
  }

  .nav-bar {
    overflow-x: auto;
    white-space: nowrap;
    justify-content: center;
  }

  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>
