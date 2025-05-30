<template>
  <div class="estadisticas-pedidos-wrapper max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 fade-in">
    <h2 class="text-3xl font-semibold text-center text-gray-700 mb-6">Estadísticas de Pedidos</h2>

    <!-- Mostrar estadísticas -->
    <div v-if="estadisticas" class="space-y-4">
      <div class="flex justify-between text-lg">
        <span class="font-medium text-gray-800">Total de Pedidos:</span>
        <span>{{ estadisticas.total_pedidos }}</span>
      </div>
      <div class="flex justify-between text-lg">
        <span class="font-medium text-gray-800">Ingresos Totales:</span>
        <span>{{ estadisticas.ingresos_totales.toFixed(2) }} €</span>
      </div>
      <div class="flex justify-between text-lg">
        <span class="font-medium text-gray-800">Promedio por Pedido:</span>
        <span>{{ estadisticas.promedio_pedido.toFixed(2) }} €</span>
      </div>
      <div class="flex justify-between text-lg">
        <span class="font-medium text-gray-800">Productos Vendidos:</span>
        <span>{{ estadisticas.productos_vendidos }}</span>
      </div>
    </div>

    <!-- Mostrar cargando -->
    <div v-else-if="loading" class="text-center text-gray-600">
      <span class="animate-pulse">Cargando...</span>
    </div>

    <!-- Mostrar error -->
    <div v-else-if="error" class="text-center text-red-500 font-medium">
      Error al cargar las estadísticas.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
const { $axios } = useNuxtApp();

// Ref para las estadísticas, el estado de carga y el error
const estadisticas = ref(null);
const loading = ref(true);
const error = ref(false);

const authStore = useAuthStore();

// Función para obtener las estadísticas
const fetchEstadisticas = async () => {
  try {
    const token = authStore.authToken; // Usamos el token del store de autenticación
    if (!token) throw new Error('No hay token disponible');

    // Realizamos la petición a la API de Django para obtener las estadísticas de los pedidos
    const response = await $axios.get('/orders/estadisticas-pedidos/', {
      headers: {
        'Authorization': `Bearer ${token}`, // Incluimos el token en los encabezados
      },
    });

    // Asignamos las estadísticas a la variable ref
    estadisticas.value = response.data;
  } catch (err) {
    error.value = true;
    console.error('Error al obtener las estadísticas', err);
  } finally {
    loading.value = false;
  }
};

// Llamar la función cuando el componente se monta
onMounted(() => {
  if (import.meta.client) {
    if (!authStore.isLoggedIn) {
      // Redirigir al login si no está autenticado
      $router.push('/login');
      return;
    }
    fetchEstadisticas();
  }
});
</script>
