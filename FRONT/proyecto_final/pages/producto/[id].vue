<template>
  <div class="page-container">
    <Header />
    <Navbar />

    <!-- Agregamos el enlace al carrito con la cantidad de productos -->
    <div class="cart-link-wrapper">
      <NuxtLink to="/carrito" class="btn btn-cart">
        <!-- Puedes usar un ícono aquí en lugar de texto -->
        Carrito ({{ cartStore.totalItems }})
      </NuxtLink>
    </div>

    <div v-if="producto" class="product-detail-page">
      <!-- Sección Principal -->
      <div class="product-main">
        <div class="image-container">
          <img :src="producto.imagen" :alt="producto.titulo" class="main-image" />
        </div>
        <div class="product-info">
          <h1 class="title">{{ producto.titulo }}</h1>
          <p class="price">{{ producto.precio }}€</p>
          <p>{{ producto.descripcion }}</p>

          <!-- Detalles Adicionales -->
          <div class="details">
            <p><strong>Categoría:</strong> {{ producto.categoria.nombre }}</p>
            <p><strong>Descripción de la categoría:</strong> {{ producto.categoria.descripcion }}</p>
            <p><strong>Vendedor:</strong> {{ producto.vendedor.nombre }} ({{ producto.vendedor.email }})</p>
            <p><strong>Creado:</strong> {{ formatDate(producto.creado_en) }}</p>
          </div>

          <!-- Formulario Carrito -->
          <form @submit.prevent="addToCart" class="cart-form">
            <input type="number" v-model="cantidad" min="1" class="quantity-input" />
            <!-- Usamos la misma clase 'btn' y 'btn-accent' para mantener el mismo estilo -->
            <button type="submit" class="btn btn-accent">Añadir al Carrito</button>
          </form>
        </div>
      </div>

      <!-- Reseñas -->
      <div class="reviews-section">
        <h2>Reseñas</h2>
        <div v-if="producto.reseñas && producto.reseñas.length">
          <div v-for="reseña in producto.reseñas" :key="reseña.id" class="review">
            <p><strong>{{ reseña.usuario }}</strong> - {{ reseña.rating }}/5</p>
            <p>{{ reseña.comentario }}</p>
            <p><small>{{ formatDate(reseña.creado_en) }}</small></p>
          </div>
        </div>
        <div v-else>
          <p>No hay reseñas aún.</p>
        </div>
      </div>

      <!-- Formulario para dejar una reseña -->
      <div class="reviews-form">
        <h3>Deja tu reseña</h3>
        <div v-if="isLoggedIn">
          <form @submit.prevent="enviarReseña">
            <label for="calificacion">Calificación (1-5):</label>
            <input
              type="number"
              id="calificacion"
              v-model.number="nuevaReseña.rating"
              min="1"
              max="5"
              required
            />

            <label for="comentario">Comentario:</label>
            <textarea id="comentario" v-model="nuevaReseña.comentario" required></textarea>

            <button type="submit" class="btn btn-accent">Enviar Reseña</button>
          </form>
        </div>
        <div v-else>
          <p>Debes iniciar sesión para dejar una reseña.</p>
          <button class="btn btn-secondary" @click="navigateTo('/login')">Iniciar Sesión</button>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { navigateTo } from '#app'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart' // Importa el store del carrito
import { useNuxtApp } from '#app'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore() // Obtén el store del carrito
const { $axios } = useNuxtApp()

const producto = ref(null)
const cantidad = ref(1)

const nuevaReseña = ref({
  rating: 5,
  comentario: ''
})

// Obtenemos el estado de autenticación a partir del store
const isLoggedIn = authStore.isLoggedIn

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

const fetchProducto = async () => {
  try {
    const { data } = await $axios.get(`/products/productos/${route.params.id}/`)
    producto.value = data
  } catch (error) {
    console.error('Error al cargar producto:', error)
  }
}

const enviarReseña = async () => {
  try {
    // Si no está logeado, redirige a login
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    // Agrega el id del producto a la reseña a enviar
    nuevaReseña.value.producto = producto.value.id

    await $axios.post(`/products/reseñas/`, nuevaReseña.value)
    await fetchProducto()

    // Reinicia el formulario
    nuevaReseña.value.rating = 5
    nuevaReseña.value.comentario = ''
  } catch (error) {
    console.error('Error al enviar reseña:', error)
  }
}

const addToCart = () => {
  // Lógica para añadir al carrito
  const productoSeleccionado = producto.value
  const cantidadSeleccionada = cantidad.value
  cartStore.addItem(productoSeleccionado, cantidadSeleccionada) // Usar la lógica para añadir productos
  console.log(`Añadir ${cantidadSeleccionada} del producto ${productoSeleccionado.id} al carrito`)
}

onMounted(() => {
  // Carga los tokens y datos de usuario desde sessionStorage
  authStore.cargarTokensDesdeSession()

  // Si hay token, asegúrate de asignarlo al axios client
  if (authStore.authToken) {
    $axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.authToken}`
  }

  fetchProducto()
})
</script>

<style scoped lang="scss">
@import '../../assets/scss/_variables.scss';
@import '../../assets/scss/global.scss';

.product-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  .product-main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    margin-bottom: 3rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .title {
    color: $dark;
    text-decoration: underline;
    text-align: center;
  }

  .main-image {
    width: 100%;
    height: 500px;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .price {
    color: #e67e22;
    font-size: 2rem;
    margin: 1rem 0;
    text-align: center;
  }

  .details {
    margin: 2rem 0;
    padding: 1.5rem;
    background: rgba($secondary, 0.1);
    border-radius: 8px;
    line-height: 1.6;

    p {
      margin: 0.5rem 0;
      color: $dark;
    }
  }

  .cart-form {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }

  .quantity-input {
    width: 80px;
    padding: 0.5rem;
    border: 1px solid $secondary;
    border-radius: 8px;
  }

  .reviews-section {
    margin-top: 4rem;
    padding: 2rem;
    background: $white;
    border-radius: 12px;
    box-shadow: $box-shadow;

    .review {
      border-bottom: 1px solid $secondary;
      padding: 1.5rem 0;

      &:last-child {
        border-bottom: none;
      }
    }
  }

  .reviews-form {
    margin-top: 2rem;
    padding: 2rem;
    background: #f9f9f9;
    border-radius: 8px;

    label {
      display: block;
      margin-top: 1rem;
      font-weight: bold;
    }

    input,
    textarea {
      width: 100%;
      padding: 0.5rem;
      margin-top: 0.5rem;
      border-radius: 6px;
      border: 1px solid $secondary;
    }

    button {
      margin-top: 1rem;
    }
  }

  .cart-link-wrapper {
    width: 100%;
    text-align: right;
    padding: 1rem;
    
    .btn-cart {
      background: $secondary;
      color: $white;
      padding: 10px 20px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: bold;
      
      &:hover {
        background: lighten($secondary, 10%);
      }
    }
  }
}
</style>
