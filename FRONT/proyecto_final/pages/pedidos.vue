<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-100 via-white to-blue-100 text-gray-800">
    <!-- Cabecera -->
    <Header />
    <!-- Barra de navegación -->
    <Navbar />

    <!-- Contenido principal -->
    <div class="max-w-5xl mx-auto py-12 px-6">
      <h1 class="text-3xl font-bold text-center text-indigo-700 mb-10">Mis Pedidos</h1>

      <div v-if="pedidos.length > 0" class="space-y-8">
        <div
          v-for="pedido in pedidos"
          :key="pedido.id"
          class="bg-white border border-gray-200 shadow-md rounded-xl p-6 transition hover:shadow-lg"
        >
          <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
            <h2 class="text-xl font-semibold text-indigo-600">Pedido #{{ pedido.id }}</h2>
            <span class="text-sm text-gray-500">{{ formatDate(pedido.fecha_creacion) }}</span>
          </div>

          <p class="mb-2"><strong>Estado:</strong> {{ pedido.estado }}</p>
          <p class="mb-4"><strong>Total:</strong> {{ pedido.total }} €</p>

          <div class="mb-4">
            <h3 class="font-medium text-gray-700 mb-1">Dirección de Envío</h3>
            <p class="text-sm text-gray-600" v-if="pedido">
              {{ pedido.calle }},
              {{ pedido.ciudad }},
              {{ pedido.codigo_postal }},
              {{ pedido.pais }}
            </p>
            <p v-else class="text-sm text-red-500">Sin dirección asignada</p>
          </div>

          <div>
            <h3 class="font-medium text-gray-700 mb-2">Productos</h3>
            <ul class="space-y-1 text-sm text-gray-700 list-disc pl-5">
              <li v-for="item in pedido.items" :key="item.id">
                {{ item.cantidad }} x {{ item.producto }} - {{ item.precio_unitario }} €
              </li>
            </ul>
          </div>

          <!-- Botón para generar el PDF -->
          <div>
            <button 
              @click="generarPdf(pedido.id)"
              class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Descargar PDF
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-gray-600 mt-20">
        <p>No tienes pedidos registrados.</p>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const { $axios } = useNuxtApp()

import Header from '~/components/Header.vue'
import Navbar from '~/components/Navbar.vue'
import Footer from '~/components/Footer.vue'

// Store de autenticación
const authStore = useAuthStore()
const router = useRouter()

// Variable reactiva para almacenar los pedidos
const pedidos = ref([])

// Función para formatear las fechas (puedes ajustarla a tu formato deseado)
const formatDate = (fecha) => {
  return new Date(fecha).toLocaleDateString()
}

// Función para obtener los pedidos del usuario
const fetchPedidos = async () => {
  try {
    const token = authStore.authToken;
    if (!token) throw new Error('No hay token disponible');
    
    // Llama al endpoint que devuelve los pedidos del usuario
    const { data } = await $axios.get('/orders/mis-pedidos/', {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Log para inspeccionar los datos completos de los pedidos
    console.log('Datos de pedidos recibidos del backend:', data);

    // Asigna los datos a la variable reactiva
    pedidos.value = data;

    // Log para confirmar que los datos se asignaron correctamente
    console.log('Pedidos almacenados en la variable reactiva:', pedidos.value);
  } catch (error) {
    console.error('Error al cargar pedidos:', error);
    router.push('/login'); // Redirige a login si falla la autenticación
  }
};

// Función para generar y descargar el PDF sin abandonar la página
const generarPdf = async (pedidoId) => {
  try {
    const token = authStore.authToken;
    if (!token) throw new Error('No hay token disponible');

    // Hacer la llamada al backend para obtener el PDF
    const { data } = await $axios.get(`/orders/pedido/pdf/${pedidoId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/pdf',
      },
      responseType: 'blob', // importante para obtener el archivo como un blob
    });

    // Crear un enlace para descargar el archivo PDF
    const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `pedido_${pedidoId}.pdf`;  // Nombre del archivo PDF
    link.click();  // Simula el click para descargar el archivo
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    // Maneja el error según sea necesario
  }
};

onMounted(() => {
  // Cargar los tokens y verificar que el usuario esté autenticado
  authStore.cargarTokensDesdeSession()
  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }
  fetchPedidos()
})
</script>
