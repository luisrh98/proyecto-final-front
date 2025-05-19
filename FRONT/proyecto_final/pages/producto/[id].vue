<template>
  <div class="page-container">
    <!-- Cabecera -->
    <Header />

    <!-- Barra de navegación -->
    <div class="nav-bar">
      <Navbar />
    </div>

    <!-- Contenido principal -->
    <div class="content-wrapper py-12 px-6 flex justify-center">
      <div v-if="producto" class="w-full max-w-6xl bg-white shadow-lg rounded-lg p-8">
        <!-- Botón de carrito centrado arriba del producto -->
        <div class="flex justify-center mb-10">
          <NuxtLink
            to="/carrito"
            class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
          >
            Carrito ({{ cartStore.totalItems }})
          </NuxtLink>
        </div>

        <!-- Detalles del producto -->
        <div class="flex flex-col md:flex-row gap-8 mb-12">
          <div class="flex justify-center md:flex-1">
            <img
              :src="producto.imagen"
              :alt="producto.titulo"
              class="rounded-lg shadow-lg max-w-full h-auto object-contain"
            />
          </div>
          <div class="flex flex-col flex-1">
            <h1 class="text-3xl font-bold mb-4">{{ producto.titulo }}</h1>
            <p class="text-2xl text-green-500 mb-4">{{ producto.precio }}€</p>
            <p class="mb-4">{{ producto.descripcion }}</p>

            <div class="space-y-2 mb-6 text-sm text-gray-700">
              <p><strong>Categoría:</strong> {{ producto.categoria }}</p>
              <p><strong>Descripción de la categoría:</strong> {{ producto.categoria }}</p>
              <p><strong>Vendedor:</strong> {{ producto.vendedor.nombre }} ({{ producto.vendedor.email }})</p>
              <p><strong>Creado:</strong> {{ formatDate(producto.creado_en) }}</p>
            </div>

            <!-- Formulario añadir al carrito -->
            <form @submit.prevent="addToCart" class="flex items-center gap-4">
              <input
                type="number"
                v-model="cantidad"
                min="1"
                class="w-20 py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                Añadir al Carrito
              </button>
            </form>
          </div>
        </div>

        <!-- Reseñas -->
        <div class="mt-12">
          <h2 class="text-2xl font-semibold mb-6">Reseñas</h2>
          <div v-if="producto.reseñas && producto.reseñas.length">
            <div
              v-for="reseña in producto.reseñas"
              :key="reseña.id"
              class="mb-6 p-6 bg-white shadow-md rounded-lg"
            >
              <p class="font-semibold">{{ reseña.usuario }} - {{ reseña.rating }}/5</p>
              <p class="my-2">{{ reseña.comentario }}</p>
              <p class="text-sm text-gray-500">{{ formatDate(reseña.creado_en) }}</p>
            </div>
          </div>
          <div v-else>
            <p class="text-gray-500">No hay reseñas aún.</p>
          </div>
        </div>

        <!-- Formulario reseña -->
        <div class="mt-12 p-6 bg-gray-100 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold mb-4">Deja tu reseña</h3>
          <div v-if="isLoggedIn">
            <form @submit.prevent="enviarReseña" class="space-y-4">
              <div>
                <label for="calificacion" class="block mb-1 font-medium">Calificación (1-5):</label>
                <input
                  id="calificacion"
                  type="number"
                  v-model.number="nuevaReseña.rating"
                  min="1"
                  max="5"
                  required
                  class="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label for="comentario" class="block mb-1 font-medium">Comentario:</label>
                <textarea
                  id="comentario"
                  v-model="nuevaReseña.comentario"
                  required
                  class="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>

              <button
                type="submit"
                class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                Enviar Reseña
              </button>
            </form>
          </div>
          <div v-else class="text-center">
            <p>Debes iniciar sesión para dejar una reseña.</p>
            <button
              class="mt-4 bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
              @click="navigateTo('/login')"
            >
              Iniciar Sesión
            </button>
          </div>
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
import { useCartStore } from '@/stores/cart'
import { useNuxtApp } from '#app'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const { $axios } = useNuxtApp()

const producto = ref(null)
const cantidad = ref(1)

const nuevaReseña = ref({
  rating: 5,
  comentario: ''
})

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
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    nuevaReseña.value.producto = producto.value.id
    await $axios.post(`/products/reseñas/`, nuevaReseña.value)
    await fetchProducto()
    nuevaReseña.value.rating = 5
    nuevaReseña.value.comentario = ''
  } catch (error) {
    console.error('Error al enviar reseña:', error)
  }
}

const addToCart = () => {
  const productoSeleccionado = producto.value
  const cantidadSeleccionada = cantidad.value
  cartStore.addItem(productoSeleccionado, cantidadSeleccionada)
  console.log(`Añadir ${cantidadSeleccionada} del producto ${productoSeleccionado.id} al carrito`)
}

onMounted(() => {
  authStore.cargarTokensDesdeSession()

  if (authStore.authToken) {
    $axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.authToken}`
  }

  fetchProducto()
})
</script>
