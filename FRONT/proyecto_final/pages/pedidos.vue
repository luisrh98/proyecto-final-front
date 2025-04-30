<template>
    <div class="pedidos-container">
      <!-- Cabecera -->
      <Header />
      <!-- Barra de navegación -->
      <Navbar />
  
      <!-- Contenido principal -->
      <div class="content-wrapper">
        <h1 class="page-title">Mis Pedidos</h1>
        <div v-if="pedidos.length > 0">
          <div v-for="pedido in pedidos" :key="pedido.id" class="pedido-card">
            <h2>Pedido #{{ pedido.id }}</h2>
            <p><strong>Fecha:</strong> {{ formatDate(pedido.fecha_creacion) }}</p>
            <p><strong>Estado:</strong> {{ pedido.estado }}</p>
            <p><strong>Total:</strong> €{{ pedido.total }}</p>
            <div class="pedido-direccion">
              <h3>Dirección de Envío</h3>
              <p v-if="pedido">
                {{ pedido.calle }}, 
                {{ pedido.ciudad }}, 
                {{ pedido.codigo_postal }}, 
                {{ pedido.pais }}
              </p>
              <p v-else>Sin dirección asignada</p>
            </div>
            <div class="pedido-items">
              <h3>Productos</h3>
              <ul>
                <li v-for="item in pedido.items" :key="item.id">
                  {{ item.cantidad }} x {{ item.producto }} - €{{ item.precio_unitario }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div v-else>
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
  
  <style scoped lang="scss">
  @import '../assets/scss/_variables.scss';
  @import '../assets/scss/global.scss';
  
  .pedidos-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .content-wrapper {
    width: 100%;
    max-width: 1200px;
    margin-top: 40px;
    padding: 20px;
  }
  
  .page-title {
    font-size: 2rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
  }
  
  .pedido-card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  
  .pedido-card h2 {
    margin-bottom: 10px;
  }
  
  .pedido-direccion {
    margin-top: 10px;
  }
  
  .pedido-items {
    margin-top: 10px;
  }
  
  .pedido-items ul {
    list-style: none;
    padding: 0;
  }
  
  .pedido-items li {
    padding: 5px 0;
    border-bottom: 1px solid #eee;
  }
  
  .pedido-items li:last-child {
    border-bottom: none;
  }
  </style>
  