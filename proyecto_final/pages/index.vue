<template>
  <div class="page-container">
    <!-- Cabecera -->
    <Header></Header>

    <!-- Barra de navegación con menú desplegable -->
    <div class="nav-bar">
      <Navbar/>
    </div>

    <!-- Contenido principal -->
    <div class="content-wrapper">
      <!-- Sección destacada -->
      <section class="hero-section">
        <h2>Productos Destacados</h2>
        <div class="product-grid">
          <ProductoList :productos="paginatedProducts" />
        </div>

        <!-- Paginación (solo si hay más productos) -->
        <div v-if="productos.length > itemsPerPage" class="pagination">
          <button @click="changePage(page - 1)" :disabled="page === 1">Anterior</button>
          <span>{{ page }} de {{ totalPages }}</span>
          <button @click="changePage(page + 1)" :disabled="page === totalPages">Siguiente</button>
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
const itemsPerPage = 6; // 3 productos por fila, 2 filas

const { $axios } = useNuxtApp();
const route = useRoute();

// Función para obtener los productos de la API, filtrando por categoría si se indica
const fetchProductos = async () => {
   try {
     const categoriaId = route.query.categoria;
     console.log('ID de categoría:', categoriaId); // Verifica el ID de categoría
     let response;
     if (categoriaId) {
       response = await $axios.get('products/productos', { params: { categoria: categoriaId } });
     } else {
       response = await $axios.get('products/productos');
     }
     productos.value = response.data;
     page.value = 1; // Reinicia la página al cambiar de categoría
   } catch (err) {
     console.error('Error cargando datos de la API:', err);
   }
 };

// Verificar la sesión del usuario
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

// Obtener productos al montar la página
onMounted(() => {
  fetchProductos();
});

// Observar cambios en la query (por ejemplo, cuando se selecciona otra categoría)
watch(
  () => route.query.categoria,
  () => {
    fetchProductos();
  }
);

// Paginación: Obtener los productos para la página actual
const paginatedProducts = computed(() => {
  const start = (page.value - 1) * itemsPerPage;
  const end = page.value * itemsPerPage;
  return productos.value.slice(start, end);
});

// Número total de páginas
const totalPages = computed(() => {
  return Math.ceil(productos.value.length / itemsPerPage);
});

// Cambiar página
const changePage = (newPage) => {
  if (newPage > 0 && newPage <= totalPages.value) {
    page.value = newPage;
  }
};

// Función para cerrar sesión
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
  justify-items: center; /* Centrar los elementos */
}



/* Nav Bar */
.nav-bar {
  width: 100%;
  justify-content: center; /* Centrar el contenido */
}

/* Contenido principal */
.content-wrapper {
  grid-area: content;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  width: 100%;
  max-width: 1200px; /* Limitar el ancho máximo */
  
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
  max-width: 1200px; /* Limitar el ancho máximo */
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
      "header"
      "nav"
      "content"
      "footer";
    grid-template-columns: 1fr;
  }

  .nav-bar {
    overflow-x: auto;
    white-space: nowrap;
    justify-content: center; /* Centrar el contenido */
  }

  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* Ajuste para móviles */
  }
}
</style>
