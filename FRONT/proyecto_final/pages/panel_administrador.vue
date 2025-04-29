<template>
    <div class="admin-dashboard">
      <h1>Solicitudes de Gestor</h1>
  
      <!-- Mensaje si no hay solicitudes -->
      <p v-if="solicitudes.length === 0">No hay solicitudes pendientes.</p>
  
      <!-- Lista de solicitudes -->
      <ul v-else>
        <li v-for="solicitud in solicitudes" :key="solicitud.id" class="solicitud-item">
          <p>
            <strong>{{ solicitud.usuario.email }}</strong> - {{ solicitud.nombre_tienda }}
          </p>
          <div class="buttons">
            <button @click="aprobar(solicitud.id)" class="btn btn-success">Aprobar</button>
            <button @click="rechazar(solicitud.id)" class="btn btn-danger">Rechazar</button>
          </div>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import { useRouter } from 'vue-router';
  const { $axios } = useNuxtApp();
  const authStore = useAuthStore();
  const router = useRouter();
  
  // Estado reactivo para almacenar las solicitudes
  const solicitudes = ref([]);
  
  // Función para cargar las solicitudes pendientes
  const fetchSolicitudes = async () => {
    try {
      const token = authStore.authToken;
      if (!token) throw new Error('No hay token disponible');
  
      // Llamada al backend para obtener las solicitudes pendientes
      const { data } = await $axios.get('/accounts/solicitudes-gestor/', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Actualizar la lista de solicitudes
      solicitudes.value = data;
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
      alert('Ocurrió un error al cargar las solicitudes.');
    }
  };
  
  // Función para aprobar una solicitud
  const aprobar = async (solicitudId) => {
    try {
      const token = authStore.authToken;
      if (!token) throw new Error('No hay token disponible');
  
      // Llamada al backend para aprobar la solicitud
      await $axios.post(
        `/accounts/aprobar-gestor/${solicitudId}/`,
        { accion: 'aprobar' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Recargar la lista de solicitudes
      fetchSolicitudes();
      alert('Solicitud aprobada correctamente.');
    } catch (error) {
      console.error('Error al aprobar solicitud:', error);
      alert('Ocurrió un error al aprobar la solicitud.');
    }
  };
  
  // Función para rechazar una solicitud
  const rechazar = async (solicitudId) => {
    try {
      const token = authStore.authToken;
      if (!token) throw new Error('No hay token disponible');
  
      // Llamada al backend para rechazar la solicitud
      await $axios.post(
        `/accounts/aprobar-gestor/${solicitudId}/`,
        { accion: 'rechazar' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Recargar la lista de solicitudes
      fetchSolicitudes();
      alert('Solicitud rechazada correctamente.');
    } catch (error) {
      console.error('Error al rechazar solicitud:', error);
      alert('Ocurrió un error al rechazar la solicitud.');
    }
  };
  
  // Cargar las solicitudes al montar el componente
  onMounted(() => {
    fetchSolicitudes();
  });
  </script>
  
  <style scoped>
  .admin-dashboard {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .solicitud-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ccc;
  }
  
  .solicitud-item:last-child {
    border-bottom: none;
  }
  
  .buttons {
    display: flex;
    gap: 10px;
  }
  
  .btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }
  
  .btn-success {
    background-color: #28a745;
    color: white;
  }
  
  .btn-danger {
    background-color: #dc3545;
    color: white;
  }
  </style>