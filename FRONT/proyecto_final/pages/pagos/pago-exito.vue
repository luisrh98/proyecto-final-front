<template>
    <div class="success-page">
      <h1>Pago Exitoso</h1>
      <p>¡Gracias por tu compra!</p>
      <p>Detalles del pago:</p>
  
      <div v-if="factura">
        <h3>Factura</h3>
        <p><strong>ID de Factura:</strong> {{ factura.id }}</p>
        <p><strong>Cantidad:</strong> {{ factura.amount_paid / 100 }} {{ factura.currency.toUpperCase() }}</p>
        <p><strong>Estado:</strong> {{ factura.status }}</p>
        <p><strong>Fecha de emisión:</strong> {{ factura.created | formatDate }}</p>
      </div>
      
  
      <button @click="volverAInicio" class="btn btn-primary">Volver al Inicio</button>
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
    router.push('/home');
  };
  </script>
  
  <style scoped>
  .success-page {
    text-align: center;
    padding: 2rem;
  }
  
  .success-page h1 {
    margin-bottom: 1rem;
  }
  
  .success-page .btn {
    margin-top: 2rem;
  }
  </style>
  