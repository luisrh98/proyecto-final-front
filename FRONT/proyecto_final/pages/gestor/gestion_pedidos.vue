<template>
    <div class="mi-tienda-page">
      <h1>Mi Tienda</h1>
  
      <!-- Sección 1: Mis Productos -->
      <section class="mis-productos">
        <h2>Mis Productos</h2>
        <div v-if="misProductos.length > 0" class="productos-list">
          <div v-for="producto in misProductos" :key="producto.id" class="producto-card">
            <img :src="producto.imagen" :alt="producto.titulo" class="product-image" />
            <div class="product-info">
              <h3>{{ producto.titulo }}</h3>
              <p>Precio: ${{ producto.precio }}</p>
              <p>Categoría: {{ producto.categoria.nombre }}</p>
            </div>
          </div>
        </div>
        <p v-else>No has subido productos aún.</p>
      </section>
  
      <!-- Sección 2: Crear Producto -->
      <section class="crear-producto">
        <h2>Crear Producto</h2>
        <form @submit.prevent="crearProducto" class="product-form">
          <label for="titulo">Título:</label>
          <input type="text" id="titulo" v-model="nuevoProducto.titulo" required />
  
          <label for="descripcion">Descripción:</label>
          <textarea id="descripcion" v-model="nuevoProducto.descripcion" required></textarea>
  
          <label for="precio">Precio:</label>
          <input type="number" id="precio" v-model="nuevoProducto.precio" step="0.01" required />
  
          <label for="categoria">Categoría:</label>
          <select id="categoria" v-model="nuevoProducto.categoria" required>
            <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
              {{ categoria.nombre }}
            </option>
          </select>
  
          <label for="imagen">Imagen:</label>
          <input type="file" id="imagen" @change="handleImageUpload" />
  
          <button type="submit" class="btn btn-accent">Crear Producto</button>
        </form>
      </section>
  
      <!-- Sección 3: Envíos Pendientes -->
      <section class="envios-pendientes">
        <h2>Envíos Pendientes</h2>
        <div v-if="enviosPendientes.length > 0" class="pedidos-list">
          <div v-for="pedido in enviosPendientes" :key="pedido.id" class="pedido-card">
            <h3>Pedido #{{ pedido.id }}</h3>
            <p>Total: ${{ pedido.total }}</p>
            <p>Dirección: {{ pedido.calle }}, {{ pedido.ciudad }}</p>
            <button class="btn btn-secondary" @click="marcarComoEnviado(pedido.id)">
              Marcar como Enviado
            </button>
          </div>
        </div>
        <p v-else>No hay envíos pendientes.</p>
      </section>
    </div>
  </template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useNuxtApp } from '#app';

const authStore = useAuthStore();
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
onMounted(async () => {
  await fetchMisProductos();
  await fetchCategorias();
  await fetchEnviosPendientes();
});

// Métodos
const fetchMisProductos = async () => {
  const { data } = await $axios.get('/products/mis-productos/');
  misProductos.value = data;
};

const fetchCategorias = async () => {
  const { data } = await $axios.get('/products/categorias/');
  categorias.value = data;
};

const fetchEnviosPendientes = async () => {
  const { data } = await $axios.get('/orders/envios-pendientes/');
  enviosPendientes.value = data;
};

const handleImageUpload = (event) => {
  nuevoProducto.value.imagen = event.target.files[0];
};

const crearProducto = async () => {
  const formData = new FormData();
  formData.append('titulo', nuevoProducto.value.titulo);
  formData.append('descripcion', nuevoProducto.value.descripcion);
  formData.append('precio', nuevoProducto.value.precio);
  formData.append('categoria', nuevoProducto.value.categoria);
  formData.append('imagen', nuevoProducto.value.imagen);

  await $axios.post('/productos/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  await fetchMisProductos();
  resetForm();
};

const marcarComoEnviado = async (pedidoId) => {
  await $axios.patch(`/pedidos/${pedidoId}/`, { estado: 'enviado' });
  await fetchEnviosPendientes();
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
<style lang="scss" scoped>
.mi-tienda-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  
    h1 {
      text-align: center;
      margin-bottom: 2rem;
    }
  
    section {
      margin-bottom: 4rem;
    }
  
    .productos-list, .pedidos-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 2rem;
    }
  
    .producto-card, .pedido-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  
    .product-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 500px;
      margin: 0 auto;
    }
  }
</style>