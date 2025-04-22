<template>
  <Header></Header>
  <Navbar></Navbar>
  <div class="cart-page">
    <h1>Tu Carrito</h1>
    <div v-if="cartItems.length > 0">
      <div v-for="item in cartItems" :key="item.product.id" class="cart-item">
        <p><strong>{{ item.product.titulo }}</strong></p>
        <p>Cantidad: 
          <input type="number" v-model.number="item.quantity" @change="updateItem(item.product.id, item.quantity)" min="1" />
        </p>
        <p>Precio: ${{ item.product.precio }} (Subtotal: ${{ item.product.precio * item.quantity }})</p>
        <button @click="decreaseQuantity(item.product.id)">Eliminar</button>
      </div>
      <div class="cart-summary">
        <p>Total Ítems: {{ totalItems }}</p>
        <p>Total a Pagar: ${{ totalPrice }}</p>
        <NuxtLink to="/pagos/pago" @click="checkout">Proceder al pago</NuxtLink>
      </div>
    </div>
    <div v-else>
      <p>El carrito está vacío.</p>
    </div>
  </div>
  <Footer></Footer>
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
  cartStore.updateQuantity(productId, quantity)
}

// Función para eliminar un ítem del carrito
const removeItem = (productId) => {
  cartStore.removeItem(productId)
}

// Función para disminuir la cantidad del producto en 1
const decreaseQuantity = (productId) => {
  cartStore.decreaseItemQuantity(productId);
};

// Función para proceder al pago
const checkout = async () => {
  try {
    const amountInCents = cartStore.totalPrice * 100  // Convertir el total a centavos
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
      // Mostrar mensaje de error si es necesario
    } else {
      // Procesar el pago exitoso
    }
  } catch (error) {
    console.error('Error al crear el Payment Intent:', error)
    // Mostrar mensaje de error al usuario
  }
}
</script>

<style scoped lang="scss">
@import '../assets/scss/_variables.scss';
@import '../assets/scss/global.scss';

.cart-page {
  max-width: 800px;
  margin: 3rem auto;
  padding: 2rem;
  background: $white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: $dark;
  text-align: center;

  h1 {
    margin-bottom: 1.5rem;
    font-size: 2rem;
    font-weight: bold;
  }

  .cart-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem 0;
    border-bottom: 1px solid lighten($gray, 20%);
    
    &:last-child {
      border-bottom: none;
    }

    p {
      margin: 0.5rem 0;
      font-size: 1rem;
      width: 100%;
    }
    
    /* Estilo para el input de cantidad */
    input[type="number"] {
      width: 60px;
      padding: 5px;
      border: 1px solid lighten($gray, 20%);
      border-radius: 4px;
      text-align: center;
      margin-left: 0.5rem;
    }

    /* Botón para eliminar el producto */
    button {
      align-self: flex-end;
      background: $accent;
      color: $white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      transition: $transition;
      margin-top: 0.5rem;
      
      &:hover {
        background: darken($accent, 5%);
      }
    }
  }

  .cart-summary {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    p {
      font-size: 1.2rem;
      margin: 0.5rem 0;
    }

    button {
      margin-top: 1rem;
      background: $accent;
      color: $white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
      transition: $transition;
      
      &:hover {
        background: darken($accent, 5%);
      }
    }
  }
}
</style>