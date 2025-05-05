<template>
  <div class="review-section">
    <!-- Formulario de reseña -->
    <div class="review-form">
      <h3>Escribe tu reseña</h3>
      <div class="form-group">
        <label>Calificación (1-5):</label>
        <input 
          v-model.number="newReview.rating" 
          type="number" 
          min="1" 
          max="5" 
          required
          class="form-input"
        />
      </div>
      <div class="form-group">
        <label>Comentario:</label>
        <textarea 
          v-model="newReview.comentario" 
          rows="4" 
          placeholder="Cuéntanos tu experiencia..."
          required
          class="form-input"
        ></textarea>
      </div>
      <button @click="submitReview" class="btn-submit">Enviar reseña</button>
    </div>

    <!-- Lista de reseñas -->
    <div class="reviews-list">
      <h3>Reseñas de otros clientes</h3>
      <div v-if="reviews.length === 0" class="no-reviews">
        ¡Sé el primero en escribir una reseña!
      </div>
      <div v-for="review in reviews" :key="review.id" class="review-item">
        <div class="review-header">
          <span class="rating">★ {{ review.rating }}/5</span>
          <span class="date">{{ formatDate(review.creado_en) }}</span>
        </div>
        <p class="comment">{{ review.comentario }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth' // ← Store de autenticación

const authStore = useAuthStore();

const props = defineProps({
  productId: {
    type: [Number, String],
    required: true
  }
})

const { $axios } = useNuxtApp()
const route = useRoute()
const reviews = ref([])
const newReview = ref({
  rating: 5,
  comentario: ''
})

// Cargar reseñas al inicializar
onMounted(async () => {
  try {
    const { data } = await $axios.get(`/products/reseñas/`, {
      params: { producto: props.productId }
    })
    reviews.value = data
  } catch (error) {
    console.error('Error al cargar reseñas:', error)
  }
})

// Formatear fecha
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Enviar nueva reseña
const submitReview = async () => {
  if (!authStore.isLoggedIn) {
    alert("Debes iniciar sesión para dejar una reseña.");
    return;
  }

  try {
    await $axios.post('/products/reseñas/', {
      producto: props.productId,
      rating: newReview.value.rating,
      comentario: newReview.value.comentario
    }, {
      headers: { 
        Authorization: `Bearer ${authStore.authToken}`  // ← Usando el token del store
      }
    });
    // Recargar las reseñas tras enviar una nueva
    await loadReviews();
    newReview.value.rating = 5;
    newReview.value.comentario = '';
  } catch (error) {
    console.error('Error al enviar reseña:', error);
    alert("Hubo un error al enviar tu reseña. Intenta de nuevo.");
  }
}

// Función para cargar las reseñas
const loadReviews = async () => {
  try {
    const { data } = await $axios.get(`/products/reseñas/`, {
      params: { producto: props.productId }
    })
    reviews.value = data
  } catch (error) {
    console.error('Error al cargar reseñas:', error)
  }
}
</script>

<style scoped>
.review-section {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.review-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin: 1rem 0;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  resize: none;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #4C9F70;
}

.btn-submit {
  background: #28a745;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  margin-top: 1rem;
  cursor: pointer;
  border: none;
  transition: background 0.3s ease;
}

.btn-submit:hover {
  background: #218838;
}

.reviews-list {
  margin-top: 2rem;
}

.review-item {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.rating {
  color: #ffd700;
  margin-right: 1rem;
}

.no-reviews {
  color: #999;
}

.comment {
  font-size: 1rem;
  color: #555;
}

.review-header {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.date {
  font-size: 0.9rem;
  color: #888;
}
</style>
