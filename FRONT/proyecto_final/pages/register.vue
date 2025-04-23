<template>
  <div class="auth-container container fade-in">
    <form @submit.prevent="handleSubmit" class="auth-form">
      <h2 class="auth-title">Registro</h2>
      
      <input 
        v-model="username" 
        placeholder="Nombre de usuario" 
        required
        class="form-control"
      >
      
      <input 
        v-model="email" 
        type="email" 
        placeholder="Email" 
        required
        class="form-control"
      >
      
      <input 
        v-model="password" 
        type="password" 
        placeholder="Contraseña" 
        required
        class="form-control"
      >
      
      <input 
        v-model="password1" 
        type="password" 
        placeholder="Confirmar contraseña" 
        required
        class="form-control"
      >
      
      <input 
        v-model="telefono" 
        type="tel" 
        placeholder="Teléfono (Opcional)"
        class="form-control"
      >
      
      <button type="submit" class="btn btn-accent w-100">
        Registrarse <i class="fas fa-arrow-right ml-2"></i>
      </button>
    </form>
  </div>
</template>

<script setup>
const { $axios } = useNuxtApp();

// Variables reactivas
const username = ref('');
const email = ref('');
const password = ref('');
const password1 = ref('');
const telefono = ref('');

// Función de submit
const handleSubmit = async () => {
  // Validación de contraseñas
  if (password.value !== password1.value) {
    alert('Las contraseñas no coinciden'); // [[1]]
    return;
  }

  try {
    const { data } = await $axios.post('/accounts/register/', {
      username: username.value,
      email: email.value,
      password: password.value,
      password1: password1.value,
      telefono: telefono.value || null, // Envía null si está vacío
    });
    router.push('/login'); 
  } catch (error) {
    // Manejo de errores específico
    if (error.response) {
      alert(`Error del servidor: ${error.response.data.message}`); // [[6]]
    } else {
      alert('Error de conexión. Verifica tu red.');
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../assets/scss/_variables.scss';

.auth-container {
  padding: 40px 0;
  max-width: 500px;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
}

.auth-form {
  background: rgba($secondary, 0.05);
  padding: 30px;
  border-radius: 12px;
  box-shadow: $box-shadow;
  border: 1px solid $gray;
}

.auth-title {
  color: $secondary;
  font-family: $font-display;
  margin-bottom: 25px;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background: $primary;
    margin: 10px auto;
    border-radius: 2px;
  }
}

.form-control {
  margin: 15px 0;
  
  &:focus {
    border-color: $accent;
    box-shadow: 0 0 0 2px rgba($accent, 0.2);
  }
}

.btn-accent {
  margin-top: 20px;
  padding: 14px;
  
  i {
    transition: $transition;
  }
  
  &:hover {
    i {
      transform: translateX(5px);
    }
  }
}
</style>

