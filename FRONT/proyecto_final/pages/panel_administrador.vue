<template>
  <Header />
  <Navbar />

  <div class="admin-dashboard flex">
    <!-- Menú Lateral -->
    <aside class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg sidebar w-64 p-6">
      <h2 class="text-2xl font-semibold mb-8">Panel de Administrador</h2>
      <ul class="space-y-4">
        <li>
          <button
            @click="seleccionarVista('solicitudes')"
            :class="['w-full text-left text-lg px-4 py-2 rounded-md transition', vistaSeleccionada === 'solicitudes' ? 'bg-indigo-700 text-indigo-200' : 'hover:bg-indigo-700 hover:text-indigo-300']"
          >
            Solicitudes de Gestor
          </button>
        </li>
        <li>
          <a href="https://proyecto-final.duckdns.org/admin/accounts/usuario/" class="text-lg block px-4 py-2 hover:text-indigo-300 hover:bg-indigo-700 rounded-md">Gestión de Usuarios</a>
        </li>
        <li>
          <button
            @click="seleccionarVista('estadisticas')"
            :class="['w-full text-left text-lg px-4 py-2 rounded-md transition', vistaSeleccionada === 'estadisticas' ? 'bg-indigo-700 text-indigo-200' : 'hover:bg-indigo-700 hover:text-indigo-300']"
          >
            Estadísticas
          </button>
        </li>
        <li>
          <a href="https://proyecto-final.duckdns.org/admin/products/producto/" class="text-lg block px-4 py-2 hover:text-indigo-300 hover:bg-indigo-700 rounded-md">Gestión de Productos</a>
        </li>
        <li>
          <a href="https://proyecto-final.duckdns.org/admin/orders/pedido/" class="text-lg block px-4 py-2 hover:text-indigo-300 hover:bg-indigo-700 rounded-md">Gestión de Pedidos</a>
        </li>
        <li>
          <a href="https://proyecto-final.duckdns.org/admin/products/categoria/" class="text-lg block px-4 py-2 hover:text-indigo-300 hover:bg-indigo-700 rounded-md">Gestión de Categorías</a>
        </li>
        <li>
          <a href="https://proyecto-final.duckdns.org/admin/orders/pago/" class="text-lg block px-4 py-2 hover:text-indigo-300 hover:bg-indigo-700 rounded-md">Gestión de Pagos</a>
        </li>
        
        <li>
          <NuxtLink to="https://proyecto-final.duckdns.org/admin/accounts/usuario/148/change/#general-tab" class="text-lg hover:text-indigo-300 transition px-4 py-2 rounded-md hover:bg-indigo-700">Configuración</NuxtLink>
        </li>
      </ul>
    </aside>

    <!-- Contenido Principal dinámico -->
    <main class="content flex-1 p-6 bg-gray-100">
      <component :is="componenteActual" />
    </main>
  </div>

  <Footer />
</template>

<script setup>
import { ref, computed } from 'vue'
import Header from '@/components/Header.vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import SolicitudGestorAdmin from '@/components/admin/SolicitudGestorAdmin.vue'
import EstadisticasProductos from '@/components/admin/EstadisticasProductos.vue'

const vistaSeleccionada = ref('solicitudes')

const seleccionarVista = (vista) => {
  vistaSeleccionada.value = vista
}

const componenteActual = computed(() => {
  return vistaSeleccionada.value === 'solicitudes'
    ? SolicitudGestorAdmin
    : EstadisticasProductos
})
</script>

<style scoped>
.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
}
.content {
  margin-left: 16rem;
}
button {
  padding: 10px 18px;
  font-size: 16px;
}
button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
</style>
