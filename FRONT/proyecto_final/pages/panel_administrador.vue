<template>
  <Header />
  <Navbar />

  <div class="flex flex-col min-h-screen">
    <!-- Botón menú hamburguesa para móviles -->
    <button
      class="lg:hidden p-4 bg-indigo-600 text-white flex items-center justify-between"
      @click="menuAbierto = !menuAbierto"
    >
      <span class="font-semibold">Menú Administrador</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <div class="flex flex-col lg:flex-row flex-1">
      <!-- Menú Lateral -->
      <aside
        :class="['bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg p-4 lg:p-6 w-full lg:w-64 transition-all duration-300', menuAbierto ? 'block' : 'hidden', 'lg:block']"
      >
        <h2 class="text-xl lg:text-2xl font-semibold mb-6 lg:mb-8 text-center lg:text-left">Administración  tienda</h2>
        <ul class="space-y-4">
          <li>
            <button
              @click="seleccionarVista('solicitudes'); menuAbierto = false"
              :class="['w-full text-left text-base lg:text-lg px-4 py-2 rounded-md transition', vistaSeleccionada === 'solicitudes' ? 'bg-indigo-700 text-indigo-200' : 'hover:bg-indigo-700 hover:text-indigo-300']"
            >
              Solicitudes de Gestor
            </button>
          </li>
          <li>
            <button
              @click="seleccionarVista('estadisticas'); menuAbierto = false"
              :class="['w-full text-left text-base lg:text-lg px-4 py-2 rounded-md transition', vistaSeleccionada === 'estadisticas' ? 'bg-indigo-700 text-indigo-200' : 'hover:bg-indigo-700 hover:text-indigo-300']"
            >
              Estadísticas
            </button>
          </li>
        </ul>
        <ul>
          <h2 class="text-xl lg:text-2xl font-semibold mb-6 lg:mb-8 text-center lg:text-left">Panel de Administrador</h2>
          <li>
            <a href="https://proyecto-final.duckdns.org/admin/accounts/usuario/" class="block text-base lg:text-lg px-4 py-2 hover:text-indigo-300 hover:bg-indigo-700 rounded-md">
              Gestión de Usuarios
            </a>
          </li>
          <li>
            <a href="https://proyecto-final.duckdns.org/admin/products/producto/" class="block text-base lg:text-lg px-4 py-2 hover:text-indigo-300 hover:bg-indigo-700 rounded-md">
              Gestión de Productos
            </a>
          </li>
          <li>
            <a href="https://proyecto-final.duckdns.org/admin/orders/pedido/" class="block text-base lg:text-lg px-4 py-2 hover:text-indigo-300 hover:bg-indigo-700 rounded-md">
              Gestión de Pedidos
            </a>
          </li>
          <li>
            <a href="https://proyecto-final.duckdns.org/admin/products/categoria/" class="block text-base lg:text-lg px-4 py-2 hover:text-indigo-300 hover:bg-indigo-700 rounded-md">
              Gestión de Categorías
            </a>
          </li>
          <li>
            <a href="https://proyecto-final.duckdns.org/admin/orders/pago/" class="block text-base lg:text-lg px-4 py-2 hover:text-indigo-300 hover:bg-indigo-700 rounded-md">
              Gestión de Pagos
            </a>
          </li>
          <li>
            <NuxtLink to="https://proyecto-final.duckdns.org/admin/accounts/usuario/148/change/#general-tab" class="block text-base lg:text-lg hover:text-indigo-300 transition px-4 py-2 rounded-md hover:bg-indigo-700">
              Configuración
            </NuxtLink>
          </li>
        </ul>
      </aside>

      <!-- Contenido Principal dinámico -->
      <main class="flex-1 p-4 lg:p-6 bg-gray-100 overflow-auto">
        <div class="max-w-7xl mx-auto w-full">
          <component :is="componenteActual" />
        </div>
      </main>
    </div>
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
const menuAbierto = ref(false)

const seleccionarVista = (vista) => {
  vistaSeleccionada.value = vista
}
const componenteActual = computed(() => {
  return vistaSeleccionada.value === 'solicitudes'
    ? SolicitudGestorAdmin
    : EstadisticasProductos
})
</script>
