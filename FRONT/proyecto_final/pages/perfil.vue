<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-100 via-white to-blue-50">
    <Header />
    <Navbar />
    <div class="max-w-2xl mx-auto py-12 px-6">
      <h1 class="text-3xl font-bold text-center text-indigo-700 mb-10">Perfil de Usuario</h1>

      <!-- Mensaje de éxito global -->
      <div v-if="successMessage" class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <p class="text-green-700 text-sm font-medium flex items-center gap-2">
          <i class="fas fa-check-circle"></i>
          {{ successMessage }}
        </p>
      </div>

      <!-- Mensaje de error global -->
      <div v-if="generalError" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-700 text-sm font-medium flex items-center gap-2">
          <i class="fas fa-exclamation-triangle"></i>
          {{ generalError }}
        </p>
      </div>

      <!-- SECCIÓN 1: PERFIL -->
      <section class="mb-6 bg-white rounded-lg shadow-lg overflow-hidden">
        <button
          @click="toggleSection('perfil')"
          class="w-full px-6 py-4 bg-indigo-600 text-white font-semibold text-left flex items-center justify-between hover:bg-indigo-700 transition-colors"
        >
          <div class="flex items-center gap-3">
            <i class="fas fa-user"></i>
            <span>Información Personal</span>
          </div>
          <i :class="['fas', sectionsOpen.perfil ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
        </button>
        <div v-show="sectionsOpen.perfil" class="p-6">
          <div v-if="loadingStates.perfil" class="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-blue-700 text-sm font-medium flex items-center gap-2">
              <i class="fas fa-spinner fa-spin"></i>
              Guardando información personal...
            </p>
          </div>
          <form @submit.prevent="saveProfile" v-if="usuario" class="space-y-6">
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
                required
                minlength="2"
                maxlength="50"
                :disabled="loadingStates.perfil"
                :class="[
                  'w-full p-3 border rounded-lg transition-colors',
                  errors.perfil.first_name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                ]"
              />
              <p v-if="errors.perfil.first_name" class="text-red-500 text-sm mt-1 flex items-center gap-1">
                <i class="fas fa-exclamation-circle text-xs"></i>
                {{ errors.perfil.first_name }}
              </p>
            </div>
            <div class="form-group">
              <label for="last_name" class="block text-lg font-medium text-gray-700">Apellidos</label>
              <input
                id="last_name"
                v-model="usuario.last_name"
                type="text"
                required
                minlength="2"
                maxlength="80"
                :disabled="loadingStates.perfil"
                :class="[
                  'w-full p-3 border rounded-lg transition-colors',
                  errors.perfil.last_name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                ]"
              />
              <p v-if="errors.perfil.last_name" class="text-red-500 text-sm mt-1 flex items-center gap-1">
                <i class="fas fa-exclamation-circle text-xs"></i>
                {{ errors.perfil.last_name }}
              </p>
            </div>
            <div class="form-group">
              <label for="email" class="block text-lg font-medium text-gray-700">Email</label>
              <input
                id="email"
                v-model="usuario.email"
                type="email"
                required
                :disabled="loadingStates.perfil"
                :class="[
                  'w-full p-3 border rounded-lg transition-colors',
                  errors.perfil.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                ]"
              />
              <p v-if="errors.perfil.email" class="text-red-500 text-sm mt-1 flex items-center gap-1">
                <i class="fas fa-exclamation-circle text-xs"></i>
                {{ errors.perfil.email }}
              </p>
            </div>
            <div class="form-group">
              <label for="telefono" class="block text-lg font-medium text-gray-700">Teléfono</label>
              <input
                id="telefono"
                v-model="usuario.telefono"
                type="tel"
                pattern="\d{9,15}"
                title="Introduce un número de teléfono válido (entre 9 y 15 dígitos)"
                :disabled="loadingStates.perfil"
                :class="[
                  'w-full p-3 border rounded-lg transition-colors',
                  errors.perfil.telefono ? 'border-red-300 bg-red-50' : 'border-gray-300'
                ]"
              />
              <p v-if="errors.perfil.telefono" class="text-red-500 text-sm mt-1 flex items-center gap-1">
                <i class="fas fa-exclamation-circle text-xs"></i>
                {{ errors.perfil.telefono }}
              </p>
            </div>
            <div class="text-center pt-4">
              <button 
                type="submit" 
                :disabled="loadingStates.perfil"
                :class="[
                  'w-full py-3 px-6 font-semibold rounded-lg transition',
                  loadingStates.perfil 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                ]"
              >
                <template v-if="loadingStates.perfil">
                  <i class="fas fa-spinner fa-spin mr-2"></i>
                  Guardando...
                </template>
                <template v-else>
                  Guardar Información Personal
                </template>
              </button>
            </div>
          </form>
        </div>
      </section>

      <!-- SECCIÓN 2: DIRECCIÓN -->
      <section class="mb-6 bg-white rounded-lg shadow-lg overflow-hidden">
        <button
          @click="toggleSection('direccion')"
          class="w-full px-6 py-4 bg-green-600 text-white font-semibold text-left flex items-center justify-between hover:bg-green-700 transition-colors"
        >
          <div class="flex items-center gap-3">
            <i class="fas fa-map-marker-alt"></i>
            <span>Dirección</span>
            <span v-if="hasAddress" class="text-xs bg-green-800 px-2 py-1 rounded-full">Configurada</span>
          </div>
          <i :class="['fas', sectionsOpen.direccion ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
        </button>
        <div v-show="sectionsOpen.direccion" class="p-6">
          <div v-if="loadingStates.direccion" class="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-blue-700 text-sm font-medium flex items-center gap-2">
              <i class="fas fa-spinner fa-spin"></i>
              Procesando dirección...
            </p>
          </div>
          <form @submit.prevent="saveDireccion" v-if="usuario" class="space-y-6">
            <div class="form-group">
              <label for="calle" class="block text-lg font-medium text-gray-700">Calle</label>
              <input
                id="calle"
                v-model="usuario.direccion.calle"
                type="text"
                minlength="3"
                maxlength="100"
                :disabled="loadingStates.direccion"
                :class="[
                  'w-full p-3 border rounded-lg transition-colors',
                  errors.direccion.calle ? 'border-red-300 bg-red-50' : 'border-gray-300'
                ]"
              />
              <p v-if="errors.direccion.calle" class="text-red-500 text-sm mt-1 flex items-center gap-1">
                <i class="fas fa-exclamation-circle text-xs"></i>
                {{ errors.direccion.calle }}
              </p>
            </div>
            <div class="form-group">
              <label for="ciudad" class="block text-lg font-medium text-gray-700">Ciudad</label>
              <input
                id="ciudad"
                v-model="usuario.direccion.ciudad"
                type="text"
                minlength="2"
                maxlength="60"
                :disabled="loadingStates.direccion"
                :class="[
                  'w-full p-3 border rounded-lg transition-colors',
                  errors.direccion.ciudad ? 'border-red-300 bg-red-50' : 'border-gray-300'
                ]"
              />
              <p v-if="errors.direccion.ciudad" class="text-red-500 text-sm mt-1 flex items-center gap-1">
                <i class="fas fa-exclamation-circle text-xs"></i>
                {{ errors.direccion.ciudad }}
              </p>
            </div>
            <div class="form-group">
              <label for="codigo_postal" class="block text-lg font-medium text-gray-700">Código Postal</label>
              <input
                id="codigo_postal"
                v-model="usuario.direccion.codigo_postal"
                type="text"
                pattern="\d{4,10}"
                title="Introduce un código postal válido"
                :disabled="loadingStates.direccion"
                :class="[
                  'w-full p-3 border rounded-lg transition-colors',
                  errors.direccion.codigo_postal ? 'border-red-300 bg-red-50' : 'border-gray-300'
                ]"
              />
              <p v-if="errors.direccion.codigo_postal" class="text-red-500 text-sm mt-1 flex items-center gap-1">
                <i class="fas fa-exclamation-circle text-xs"></i>
                {{ errors.direccion.codigo_postal }}
              </p>
            </div>
            <div class="form-group">
              <label for="pais" class="block text-lg font-medium text-gray-700">País</label>
              <input
                id="pais"
                v-model="usuario.direccion.pais"
                type="text"
                minlength="2"
                maxlength="50"
                :disabled="loadingStates.direccion"
                :class="[
                  'w-full p-3 border rounded-lg transition-colors',
                  errors.direccion.pais ? 'border-red-300 bg-red-50' : 'border-gray-300'
                ]"
              />
              <p v-if="errors.direccion.pais" class="text-red-500 text-sm mt-1 flex items-center gap-1">
                <i class="fas fa-exclamation-circle text-xs"></i>
                {{ errors.direccion.pais }}
              </p>
            </div>
            <div class="flex gap-4 pt-4">
              <button 
                type="submit" 
                :disabled="loadingStates.direccion"
                :class="[
                  'flex-1 py-3 px-6 font-semibold rounded-lg transition',
                  loadingStates.direccion 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                ]"
              >
                <template v-if="loadingStates.direccion">
                  <i class="fas fa-spinner fa-spin mr-2"></i>
                  Guardando...
                </template>
                <template v-else>
                  Guardar Dirección
                </template>
              </button>
              <button
                type="button"
                v-if="hasAddress"
                :disabled="loadingStates.direccion"
                :class="[
                  'flex-1 py-3 px-6 font-semibold rounded-lg transition',
                  loadingStates.direccion 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-red-500 text-white hover:bg-red-600'
                ]"
                @click="showDeleteModal = true"
              >
                Eliminar Dirección
              </button>
            </div>
          </form>
        </div>
      </section>

      <!-- SECCIÓN 3: SOLICITUD DE GESTOR -->
      <section v-if="usuario && usuario.tipo === 'cliente'" class="mb-6 bg-white rounded-lg shadow-lg overflow-hidden">
        <button
          @click="toggleSection('gestor')"
          class="w-full px-6 py-4 bg-purple-600 text-white font-semibold text-left flex items-center justify-between hover:bg-purple-700 transition-colors"
        >
          <div class="flex items-center gap-3">
            <i class="fas fa-store"></i>
            <span>Solicitar ser Gestor</span>
            <span v-if="usuario.solicitud_gestor" class="text-xs bg-yellow-600 px-2 py-1 rounded-full">Pendiente</span>
          </div>
          <i :class="['fas', sectionsOpen.gestor ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
        </button>
        <div v-show="sectionsOpen.gestor" class="p-6">
          <div v-if="loadingStates.gestor" class="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-blue-700 text-sm font-medium flex items-center gap-2">
              <i class="fas fa-spinner fa-spin"></i>
              Enviando solicitud...
            </p>
          </div>
          <div v-if="usuario.solicitud_gestor" class="text-center bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p class="text-lg text-yellow-700 flex items-center justify-center gap-2 mb-4">
              <i class="fas fa-clock"></i>
              Tu solicitud para ser gestor está pendiente de aprobación.
            </p>
            <p class="text-sm text-yellow-600">
              Recibirás una notificación por email cuando tu solicitud sea procesada.
            </p>
          </div>
          <form v-else @submit.prevent="enviarSolicitudGestor" class="space-y-6">
            <div class="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p class="text-blue-700 text-sm">
                <i class="fas fa-info-circle mr-2"></i>
                Al solicitar ser gestor podrás crear y administrar tu propia tienda en nuestra plataforma.
              </p>
            </div>
            <div class="form-group">
              <label for="nombre_tienda" class="block text-lg font-medium text-gray-700">Nombre de la Tienda</label>
              <input
                id="nombre_tienda"
                v-model="datosGestor.nombre_tienda"
                type="text"
                required
                minlength="3"
                maxlength="100"
                :disabled="loadingStates.gestor"
                :class="[
                  'w-full p-3 border rounded-lg transition-colors',
                  errors.gestor.nombre_tienda ? 'border-red-300 bg-red-50' : 'border-gray-300'
                ]"
              />
              <p v-if="errors.gestor.nombre_tienda" class="text-red-500 text-sm mt-1 flex items-center gap-1">
                <i class="fas fa-exclamation-circle text-xs"></i>
                {{ errors.gestor.nombre_tienda }}
              </p>
            </div>
            <div class="form-group">
              <label for="identificacion_fiscal" class="block text-lg font-medium text-gray-700">Identificación Fiscal</label>
              <input
                id="identificacion_fiscal"
                v-model="datosGestor.identificacion_fiscal"
                type="text"
                required
                minlength="5"
                maxlength="20"
                :disabled="loadingStates.gestor"
                :class="[
                  'w-full p-3 border rounded-lg transition-colors',
                  errors.gestor.identificacion_fiscal ? 'border-red-300 bg-red-50' : 'border-gray-300'
                ]"
              />
              <p v-if="errors.gestor.identificacion_fiscal" class="text-red-500 text-sm mt-1 flex items-center gap-1">
                <i class="fas fa-exclamation-circle text-xs"></i>
                {{ errors.gestor.identificacion_fiscal }}
              </p>
            </div>
            <div class="text-center pt-4">
              <button
                type="submit"
                :disabled="loadingStates.gestor"
                :class="[
                  'w-full py-3 px-6 font-semibold rounded-lg transition',
                  loadingStates.gestor 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                ]"
              >
                <template v-if="loadingStates.gestor">
                  <i class="fas fa-spinner fa-spin mr-2"></i>
                  Enviando...
                </template>
                <template v-else>
                  Enviar Solicitud
                </template>
              </button>
            </div>
          </form>
        </div>
      </section>

      <!-- Modal de confirmación para eliminar dirección -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div class="text-center">
            <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">¿Eliminar dirección?</h3>
            <p class="text-gray-600 mb-6">
              Esta acción eliminará permanentemente tu dirección. ¿Estás seguro de que quieres continuar?
            </p>
            <div class="flex gap-4">
              <button
                @click="showDeleteModal = false"
                :disabled="loadingStates.direccion"
                class="flex-1 py-2 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                @click="confirmDeleteAddress"
                :disabled="loadingStates.direccion"
                :class="[
                  'flex-1 py-2 px-4 rounded-lg transition-colors',
                  loadingStates.direccion
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600'
                ]"
              >
                <template v-if="loadingStates.direccion">
                  <i class="fas fa-spinner fa-spin mr-2"></i>
                  Eliminando...
                </template>
                <template v-else>
                  Sí, eliminar
                </template>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNuxtApp } from '#app'

const { $axios } = useNuxtApp()
const authStore = useAuthStore()
const router = useRouter()

// Estados de control
const sectionsOpen = reactive({
  perfil: true,
  direccion: false,
  gestor: false
})
const loadingStates = reactive({
  perfil: false,
  direccion: false,
  gestor: false
})
const showDeleteModal = ref(false)
const successMessage = ref('')
const generalError = ref('')

// Manejo de errores
const errors = reactive({
  perfil: {
    first_name: '',
    last_name: '',
    email: '',
    telefono: ''
  },
  direccion: {
    calle: '',
    ciudad: '',
    codigo_postal: '',
    pais: ''
  },
  gestor: {
    nombre_tienda: '',
    identificacion_fiscal: ''
  }
})

// Datos del usuario
const usuario = ref({
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  telefono: '',
  tipo: 'cliente',
  direccion: {
    calle: '',
    ciudad: '',
    codigo_postal: '',
    pais: ''
  },
  solicitud_gestor: false
})

const datosGestor = ref({
  nombre_tienda: '',
  identificacion_fiscal: ''
})

// Computed para verificar si hay dirección
const hasAddress = computed(() => {
  const dir = usuario.value?.direccion
  return dir && (dir.calle || dir.ciudad || dir.codigo_postal || dir.pais)
})

// Función para alternar secciones
function toggleSection(section) {
  sectionsOpen[section] = !sectionsOpen[section]
}

// Función para limpiar errores de una sección
function clearSectionErrors(section) {
  Object.keys(errors[section]).forEach(key => errors[section][key] = '')
}

// Función para limpiar mensajes generales
function clearMessages() {
  successMessage.value = ''
  generalError.value = ''
}

// Función para manejar errores del backend
function handleBackendErrors(error, section) {
  if (error.response?.status === 400) {
    const responseData = error.response.data
    if (responseData && typeof responseData === 'object') {
      Object.keys(responseData).forEach(field => {
        const fieldErrors = responseData[field]
        if (field === 'non_field_errors') {
          generalError.value = Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors
        } else if (field in errors[section]) {
          errors[section][field] = Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors
        } else if (field.includes('direccion') && section === 'direccion') {
          const direccionField = field.replace('direccion.', '')
          if (direccionField in errors.direccion) {
            errors.direccion[direccionField] = Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors
          }
        } else {
          const errorMsg = Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors
          generalError.value = generalError.value ? `${generalError.value}; ${errorMsg}` : errorMsg
        }
      })
    } else {
      generalError.value = error.message || 'Error de validación en los datos enviados.'
    }
  } else if (error.isNetworkError) {
    generalError.value = 'Error de conexión. Verifica tu conexión a internet.'
  } else if (error.isForbidden) {
    generalError.value = 'No tienes permisos para realizar esta acción.'
  } else if (error.isServerError) {
    generalError.value = 'Error del servidor. Intenta más tarde.'
  } else {
    generalError.value = error.message || 'Ha ocurrido un error inesperado. Intenta nuevamente.'
  }
}

// Cargar datos del usuario
async function fetchUsuario() {
  loadingStates.perfil = true
  clearSectionErrors('perfil')
  try {
    const token = authStore.authToken
    if (!token) throw new Error('No hay token disponible')
    const { data } = await $axios.get('/accounts/me/', {
      headers: { Authorization: `Bearer ${token}` }
    })
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
    handleBackendErrors(error, 'perfil')
    if (error.response?.status === 401) {
      router.push('/login')
    }
  } finally {
    loadingStates.perfil = false
  }
}

// Guardar cambios en el perfil
async function saveProfile() {
  loadingStates.perfil = true
  clearSectionErrors('perfil')
  clearMessages()
  try {
    const token = authStore.authToken
    if (!token) throw new Error('No hay token disponible')
    const profileData = {
      username: usuario.value.username,
      first_name: usuario.value.first_name,
      last_name: usuario.value.last_name,
      email: usuario.value.email,
      telefono: usuario.value.telefono
    }
    await $axios.put('/accounts/me/', profileData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    successMessage.value = 'Información personal actualizada con éxito'
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  } catch (error) {
    console.error('Error al actualizar perfil:', error)
    handleBackendErrors(error, 'perfil')
  } finally {
    loadingStates.perfil = false
  }
}

// Guardar dirección
async function saveDireccion() {
  loadingStates.direccion = true
  clearSectionErrors('direccion')
  clearMessages()
  try {
    const token = authStore.authToken
    if (!token) throw new Error('No hay token disponible')
    await $axios.put('/accounts/me/', {
      direccion: usuario.value.direccion
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    successMessage.value = 'Dirección actualizada con éxito'
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  } catch (error) {
    console.error('Error al actualizar dirección:', error)
    handleBackendErrors(error, 'direccion')
  } finally {
    loadingStates.direccion = false
  }
}

// Confirmar eliminación de dirección
async function confirmDeleteAddress() {
  loadingStates.direccion = true
  clearMessages()
  try {
    const token = authStore.authToken
    if (!token) throw new Error('No hay token disponible')
    await $axios.put('/accounts/me/', {
      direccion: {
        calle: '',
        ciudad: '',
        codigo_postal: '',
        pais: ''
      }
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    usuario.value.direccion = {
      calle: '',
      ciudad: '',
      codigo_postal: '',
      pais: ''
    }
    showDeleteModal.value = false
    successMessage.value = 'Dirección eliminada con éxito'
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  } catch (error) {
    console.error('Error al eliminar dirección:', error)
    handleBackendErrors(error, 'direccion')
  } finally {
    loadingStates.direccion = false
  }
}

// Enviar solicitud para ser gestor
async function enviarSolicitudGestor() {
  loadingStates.gestor = true
  clearSectionErrors('gestor')
  clearMessages()
  try {
    const token = authStore.authToken
    if (!token) throw new Error('No hay token disponible')
    await $axios.post(
      '/accounts/solicitar-gestor/',
      {
        nombre_tienda: datosGestor.value.nombre_tienda,
        identificacion_fiscal: datosGestor.value.identificacion_fiscal,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    usuario.value.solicitud_gestor = true
    successMessage.value = 'Solicitud enviada con éxito'
    datosGestor.value = {
      nombre_tienda: '',
      identificacion_fiscal: '',
    }
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  } catch (error) {
    console.error('Error al enviar solicitud:', error)
    handleBackendErrors(error, 'gestor')
  } finally {
    loadingStates.gestor = false
  }
}

// Limpiar errores cuando el usuario empiece a escribir
watch([
  () => usuario.value.first_name,
  () => usuario.value.last_name,
  () => usuario.value.email,
  () => usuario.value.telefono
], () => {
  clearSectionErrors('perfil')
  if (generalError.value) generalError.value = ''
})

watch([
  () => usuario.value.direccion.calle,
  () => usuario.value.direccion.ciudad,
  () => usuario.value.direccion.codigo_postal,
  () => usuario.value.direccion.pais
], () => {
  clearSectionErrors('direccion')
  if (generalError.value) generalError.value = ''
})

watch([
  () => datosGestor.value.nombre_tienda,
  () => datosGestor.value.identificacion_fiscal
], () => {
  clearSectionErrors('gestor')
  if (generalError.value) generalError.value = ''
})

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