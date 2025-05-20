<template>
  <Header />
  <Navbar />
  <div class="mi-tienda-page bg-gradient-to-br from-gray-100 via-white to-blue-50 p-6">
    <h1 class="text-4xl font-bold text-center text-indigo-700 mb-12">Mi Tienda</h1>

    <!-- Sección 1: Mis Productos -->
    <section class="mis-productos bg-white p-6 rounded-lg shadow-md mb-12">
      <h2 class="text-2xl font-semibold text-indigo-700 mb-6">Mis Productos</h2>
      <div v-if="misProductos.length > 0" class="productos-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <div
          v-for="producto in misProductos"
          :key="producto.id"
          class="producto-card relative bg-white p-4 rounded-lg shadow transition-shadow group"
        >
          <img
            :src="producto.imagen"
            :alt="producto.titulo"
            class="w-full h-48 object-cover rounded-md mb-4 transition-filter duration-300 group-hover:blur-sm"
          />

          <div
            class="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"
          >
            <button
              @click="onEditar(producto)"
              class="px-4 py-2 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-indigo-100 transition"
            >
              Editar
            </button>
          </div>

          <div class="product-info text-center">
            <h3 class="text-xl font-medium text-indigo-600 mb-2">{{ producto.titulo }}</h3>
            <p class="text-lg text-gray-700">Precio: ${{ producto.precio }}</p>
            <p class="text-sm text-gray-500">Categoría: {{ producto.categoria }}</p>
          </div>
        </div>
      </div>
      <p v-else class="text-center text-gray-500">No has subido productos aún.</p>
    </section>

    <!-- Sección 2: Crear / Editar Producto -->
    <section class="crear-producto bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-semibold text-indigo-700 mb-6">
        {{ estaEditando ? 'Editar Producto' : 'Crear Producto' }}
      </h2>
      <form @submit.prevent="estaEditando ? guardarCambios() : crearProducto()" class="product-form space-y-6">
        <div>
          <label for="titulo" class="block text-lg font-medium text-gray-700">Título:</label>
          <input
            type="text"
            id="titulo"
            v-model="nuevoProducto.titulo"
            required
            class="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label for="descripcion" class="block text-lg font-medium text-gray-700">Descripción:</label>
          <textarea
            id="descripcion"
            v-model="nuevoProducto.descripcion"
            required
            class="w-full p-3 border border-gray-300 rounded-lg"
          ></textarea>
        </div>

        <div>
          <label for="precio" class="block text-lg font-medium text-gray-700">Precio:</label>
          <input
            type="number"
            id="precio"
            v-model="nuevoProducto.precio"
            step="0.01"
            required
            class="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label for="categoria" class="block text-lg font-medium text-gray-700">Categoría:</label>
          <select
            id="categoria"
            v-model="nuevoProducto.categoria"
            required
            class="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option v-if="categorias.length === 0" disabled>No hay categorías disponibles</option>
            <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">{{ categoria.nombre }}</option>
          </select>
        </div>

        <div>
          <label class="block text-lg font-medium text-gray-700">Imagen:</label>
          <!-- Preview de imagen existente al editar -->
          <img v-if="estaEditando && nuevoProducto.imagenPreview" :src="nuevoProducto.imagenPreview" alt="Preview Imagen" class="w-32 h-32 object-cover rounded-md mb-4" />
          <input
            type="file"
            @change="handleImageUpload"
            class="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <button
          type="submit"
          class="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300"
        >
          {{ estaEditando ? 'Guardar Cambios' : 'Crear Producto' }}
        </button>
        <button
          v-if="estaEditando"
          type="button"
          @click="cancelarEdicion()"
          class="w-full py-3 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition duration-300"
        >
          Cancelar
        </button>
      </form>
    </section>

    <!-- Sección 3: Envíos Pendientes -->
    <section class="envios-pendientes bg-white p-6 rounded-lg shadow-md mt-12">
      <h2 class="text-2xl font-semibold text-indigo-700 mb-6">Envíos Pendientes</h2>
      <div v-if="enviosPendientes.length > 0" class="pedidos-list space-y-6">
        <div
          v-for="pedido in enviosPendientes"
          :key="pedido.id"
          class="pedido-card bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <h3 class="text-xl font-medium text-indigo-600">Pedido #{{ pedido.id }}</h3>
          <p class="text-lg text-gray-700">Total: ${{ pedido.total }}</p>
          <p class="text-sm text-gray-500">Dirección: {{ pedido.calle }}, {{ pedido.ciudad }}</p>
          <button
            class="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300"
            @click="marcarComoEnviado(pedido.id)"
          >
            Marcar como Enviado
          </button>
        </div>
      </div>
      <p v-else class="text-center text-gray-500">No hay envíos pendientes.</p>
    </section>
  </div>
  <Footer />
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
  imagenPreview: null
});
const productoSeleccionado = ref(null);
const estaEditando = ref(false);

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
  fetchMisProductos(); fetchCategorias(); fetchEnviosPendientes();
});

const fetchMisProductos = async () => {
  try {
    const { data } = await $axios.get('/products/mis-productos/');
    misProductos.value = data;
  } catch (error) {
    if (error.response && [401,403].includes(error.response.status)) {
      alert('Debes iniciar sesión para ver tus productos.'); router.push('/login');
    } else {
      console.error(error); alert('No se pudieron cargar tus productos.');
    }
  }
};
const fetchCategorias = async () => {
  try { categorias.value = (await $axios.get('/products/categorias/')).data; }
  catch(e){ console.error(e); alert('Error cargando categorías.'); }
};
const fetchEnviosPendientes = async () => {
  try { enviosPendientes.value = (await $axios.get('/orders/envios-pendientes/')).data; }
  catch(e){ console.error(e); alert('Error cargando envíos pendientes.'); }
};

const handleImageUpload = e => {
  const file = e.target.files[0];
  nuevoProducto.value.imagen = file;
  nuevoProducto.value.imagenPreview = URL.createObjectURL(file);
};

const crearProducto = async () => {
  if (!nuevoProducto.value.titulo || !nuevoProducto.value.descripcion || !nuevoProducto.value.precio || !nuevoProducto.value.categoria || !nuevoProducto.value.imagen) {
    return alert('Completa todos los campos.');
  }
  const fd = new FormData();
  Object.entries(nuevoProducto.value).forEach(([k,v])=>{
    if(k==='imagen'&&!v) return;
    fd.append(k,v);
  });
  try {
    await $axios.post('/products/productos/', fd, { headers:{ 'Content-Type':'multipart/form-data' }});
    await fetchMisProductos(); resetForm(); alert('Producto creado.');
  } catch(e){ console.error(e); alert('Error creando producto.'); }
};

const onEditar = producto => {
  nuevoProducto.value = {
    titulo: producto.titulo,
    descripcion: producto.descripcion,
    precio: producto.precio,
    categoria: producto.categoria,
    imagen: null,
    imagenPreview: producto.imagen
  };
  productoSeleccionado.value = producto.id;
  estaEditando.value = true;
  document.querySelector('.crear-producto').scrollIntoView({ behavior:'smooth' });
};

const guardarCambios = async () => {
  const fd = new FormData();
  ['titulo','descripcion','precio','categoria'].forEach(k=> fd.append(k,nuevoProducto.value[k]));
  if(nuevoProducto.value.imagen) fd.append('imagen', nuevoProducto.value.imagen);
  try {
    await $axios.patch(`/products/productos/${productoSeleccionado.value}/`, fd, { headers:{ 'Content-Type':'multipart/form-data' }});
    await fetchMisProductos(); resetForm(); alert('Producto actualizado.');
  } catch(e){ console.error(e); alert('Error guardando cambios.'); }
};

const cancelarEdicion = () => resetForm();

const marcarComoEnviado = async id => {
  try { await $axios.patch(`/orders/pedidos/${id}/`, { estado:'enviado' }); await fetchEnviosPendientes(); alert('Envío enviado.'); }
  catch(e){ console.error(e); alert('Error marcando envío.'); }
};

const resetForm = () => {
  nuevoProducto.value = { titulo:'', descripcion:'', precio:0, categoria:null, imagen:null, imagenPreview:null };
  productoSeleccionado.value=null; estaEditando.value=false;
};
</script>

<style scoped>
/* estilos adicionales opcionales */
</style>
