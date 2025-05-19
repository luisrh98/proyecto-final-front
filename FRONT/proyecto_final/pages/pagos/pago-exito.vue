<template>
  <div class="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg text-center">
    <h1 class="text-3xl font-extrabold text-green-600">Pago Exitoso</h1>
    <p class="text-lg text-gray-800 mt-4">¡Gracias por tu compra!</p>
    <p class="text-lg text-gray-800 mt-2">Detalles del pago:</p>

    <!-- Información de la factura -->
    <div v-if="factura" class="mt-6 text-left">
      <h3 class="text-2xl font-semibold mb-4">Pedido</h3>
      <p><strong>ID de Pedido:</strong> {{ factura.id }}</p>
      <p><strong>Cantidad:</strong> {{ factura.amount_paid / 100 }} {{ factura.currency.toUpperCase() }}</p>
      <p><strong>Estado:</strong> {{ factura.status }}</p>
      <p><strong>Fecha de emisión:</strong> {{ factura.created | formatDate }}</p>
    </div>
    <div v-if="factura" class="mt-6 text-left">
      <h3 class="text-2xl font-semibold mb-4">Puedes descargar las factura en la sección de mis pedidos.</h3>
      
    </div>

    <!-- Mensaje de error -->
    <p v-if="errorMsg" class="text-red-600 mt-4">{{ errorMsg }}</p>

    <!-- Botón para volver al inicio -->
    <div>
      <button @click="volverAPedidos" class="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 transition duration-300">
      Mis pedidos
    </button>
    </div>
    <div>
      <button @click="volverAInicio" class="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 transition duration-300">
      Volver al Inicio
    </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNuxtApp } from '#app';

const factura = ref(null);
const errorMsg = ref('');
const router = useRouter();
const route = useRoute();
const { $axios } = useNuxtApp();

// Función para formatear la fecha de la factura
const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

onMounted(async () => {
  const paymentIntentId = route.query.paymentIntentId;

  if (!paymentIntentId) {
    errorMsg.value = 'No se encontró el ID de pago.';
    return;
  }

  try {
    // Obtener la factura desde el backend
    const response = await $axios.get('/orders/factura/', {
      params: { paymentIntentId }
    });
    factura.value = response.data;
  } catch (error) {
    errorMsg.value = 'Error al obtener la factura: ' + error.message;
  }
});

const volverAInicio = () => {
  router.push('/');
};

const volverAPedidos = () => {
  router.push('/pedidos');
};
</script>
