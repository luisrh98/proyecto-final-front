<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-100 px-4">
    <form @submit.prevent="handleSubmit" class="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl space-y-5 border border-gray-200">
      <h2 class="text-3xl font-semibold text-center text-blue-700">Crear cuenta</h2>

      <!-- Mensaje de éxito -->
      <p v-if="successMessage" class="text-green-600 text-sm text-center font-medium">
        {{ successMessage }}
      </p>

      <!-- Nombre de usuario -->
      <input 
        v-model="username" 
        placeholder="Nombre de usuario" 
        required
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <!-- Correo electrónico -->
      <input 
        v-model="email" 
        type="email" 
        placeholder="Correo electrónico" 
        required
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <!-- Contraseña -->
      <div>
        <input 
          v-model="password" 
          type="password" 
          placeholder="Contraseña" 
          required
          @input="checkPasswordStrength"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div class="mt-2 h-2 rounded bg-gray-200 overflow-hidden">
          <div 
            :class="strengthBarClass" 
            class="h-full transition-all duration-300 ease-in-out"
            :style="{ width: passwordStrength.width }"
          ></div>
        </div>
        <p class="text-sm mt-1 font-medium" :class="strengthTextClass">
          {{ passwordStrength.label }}
        </p>
        <ul class="text-xs text-gray-500 mt-2 list-disc list-inside">
          <li>Mínimo 8 caracteres</li>
          <li>Incluye mayúsculas, minúsculas y números</li>
          <li>Recomendado: usar símbolos (@, #, %, etc.)</li>
        </ul>
      </div>

      <!-- Confirmar contraseña -->
      <input 
        v-model="password1" 
        type="password" 
        placeholder="Confirmar contraseña" 
        required
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <!-- Teléfono -->
      <input 
        v-model="telefono" 
        type="tel" 
        placeholder="Teléfono (opcional)"
        pattern="^[0-9]{9,15}$"
        title="Debe contener entre 9 y 15 dígitos numéricos"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <!-- Botón de registro -->
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
const successMessage = ref('');

// Password strength state
const passwordStrength = reactive({
  label: 'Introduce una contraseña',
  width: '0%',
  level: 0,
});

// Determina el color de la barra de seguridad
const strengthBarClass = computed(() => {
  switch (passwordStrength.level) {
    case 1: return 'bg-red-500';
    case 2: return 'bg-yellow-400';
    case 3: return 'bg-green-500';
    default: return 'bg-gray-300';
  }
});

// Determina el color del texto según la seguridad
const strengthTextClass = computed(() => {
  switch (passwordStrength.level) {
    case 1: return 'text-red-500';
    case 2: return 'text-yellow-600';
    case 3: return 'text-green-600';
    default: return 'text-gray-500';
  }
});

// Verifica fuerza de la contraseña
function checkPasswordStrength() {
  const value = password.value;
  let score = 0;

  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;

  if (score <= 1) {
    passwordStrength.label = 'Poco segura';
    passwordStrength.width = '25%';
    passwordStrength.level = 1;
  } else if (score === 2 || score === 3) {
    passwordStrength.label = 'Segura';
    passwordStrength.width = '60%';
    passwordStrength.level = 2;
  } else if (score >= 4) {
    passwordStrength.label = 'Muy segura';
    passwordStrength.width = '100%';
    passwordStrength.level = 3;
  } else {
    passwordStrength.label = 'Introduce una contraseña';
    passwordStrength.width = '0%';
    passwordStrength.level = 0;
  }
}

// Validación manual previa al envío
function validateForm() {
  if (password.value !== password1.value) {
    alert('❌ Las contraseñas no coinciden');
    return false;
  }
  if (telefono.value && !/^[0-9]{9,15}$/.test(telefono.value)) {
    alert('❌ El teléfono debe tener entre 9 y 15 dígitos numéricos');
    return false;
  }
  return true;
}

// Envío del formulario
const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    await $axios.post('/accounts/register/', {
      username: username.value,
      email: email.value,
      password: password.value,
      password1: password1.value,
      telefono: telefono.value || null,
    });

    successMessage.value = '✅ Se ha enviado un correo electrónico para verificar tu cuenta. Revisa tu bandeja de entrada o la carpeta de spam.';

    setTimeout(() => {
      router.push('/login');
    }, 4000);

  } catch (error) {
    if (error.response?.data) {
      alert(`❌ Error del servidor: ${JSON.stringify(error.response.data)}`);
    } else {
      alert('❌ Error de conexión. Verifica tu red.');
    }
  }
};
</script>
