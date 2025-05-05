<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-100 via-white to-blue-50">
    <!-- Cabecera -->
    <Header />
    <!-- Barra de navegación -->
    <Navbar />

    <!-- Contenido principal -->
    <div class="max-w-2xl mx-auto py-12 px-6">
      <h1 class="text-3xl font-bold text-center text-indigo-700 mb-10">Perfil de Usuario</h1>

      <!-- Formulario de perfil -->
      <form @submit.prevent="saveProfile" v-if="usuario" class="space-y-6 bg-white p-8 rounded-lg shadow-lg">
        <!-- Datos de Usuario -->
        <div class="form-group">
          <label for="username" class="block text-lg font-medium text-gray-700">Usuario</label>
          <input
            id="username"
            v-model="usuario.username"
            type="text"
            readonly
            class="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>

        <div class="form-group">
          <label for="first_name" class="block text-lg font-medium text-gray-700">Nombre</label>
          <input
            id="first_name"
            v-model="usuario.first_name"
            type="text"
            class="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div class="form-group">
          <label for="last_name" class="block text-lg font-medium text-gray-700">Apellidos</label>
          <input
            id="last_name"
            v-model="usuario.last_name"
            type="text"
            class="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div class="form-group">
          <label for="email" class="block text-lg font-medium text-gray-700">Email</label>
          <input
            id="email"
            v-model="usuario.email"
            type="email"
            required
            class="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div class="form-group">
          <label for="telefono" class="block text-lg font-medium text-gray-700">Teléfono</label>
          <input
            id="telefono"
            v-model="usuario.telefono"
            type="text"
            class="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <!-- Dirección -->
        <div class="address-section mt-8">
          <h3 class="text-xl font-semibold text-gray-800">Dirección</h3>

          <div class="address-card space-y-4 mt-4">
            <div class="form-group">
              <label for="calle" class="block text-lg font-medium text-gray-700">Calle</label>
              <input
                id="calle"
                v-model="usuario.direccion.calle"
                type="text"
                required
                class="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div class="form-group">
              <label for="ciudad" class="block text-lg font-medium text-gray-700">Ciudad</label>
              <input
                id="ciudad"
                v-model="usuario.direccion.ciudad"
                type="text"
                required
                class="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div class="form-group">
              <label for="codigo_postal" class="block text-lg font-medium text-gray-700">Código Postal</label>
              <input
                id="codigo_postal"
                v-model="usuario.direccion.codigo_postal"
                type="text"
                required
                class="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div class="form-group">
              <label for="pais" class="block text-lg font-medium text-gray-700">País</label>
              <input
                id="pais"
                v-model="usuario.direccion.pais"
                type="text"
                required
                class="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <button
              type="button"
              class="w-full py-3 mt-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
              @click="removeAddress"
            >
              Eliminar Dirección
            </button>
          </div>
        </div>

        <!-- Solicitar ser gestor -->
        <div v-if="usuario.tipo === 'cliente' && !usuario.solicitud_gestor" class="mt-8">
          <h3 class="text-xl font-semibold text-gray-800">Solicitar ser Gestor</h3>
          <div class="form-group">
            <label for="nombre_tienda" class="block text-lg font-medium text-gray-700">Nombre de la Tienda</label>
            <input
              id="nombre_tienda"
              v-model="datosGestor.nombre_tienda"
              type="text"
              required
              class="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div class="form-group">
            <label for="identificacion_fiscal" class="block text-lg font-medium text-gray-700">Identificación Fiscal</label>
            <input
              id="identificacion_fiscal"
              v-model="datosGestor.identificacion_fiscal"
              type="text"
              required
              class="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <button
            type="button"
            class="w-full py-3 mt-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
            @click="enviarSolicitudGestor"
          >
            Enviar solicitud
          </button>
        </div>

        <!-- Estado solicitud gestor -->
        <div v-if="usuario.solicitud_gestor" class="mt-8 text-center">
          <p class="text-lg text-gray-600">Tu solicitud para ser gestor está pendiente de aprobación.</p>
        </div>

        <!-- Botón de guardar cambios -->
        <div class="action-buttons mt-10 text-center">
          <button type="submit" class="w-full py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition">
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>



<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const { $axios } = useNuxtApp()
const authStore = useAuthStore()
const router = useRouter()

// Datos del usuario
const usuario = ref({
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  telefono: '',
  tipo: 'cliente',
  direccion: { // Dirección como objeto único
    calle: '',
    ciudad: '',
    codigo_postal: '',
    pais: ''
  },
  solicitud_gestor: false, // Estado de la solicitud
})

// Datos específicos para la solicitud de gestor
const datosGestor = ref({
  nombre_tienda: '',
  identificacion_fiscal: '',
})

// Cargar datos del usuario
const fetchUsuario = async () => {
  try {
    const token = authStore.authToken
    if (!token) throw new Error('No hay token disponible')

    const { data } = await $axios.get('/accounts/me/', {
      headers: { Authorization: `Bearer ${token}` }
    })

    // Asegúrate de que la dirección sea un objeto vacío si no existe
    usuario.value = {
      ...data,
      direccion: data.direccion || {
        calle: '',
        ciudad: '',
        codigo_postal: '',
        pais: ''
      }
    }
  } catch (error) {
    console.error('Error al cargar perfil:', error)
    router.push('/login') // Redirigir si falla el fetch
  }
}

// Guardar cambios en el perfil
const saveProfile = async () => {
  try {
    const token = authStore.authToken
    if (!token) throw new Error('No hay token disponible')

    await $axios.put('/accounts/me/', usuario.value, {
      headers: { Authorization: `Bearer ${token}` }
    })
    alert('Perfil actualizado con éxito')
  } catch (error) {
    console.error('Error al actualizar:', error)
    alert('Ocurrió un error al guardar los cambios')
  }
}

// Eliminar dirección reiniciando los campos
const removeAddress = () => {
  usuario.value.direccion = null; // Enviar null al backend
};

// Enviar solicitud para ser gestor
const enviarSolicitudGestor = async () => {
  try {
    const token = authStore.authToken;
    if (!token) throw new Error('No hay token disponible');

    await $axios.post(
      '/accounts/solicitar-gestor/',
      {
        nombre_tienda: datosGestor.value.nombre_tienda,
        identificacion_fiscal: datosGestor.value.identificacion_fiscal,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    usuario.value.solicitud_gestor = true;
    alert('Solicitud enviada con éxito');
  } catch (error) {
    console.error('Error al enviar solicitud:', error);
    alert('Ocurrió un error al enviar la solicitud');
  }
};

onMounted(() => {
  
  if (import.meta.client) {
    authStore.cargarTokensDesdeSession()

    if (!authStore.isLoggedIn) {
      router.push('/login')
      return
    }

    fetchUsuario()
  }
})
</script>

