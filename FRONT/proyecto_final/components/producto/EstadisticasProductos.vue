<template>
    <div class="estadisticas-pedidos-wrapper fade-in">
      <h2>Estadísticas de Pedidos</h2>
  
      <!-- Mostrar estadísticas -->
      <div v-if="estadisticas">
        <p><strong>Total de Pedidos:</strong> {{ estadisticas.total_pedidos }}</p>
        <p><strong>Ingresos Totales:</strong> ${{ estadisticas.ingresos_totales }}</p>
        <p><strong>Promedio por Pedido:</strong> ${{ estadisticas.promedio_pedido }}</p>
        <p><strong>Productos Vendidos:</strong> {{ estadisticas.productos_vendidos }}</p>
      </div>
  
      <!-- Mostrar cargando -->
      <div v-else-if="loading">Cargando...</div>
  
      <!-- Mostrar error -->
      <div v-else-if="error">
        <p style="color: red;">Error al cargar las estadísticas.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useAuthStore } from '@/stores/auth'
  const { $axios } = useNuxtApp()
  
  // Ref para las estadísticas, el estado de carga y el error
  const estadisticas = ref(null)
  const loading = ref(true)
  const error = ref(false)
  
  const authStore = useAuthStore()
  
  // Función para obtener las estadísticas
  const fetchEstadisticas = async () => {
    try {
      const token = authStore.authToken // Usamos el token del store de autenticación
      if (!token) throw new Error('No hay token disponible')
  
      // Realizamos la petición a la API de Django para obtener las estadísticas de los pedidos
      const response = await $axios.get('/orders/estadisticas-pedidos/', {
        headers: {
          'Authorization': `Bearer ${token}` // Incluimos el token en los encabezados
        }
      })
  
      // Asignamos las estadísticas a la variable ref
      estadisticas.value = response.data
    } catch (err) {
      error.value = true
      console.error('Error al obtener las estadísticas', err)
    } finally {
      loading.value = false
    }
  }
  
  // Llamar la función cuando el componente se monta
  onMounted(() => {
    if (import.meta.client) {
      if (!authStore.isLoggedIn) {
        // Redirigir al login si no está autenticado
        $router.push('/login')
        return
      }
      fetchEstadisticas()
    }
  })
  </script>
  
  <style scoped lang="scss">
  @import '../../assets/scss/_variables.scss';
  @import '../../assets/scss/global.scss';
  
  .estadisticas-pedidos-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 30px;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .estadisticas-pedidos-wrapper h2 {
    margin-bottom: 20px;
  }
  
  .estadisticas-pedidos-wrapper p {
    font-size: 16px;
  }
  
  .notification {
    background: #4caf50;
    color: #fff;
    padding: 10px 20px;
    border-radius: 4px;
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
  }
  </style>
  