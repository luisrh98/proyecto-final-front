<template>
  <Header/>
  <Navbar/>
  <div class="mi-tienda-page bg-gradient-to-br from-gray-100 via-white to-blue-50 p-6">
    <h1 class="text-4xl font-bold text-center text-indigo-700 mb-12">Mi Tienda</h1>

    <!-- Sección 1: Mis Productos -->
    <section class="mis-productos bg-white p-6 rounded-lg shadow-md mb-12">
      <h2 class="text-2xl font-semibold text-indigo-700 mb-6">Mis Productos</h2>
      <div v-if="misProductos.length > 0" class="productos-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <div v-for="producto in misProductos" :key="producto.id" class="producto-card bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
          <img :src="producto.imagen" :alt="producto.titulo" class="w-full h-48 object-cover rounded-md mb-4" />
          <div class="product-info text-center">
            <h3 class="text-xl font-medium text-indigo-600 mb-2">{{ producto.titulo }}</h3>
            <p class="text-lg text-gray-700">Precio: ${{ producto.precio }}</p>
            <p class="text-sm text-gray-500">Categoría: {{ producto.categoria }}</p>
          </div>
        </div>
      </div>
      <p v-else class="text-center text-gray-500">No has subido productos aún.</p>
    </section>

    <!-- Sección 2: Crear Producto -->
    <section class="crear-producto bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-semibold text-indigo-700 mb-6">Crear Producto</h2>
      <form @submit.prevent="crearProducto" class="product-form space-y-6">
        <div>
          <label for="titulo" class="block text-lg font-medium text-gray-700">Título:</label>
          <input type="text" id="titulo" v-model="nuevoProducto.titulo" required class="w-full p-3 border border-gray-300 rounded-lg" />
        </div>

        <div>
          <label for="descripcion" class="block text-lg font-medium text-gray-700">Descripción:</label>
          <textarea id="descripcion" v-model="nuevoProducto.descripcion" required class="w-full p-3 border border-gray-300 rounded-lg"></textarea>
        </div>

        <div>
          <label for="precio" class="block text-lg font-medium text-gray-700">Precio:</label>
          <input type="number" id="precio" v-model="nuevoProducto.precio" step="0.01" required class="w-full p-3 border border-gray-300 rounded-lg" />
        </div>

        <div>
          <label for="categoria" class="block text-lg font-medium text-gray-700">Categoría:</label>
          <select id="categoria" v-model="nuevoProducto.categoria" required class="w-full p-3 border border-gray-300 rounded-lg">
            <option v-if="categorias.length === 0" disabled>No hay categorías disponibles</option>
            <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">{{ categoria.nombre }}</option>
          </select>
        </div>

        <div>
          <label for="imagen" class="block text-lg font-medium text-gray-700">Imagen:</label>
          <input type="file" id="imagen" @change="handleImageUpload" class="w-full p-3 border border-gray-300 rounded-lg" />
        </div>

        <button type="submit" class="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300">Crear Producto</button>
      </form>
    </section>

    <!-- Sección 3: Envíos Pendientes -->
    <section class="envios-pendientes bg-white p-6 rounded-lg shadow-md mt-12">
      <h2 class="text-2xl font-semibold text-indigo-700 mb-6">Envíos Pendientes</h2>
      <div v-if="enviosPendientes.length > 0" class="pedidos-list space-y-6">
        <div v-for="pedido in enviosPendientes" :key="pedido.id" class="pedido-card bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h3 class="text-xl font-medium text-indigo-600">Pedido #{{ pedido.id }}</h3>
          <p class="text-lg text-gray-700">Total: ${{ pedido.total }}</p>
          <p class="text-sm text-gray-500">Dirección: {{ pedido.calle }}, {{ pedido.ciudad }}</p>
          <button class="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300" @click="marcarComoEnviado(pedido.id)">
            Marcar como Enviado
          </button>
        </div>
      </div>
      <p v-else class="text-center text-gray-500">No hay envíos pendientes.</p>
    </section>
  </div>
  <Footer/>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useNuxtApp } from '#app';
import Footer from '~/components/Footer.vue';

const authStore = useAuthStore();
const router = useRouter();
const { $axios } = useNuxtApp();

// Estados
const misProductos = ref([]);
const enviosPendientes = ref([]);
const categorias = ref([]);
const nuevoProducto = ref({
  titulo: '',
  descripcion: '',
  precio: 0,
  categoria: null,
  imagen: null,
});

// Fetch inicial
onMounted(() => {
  authStore.cargarTokensDesdeSession();

  if (!authStore.isLoggedIn) {
    alert('Debes iniciar sesión para acceder a esta página.');
    router.push('/login');
    return;
  }

  if (authStore.authToken) {
    $axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.authToken}`;
  }

  fetchMisProductos();
  fetchCategorias();
  fetchEnviosPendientes();
});

// Métodos
const fetchMisProductos = async () => {
  try {
    const { data } = await $axios.get('/products/mis-productos/');
    misProductos.value = data;
  } catch (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      alert('Debes iniciar sesión para ver tus productos.');
      router.push('/login');
    } else {
      console.error('Error al cargar productos:', error);
      alert('No se pudieron cargar tus productos. Por favor, intenta más tarde.');
    }
  }
};

const fetchCategorias = async () => {
  try {
    const { data } = await $axios.get('/products/categorias/');
    categorias.value = data;
  } catch (error) {
    console.error('Error al cargar categorías:', error);
    alert('No se pudieron cargar las categorías. Por favor, intenta más tarde.');
  }
};

const fetchEnviosPendientes = async () => {
  try {
    const { data } = await $axios.get('/orders/envios-pendientes/');
    enviosPendientes.value = data;
  } catch (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      alert('Debes iniciar sesión para ver los envíos pendientes.');
      router.push('/login');
    } else {
      console.error('Error al cargar envíos pendientes:', error);
      alert('No se pudieron cargar los envíos pendientes. Por favor, intenta más tarde.');
    }
  }
};

const handleImageUpload = (event) => {
  nuevoProducto.value.imagen = event.target.files[0];
};

const crearProducto = async () => {
  if (!nuevoProducto.value.titulo || !nuevoProducto.value.descripcion || !nuevoProducto.value.precio || !nuevoProducto.value.categoria || !nuevoProducto.value.imagen) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  const formData = new FormData();
  formData.append('titulo', nuevoProducto.value.titulo);
  formData.append('descripcion', nuevoProducto.value.descripcion);
  formData.append('precio', nuevoProducto.value.precio);
  formData.append('categoria', nuevoProducto.value.categoria);
  formData.append('imagen', nuevoProducto.value.imagen);

  try {
    await $axios.post('/products/productos/', formData);

    await fetchMisProductos();
    resetForm();
    alert('Producto creado exitosamente.');
  } catch (error) {
    console.error('Error al crear el producto:', error);
    alert('No se pudo crear el producto. Por favor, intenta más tarde.');
  }
};

const marcarComoEnviado = async (pedidoId) => {
  try {
    await $axios.patch(`/orders/pedidos/${pedidoId}/`, { estado: 'enviado' });
    await fetchEnviosPendientes();
    alert('El envío ha sido marcado como enviado.');
  } catch (error) {
    console.error('Error al marcar el envío como enviado:', error);
    alert('No se pudo actualizar el estado del envío. Por favor, intenta más tarde.');
  }
};

const resetForm = () => {
  nuevoProducto.value = {
    titulo: '',
    descripcion: '',
    precio: 0,
    categoria: null,
    imagen: null,
  };
};
</script>
