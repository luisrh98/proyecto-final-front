<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-10 px-4 flex flex-col items-center justify-center">
    
    <!-- Botón carrito -->
    <div class="mb-8">
      <NuxtLink to="/carrito" class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-lg hover:scale-105 transition-transform duration-300">
        🛒 Carrito ({{ cartStore.totalItems }})
      </NuxtLink>
    </div>

    <!-- Lista de productos -->
    <div v-if="productos.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
      <div v-for="producto in productos" :key="producto.id" class="transform transition-transform duration-300 hover:-translate-y-1">
        <div class="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
          <img
            v-if="producto.imagen"
            :src="producto.imagen"
            :alt="producto.titulo"
            class="h-48 w-full object-cover"
          />
          <div class="p-6 flex flex-col flex-grow">
            <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ producto.titulo }}</h3>
            <p class="text-gray-600 text-sm flex-grow">{{ producto.descripcion }}</p>
            <div class="text-sm text-gray-700 mt-4 space-y-1">
              <p><strong>Precio:</strong> {{ producto.precio }} €</p>
              <p><strong>Categoría:</strong> {{ producto.categoria }}</p>
            </div>
            <div class="mt-6 flex gap-2">
              <NuxtLink :to="`/producto/${producto.id}`" class="flex-1 text-center px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors duration-300">
                Ver producto
              </NuxtLink>
              <button @click="addToCart(producto)" class="flex-1 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors duration-300">
                Añadir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sin productos -->
    <div v-else class="text-gray-600 text-lg mt-10">No hay productos disponibles.</div>

    <!-- Notificación -->
    <transition name="fade">
      <div v-if="message" class="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white shadow-lg border border-gray-200 px-6 py-3 rounded-full text-gray-800">
        {{ message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
defineProps({
  productos: {
    type: Array,
    required: true
  }
});

import { useCartStore } from '@/stores/cart';
const cartStore = useCartStore();
const message = ref('');

const addToCart = (producto) => {
  const cantidad = 1;
  cartStore.addItem(producto, cantidad);
  message.value = `Se ha añadido ${cantidad} unidad(es) de "${producto.titulo}" al carrito.`;
  setTimeout(() => {
    message.value = '';
  }, 3000);
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
