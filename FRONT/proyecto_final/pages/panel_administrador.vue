<template>
  <div class="admin-dashboard">
    <!-- Menú Lateral -->
    <aside class="sidebar">
      <h2>Panel de Administrador</h2>
      <ul>
        <li><NuxtLink to="/admin/solicitudes">Solicitudes de Gestor</NuxtLink></li>
        <li><NuxtLink to="https://proyecto-final.duckdns.org/admin/accounts/usuario/">Gestión de Usuarios</NuxtLink></li>
        <li><NuxtLink to="https://proyecto-final.duckdns.org/admin/products/producto/">Gestión de Productos</NuxtLink></li>
        <li><NuxtLink to="https://proyecto-final.duckdns.org/admin/orders/pedido/">Gestión de Pedidos</NuxtLink></li>
        <li><NuxtLink to="https://proyecto-final.duckdns.org/admin/products/categoria/">Gestión de Categorías</NuxtLink></li>
        <li><NuxtLink to="https://proyecto-final.duckdns.org/admin/orders/pago/">Gestión de Pagos</NuxtLink></li>
        <li><NuxtLink to="/admin/estadisticas">Estadísticas</NuxtLink></li>
        <li><NuxtLink to="/admin/configuracion">Configuración</NuxtLink></li>
      </ul>
    </aside>

    <!-- Contenido Principal -->
    <main class="content">
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
    </main>

    <!-- Estadísticas de Productos -->
    <aside class="estadisticas-section">
      <EstadisticasProductos />
    </aside>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import EstadisticasProductos from '@/components/producto/EstadisticasProductos.vue';

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
  authStore.cargarTokensDesdeSession();
  fetchSolicitudes();
});
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  height: 100vh;
  flex-direction: column;
  gap: 20px;
}

.sidebar {
  width: 250px;
  background-color: #f4f4f4;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #333;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar ul li {
  margin-bottom: 10px;
}

.sidebar ul li a {
  text-decoration: none;
  color: #333;
  font-size: 1rem;
  padding: 10px;
  display: block;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.sidebar ul li a:hover {
  background-color: #ddd;
}

.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
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

/* Estilo para la sección de estadísticas */
.estadisticas-section {
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 8px;
}
</style>
