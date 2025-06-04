<!-- components/admin/SolicitudGestorAdmin.vue -->
<template>
    <div>
      <h1 class="text-3xl font-bold text-indigo-700 mb-6">Solicitudes de Gestor</h1>
  
      <p v-if="solicitudes.length === 0" class="text-gray-500">No hay solicitudes pendientes.</p>
  
      <ul v-else>
        <li v-for="solicitud in solicitudes" :key="solicitud.id" class="solicitud-item bg-white p-4 rounded-lg shadow-md mb-6 hover:shadow-xl transition duration-300">
            <p>
                <strong>Usuario:</strong> {{ solicitud.usuario.username }}<br>
                <strong>Email:</strong> {{ solicitud.usuario.email }}<br>
                <strong>Tienda:</strong> {{ solicitud.nombre_tienda }}<br>
                <strong>Identificación fiscal:</strong> {{ solicitud.identificacion_fiscal }},<br>
                <strong>Teléfono:</strong> {{ solicitud.telefono }}<br>
                <strong>Dirección: </strong> {{ solicitud.direccion }}<br>
                <strong>Fecha de solicitud:</strong> {{ new Date(solicitud.fecha_creacion).toLocaleDateString() }}<br>
                
            </p>
          <div class="buttons mt-4 space-x-4">
            <button @click="aprobar(solicitud.id)" class="btn btn-success py-2 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200">Aprobar</button>
            <button @click="rechazar(solicitud.id)" class="btn btn-danger py-2 px-6 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200">Rechazar</button>
          </div>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  
  const { $axios } = useNuxtApp();
  const authStore = useAuthStore();
  const solicitudes = ref([]);
  
  const fetchSolicitudes = async () => {
    try {
      const token = authStore.authToken;
      if (!token) throw new Error('No hay token disponible');
  
      const { data } = await $axios.get('/accounts/solicitudes-gestor/', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      solicitudes.value = data;
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
      alert('Ocurrió un error al cargar las solicitudes.');
    }
  };
  
  const aprobar = async (solicitudId) => {
    try {
      const token = authStore.authToken;
      if (!token) throw new Error('No hay token disponible');
  
      await $axios.post(
        `/accounts/aprobar-gestor/${solicitudId}/`,
        { accion: 'aprobar' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      fetchSolicitudes();
      alert('Solicitud aprobada correctamente.');
    } catch (error) {
      console.error('Error al aprobar solicitud:', error);
      alert('Ocurrió un error al aprobar la solicitud.');
    }
  };
  
  const rechazar = async (solicitudId) => {
    try {
      const token = authStore.authToken;
      if (!token) throw new Error('No hay token disponible');
  
      await $axios.post(
        `/accounts/aprobar-gestor/${solicitudId}/`,
        { accion: 'rechazar' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      fetchSolicitudes();
      alert('Solicitud rechazada correctamente.');
    } catch (error) {
      console.error('Error al rechazar solicitud:', error);
      alert('Ocurrió un error al rechazar la solicitud.');
    }
  };
  
  onMounted(() => {
    authStore.cargarTokensDesdeSession();
    fetchSolicitudes();
  });
  </script>
  