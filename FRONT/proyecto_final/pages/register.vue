<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-100 px-4">
    <form @submit.prevent="handleSubmit" class="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl space-y-5 border border-gray-200">
      <h2 class="text-3xl font-semibold text-center text-blue-700">Crear cuenta</h2>

      <input 
        v-model="username" 
        placeholder="Nombre de usuario" 
        required
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input 
        v-model="email" 
        type="email" 
        placeholder="Correo electrónico" 
        required
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input 
        v-model="password" 
        type="password" 
        placeholder="Contraseña" 
        required
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input 
        v-model="password1" 
        type="password" 
        placeholder="Confirmar contraseña" 
        required
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input 
        v-model="telefono" 
        type="tel" 
        placeholder="Teléfono (opcional)"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        type="submit"
        class="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200 flex justify-center items-center gap-2"
      >
        Registrarse
        <i class="fas fa-arrow-right"></i>
      </button>
    </form>
  </div>
</template>

<script setup>
const { $axios } = useNuxtApp();
const router = useRouter();

const username = ref('');
const email = ref('');
const password = ref('');
const password1 = ref('');
const telefono = ref('');

const handleSubmit = async () => {
  if (password.value !== password1.value) {
    alert('Las contraseñas no coinciden');
    return;
  }

  try {
    const { data } = await $axios.post('/accounts/register/', {
      username: username.value,
      email: email.value,
      password: password.value,
      password1: password1.value,
      telefono: telefono.value || null,
    });
    router.push('/login'); 
  } catch (error) {
    if (error.response) {
      alert(`Error del servidor: ${error.response.data.message}`);
    } else {
      alert('Error de conexión. Verifica tu red.');
    }
  }
};
</script>
