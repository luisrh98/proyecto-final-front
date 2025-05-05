<template>
  <Header />
  <Navbar />
  <div class="payment-page">
    <div class="payment-container">
      <h1 class="text-center text-3xl font-bold mb-6">Realiza el Pago</h1>

      <!-- Formulario de Dirección -->
      <div class="address-form mb-8">
        <h2 class="text-2xl font-semibold mb-4 text-center">Dirección de Envío</h2>
        <form @submit.prevent="guardarDireccion" class="form-address">
          <div class="form-group">
            <label for="calle">Calle:</label>
            <input v-model="direccion.calle" id="calle" type="text" required class="input-field" />
          </div>
          <div class="form-group">
            <label for="ciudad">Ciudad:</label>
            <input v-model="direccion.ciudad" id="ciudad" type="text" required class="input-field" />
          </div>
          <div class="form-group">
            <label for="codigo_postal">Código Postal:</label>
            <input v-model="direccion.codigo_postal" id="codigo_postal" type="text" required class="input-field" />
          </div>
          <div class="form-group">
            <label for="pais">País:</label>
            <input v-model="direccion.pais" id="pais" type="text" required class="input-field" />
          </div>
          <button type="submit" class="btn btn-primary">Guardar Dirección</button>
        </form>
      </div>

      <!-- Selector de método de pago -->
      <form @submit.prevent="handleSubmit" class="form-payment">
        <div class="mb-6">
          <label for="metodoPago" class="text-lg">Método de pago:</label>
          <select v-model="metodoPagoId" id="metodoPago" required class="input-select">
            <option v-for="metodo in metodosPago" :key="metodo.id" :value="metodo.id">
              {{ metodo.nombre }}
            </option>
          </select>
        </div>

        <!-- Elemento de tarjeta de Stripe -->
        <div v-if="metodoPagoId === 1" ref="cardElement" class="card-element"></div>

        <button type="submit" class="btn btn-accent">Pagar</button>
      </form>

      <p v-if="errorMsg" class="error mt-4">{{ errorMsg }}</p>
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
const metodoPagoId = ref(null); // ID del método de pago seleccionado
const metodosPago = ref([]); // Lista de métodos de pago disponibles

// Datos de la dirección del usuario
const direccion = ref({
  calle: '',
  ciudad: '',
  codigo_postal: '',
  pais: ''
});

// Cargar los datos iniciales
onMounted(async () => {
  if (import.meta.client) {
    authStore.cargarTokensDesdeSession();

    if (!authStore.isLoggedIn) {
      router.push('/login');
      return;
    }

    // Obtener los métodos de pago del backend
    const responseMetodosPago = await $axios.get('/orders/metodos-pago/');
    metodosPago.value = responseMetodosPago.data;

    // Obtener la dirección del usuario desde el backend
    try {
      const token = authStore.authToken;
      const { data } = await $axios.get('/accounts/me/', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Si el usuario tiene una dirección, cargarla
      if (data.direccion) {
        direccion.value = data.direccion;
      }
    } catch (error) {
      console.error('Error al cargar la dirección:', error);
    }

    // Inicializar Stripe
    const stripeLib = await import('@stripe/stripe-js');
    stripe.value = await stripeLib.loadStripe(config.public.stripePublicKey);
    elements.value = stripe.value.elements();
  }
});

// Guardar o actualizar la dirección del usuario
const guardarDireccion = async () => {
  try {
    const token = authStore.authToken;
    if (!token) throw new Error('No hay token disponible');

    await $axios.put('/accounts/me/', { direccion: direccion.value }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert('Dirección guardada con éxito');
  } catch (error) {
    console.error('Error al guardar la dirección:', error);
    errorMsg.value = 'Ocurrió un error al guardar la dirección.';
  }
};

// Verificar cuando el div del formulario de tarjeta se renderiza y montar el elemento
watch(metodoPagoId, async (newMetodoPagoId) => {
  if (newMetodoPagoId === 1) {
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
      metodo_pago_id: metodoPagoId.value // Método de pago seleccionado
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
      cartStore.clearCart();
      router.push(`/pagos/pago-exito?paymentIntentId=${paymentIntent.id}`);
    }
  } catch (e) {
    errorMsg.value = e.message;
  }
};
</script>

<style scoped>
.payment-page {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.payment-container {
  width: 100%;
  text-align: center;
}

.form-address {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

label {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.input-field, .input-select {
  width: 100%; /* Aseguramos que los campos se adapten al contenedor */
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
  box-sizing: border-box; /* Aseguramos que padding no afecte el tamaño */
}

.input-field {
  width: 100%;
}

.input-select {
  max-width: 100%; /* Hace que el select también ocupe el 100% de su contenedor */
}

.btn {
  background: #4C9F70;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  width: auto;  /* Botón ajustado al contenido */
  text-transform: uppercase;
  font-weight: bold;
  border: none;
  transition: background 0.3s;
  margin: 0.5rem auto;  /* Centrado automático */
}

.btn:hover {
  background: #388E58;
}

.card-element {
  margin-top: 1.5rem;
}

.error {
  font-size: 1rem;
  color: #e74c3c;
  margin-top: 1rem;
}

</style>
