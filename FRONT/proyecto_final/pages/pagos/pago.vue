<template>
  <Header />
  <Navbar />
  <div class="payment-page">
    <div class="payment-container">
      <h1>Realiza el Pago</h1>
      <form @submit.prevent="handleSubmit">
        <!-- Selector de método de pago -->
        <div>
          <label for="metodoPago">Método de pago:</label>
          <select v-model="metodoPagoId" id="metodoPago" required>
            <option v-for="metodo in metodosPago" :key="metodo.id" :value="metodo.id">
              {{ metodo.nombre }}
            </option>
          </select>
        </div>

        <!-- Elemento de tarjeta de Stripe -->
        <div v-if="metodoPagoId === 1" ref="cardElement" class="card-element"></div>

        <button type="submit" class="btn btn-accent">Pagar</button>
      </form>
      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    </div>
    
  </div>
  <Footer />
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useNuxtApp, useRuntimeConfig } from '#app';
import Header from '~/components/Header.vue';
import Navbar from '~/components/Navbar.vue';
import Footer from '~/components/Footer.vue';
import { useCartStore } from '@/stores/cart';

const { $axios } = useNuxtApp();
const config = useRuntimeConfig();
const authStore = useAuthStore();
const router = useRouter();

// Refs para Stripe y Stripe Elements
const stripe = ref(null);
const elements = ref(null);
const cardElement = ref(null);
const errorMsg = ref('');
const metodoPagoId = ref(null);  // ID del método de pago seleccionado
const metodosPago = ref([]);  // Lista de métodos de pago disponibles

// Cargar los métodos de pago desde el backend
onMounted(async () => {
  if (import.meta.client) {
    authStore.cargarTokensDesdeSession();

    if (!authStore.isLoggedIn) {
      router.push('/login');
      return;
    }

    // Obtener los métodos de pago del backend
    const response = await $axios.get('/orders/metodos-pago/');
    metodosPago.value = response.data;

    const stripeLib = await import('@stripe/stripe-js');
    stripe.value = await stripeLib.loadStripe(config.public.stripePublicKey);
    elements.value = stripe.value.elements();
  }
});

// Verificar cuando el div del formulario de tarjeta se renderiza y montar el elemento
watch(metodoPagoId, async (newMetodoPagoId) => {
  if (newMetodoPagoId === 1) {
    // Esperar a que el DOM se actualice y el div esté disponible
    nextTick(() => {
      if (cardElement.value) {
        const card = elements.value.create('card');
        card.mount(cardElement.value);

        card.on('change', (event) => {
          errorMsg.value = event.error ? event.error.message : '';
        });
      }
    });
  } else {
    // Limpiar el formulario de tarjeta cuando se cambie de método
    if (cardElement.value) {
      cardElement.value.innerHTML = '';
    }
  }
});

// Función para manejar el pago
const handleSubmit = async () => {
  try {
    const token = authStore.authToken;
    if (!token) throw new Error('No hay token disponible');

    const cartStore = useCartStore();
    const amountInCents = Math.round(cartStore.totalPrice * 100); // Total en centavos
    const cartItems = cartStore.items.map(item => ({
      producto_id: item.product.id,
      cantidad: item.quantity
    }));

    // Verificar que el método de pago esté seleccionado
    if (!metodoPagoId.value) {
      errorMsg.value = 'Por favor, selecciona un método de pago.';
      return;
    }

    // Llamar al backend para crear el Payment Intent y obtener el clientSecret
    const response = await $axios.post('/orders/procesar-pago/', {
      amount: amountInCents, // Monto en centavos
      currency: 'usd',
      cart_items: cartItems, // Elementos del carrito
      metodo_pago_id: metodoPagoId.value  // Método de pago seleccionado
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const { clientSecret, error } = response.data;
    if (error) {
      errorMsg.value = error;
      return;
    }

    // Confirmar el pago con Stripe utilizando el clientSecret
    const { error: stripeError, paymentIntent } = await stripe.value.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.value.getElement('card')
      }
    });

    if (stripeError) {
      errorMsg.value = stripeError.message;
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      alert('Pago exitoso y pedido creado');
      // Limpiar el carrito y redirigir al usuario
      cartStore.clearCart();
      router.push(`/pagos/pago-exito?paymentIntentId=${paymentIntent.id}`);
    }
  } catch (e) {
    errorMsg.value = e.message;
  }
};
</script>

<style scoped lang="scss">
@import '../../assets/scss/_variables.scss';
@import '../../assets/scss/global.scss';

.payment-page {
  
  background: $white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  text-align: center;

  h1 {
    margin-bottom: 1.5rem;
    font-size: 2rem;
  }

  .payment-container {
    form {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .card-element {
      width: 100%;
      max-width: 400px;
      padding: 1rem;
      border: 1px solid lighten($gray, 20%);
      border-radius: 6px;
    }

    .error {
      color: red;
      margin-top: 1rem;
    }
  }
}
</style>
