<template>
  <Header />
  <Navbar />
  <div class="cart-page">
    <h1 class="text-center text-3xl font-bold mb-8">Tu Carrito</h1>

    <div v-if="cartItems.length > 0">
      <div v-for="item in cartItems" :key="item.product.id" class="cart-item mb-6">
        <div class="flex justify-between items-center">
          <div>
            <p class="font-semibold text-lg">{{ item.product.titulo }}</p>
            <p class="text-gray-500">Precio: ${{ item.product.precio }}</p>
          </div>

          <div>
            <p class="text-gray-700">Cantidad:</p>
            <input 
              type="number" 
              v-model.number="item.quantity" 
              @change="updateItem(item.product.id, item.quantity)" 
              min="1" 
              :max="item.product.stock" 
              class="quantity-input"
            />
          </div>
        </div>

        <p class="mt-2 text-gray-600">Subtotal: ${{ item.product.precio * item.quantity }}</p>

        <button 
          @click="removeItem(item.product.id)" 
          class="btn-remove mt-4"
        >
          Eliminar
        </button>
      </div>

      <div class="cart-summary bg-white p-6 rounded-lg shadow-lg">
        <p class="font-semibold text-xl">Resumen del Carrito</p>
        <p class="text-gray-700">Total Ítems: {{ totalItems }}</p>
        <p class="text-gray-700">Total a Pagar: ${{ totalPrice }}</p>

        <NuxtLink 
          to="/pagos/pago" 
          @click="checkout" 
          class="btn-checkout mt-4 block text-center w-full"
        >
          Proceder al pago
        </NuxtLink>
      </div>
    </div>

    <div v-else class="text-center mt-8">
      <p class="text-gray-600">El carrito está vacío.</p>
    </div>
  </div>

  <Footer />
</template>

<script setup>
import { computed } from 'vue'
import { NuxtLink } from '#components'
import { useCartStore } from '@/stores/cart'
import Navbar from '~/components/Navbar.vue'
import { useRuntimeConfig } from '#app'

const cartStore = useCartStore()
const config = useRuntimeConfig()

// Usar propiedades computadas para mantener la reactividad
const cartItems = computed(() => cartStore.items)
const totalItems = computed(() => cartStore.totalItems)
const totalPrice = computed(() => cartStore.totalPrice)

// Función para actualizar la cantidad de un ítem
const updateItem = (productId, quantity) => {
  if (quantity <= 0) {
    alert("La cantidad debe ser al menos 1.");
    return;
  }
  cartStore.updateQuantity(productId, quantity)
}

// Función para eliminar un ítem del carrito
const removeItem = (productId) => {
  cartStore.removeItem(productId)
}

// Función para proceder al pago
const checkout = async () => {
  try {
    const amountInCents = totalPrice.value * 100  // Convertir el total a centavos
    const currency = 'usd' // Asumir que la moneda es USD

    // Llamar al backend para crear el Payment Intent
    const response = await $axios.post('/orders/create-payment-intent/', {
      amount: amountInCents,
      currency: currency,
      cart_items: cartItems.value.map(item => ({
        producto_id: item.product.id,
        cantidad: item.quantity,
      }))
    })

    // Redirigir a la página de pago de Stripe
    const clientSecret = response.data.clientSecret
    const stripe = Stripe(config.public.stripePublicKey)
    const { error } = await stripe.confirmCardPayment(clientSecret)

    if (error) {
      console.error('Error al procesar el pago:', error)
      alert('Hubo un error al procesar el pago. Inténtalo nuevamente.')
    } else {
      // Pago exitoso
      alert('Pago exitoso, ¡Gracias por tu compra!')
    }
  } catch (error) {
    console.error('Error al crear el Payment Intent:', error)
    alert("Hubo un error en el proceso de pago. Intenta más tarde.")
  }
}
</script>

<style scoped>
.cart-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cart-item {
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.cart-summary {
  margin-top: 2rem;
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.quantity-input {
  width: 80px;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
  margin-top: 0.5rem;
}

.quantity-input:focus {
  outline: none;
  border-color: #4C9F70;
}

.btn-remove {
  background: #e74c3c;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  transition: background 0.3s;
}

.btn-remove:hover {
  background: #c0392b;
}

.btn-checkout {
  background: #4C9F70;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: background 0.3s;
}

.btn-checkout:hover {
  background: #388E58;
}

h1 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
}

p {
  font-size: 1rem;
  margin: 0.5rem 0;
}

.text-center {
  text-align: center;
}

.font-semibold {
  font-weight: 600;
}

.text-gray-600 {
  color: #718096;
}

.text-gray-500 {
  color: #a0aec0;
}

.text-gray-700 {
  color: #4a5568;
}
</style>
