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
        />
      </div>
      <div class="form-group">
        <label>Comentario:</label>
        <textarea 
          v-model="newReview.comentario" 
          rows="4" 
          placeholder="Cuéntanos tu experiencia..."
          required
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
import { useAuthStore } from '@/stores/auth'; // ← Importa el store de autenticación

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
  try {
    await $axios.post('/products/reseñas/', {
      producto: props.productId,
      rating: newReview.value.rating,
      comentario: newReview.value.comentario
    }, {
      headers: { 
        Authorization: `Bearer ${sessionStorage.getItem('auth_token')}`  // ← Clave para autenticación
      }
    });
    // ...
  } catch (error) {
    console.error('Error:', error.response?.data);
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

.form-group {
  margin: 1rem 0;
}

.review-item {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.rating {
  color: #ffd700;
  margin-right: 1rem;
}

.btn-submit {
  background: #28a745;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}
</style>