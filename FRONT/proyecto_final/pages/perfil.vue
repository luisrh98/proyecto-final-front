<template>
  <div class="profile-container">
    <!-- Cabecera -->
    <Header></Header>

    <!-- Barra de navegación -->
    <Navbar />

    <!-- Contenido principal -->
    <div class="content-wrapper">
      <!-- Título de perfil -->
      <h1 class="profile-title">Perfil de Usuario</h1>

      <!-- Formulario de perfil -->
      <form @submit.prevent="saveProfile" v-if="usuario" class="profile-form">
        <!-- Datos de Usuario -->
        <div class="form-group">
          <label for="username" class="label">Usuario</label>
          <input
            id="username"
            v-model="usuario.username"
            type="text"
            readonly
            class="input-disabled"
          />
        </div>

        <div class="form-group">
          <label for="first_name" class="label">Nombre</label>
          <input
            id="first_name"
            v-model="usuario.first_name"
            type="text"
            class="input"
          />
        </div>

        <div class="form-group">
          <label for="last_name" class="label">Apellidos</label>
          <input
            id="last_name"
            v-model="usuario.last_name"
            type="text"
            class="input"
          />
        </div>

        <div class="form-group">
          <label for="email" class="label">Email</label>
          <input
            id="email"
            v-model="usuario.email"
            type="email"
            required
            class="input"
          />
        </div>

        <div class="form-group">
          <label for="telefono" class="label">Teléfono</label>
          <input
            id="telefono"
            v-model="usuario.telefono"
            type="text"
            class="input"
          />
        </div>

        <!-- Dirección -->
        <div class="address-section">
          <h3 class="address-title">Dirección</h3>

          <div class="address-card">
            <div class="form-group">
              <label for="calle" class="label">Calle</label>
              <input
                id="calle"
                v-model="usuario.direccion.calle"
                type="text"
                required
                class="input"
              />
            </div>

            <div class="form-group">
              <label for="ciudad" class="label">Ciudad</label>
              <input
                id="ciudad"
                v-model="usuario.direccion.ciudad"
                type="text"
                required
                class="input"
              />
            </div>

            <div class="form-group">
              <label for="codigo_postal" class="label">Código Postal</label>
              <input
                id="codigo_postal"
                v-model="usuario.direccion.codigo_postal"
                type="text"
                required
                class="input"
              />
            </div>

            <div class="form-group">
              <label for="pais" class="label">País</label>
              <input
                id="pais"
                v-model="usuario.direccion.pais"
                type="text"
                required
                class="input"
              />
            </div>

            <button
              type="button"
              class="btn btn-danger mt-4"
              @click="removeAddress"
            >
              Eliminar Dirección
            </button>
          </div>
        </div>

        <!-- Sección para solicitar ser gestor -->
        <div v-if="usuario.tipo === 'cliente' && !usuario.solicitud_gestor" class="vendor-request-section">
          <h3>Solicitar ser gestor</h3>
          <div class="form-group">
            <label for="nombre_tienda">Nombre de la Tienda</label>
            <input
              id="nombre_tienda"
              v-model="datosGestor.nombre_tienda"
              type="text"
              required
              class="input"
            />
          </div>
          <div class="form-group">
            <label for="identificacion_fiscal">Identificación Fiscal</label>
            <input
              id="identificacion_fiscal"
              v-model="datosGestor.identificacion_fiscal"
              type="text"
              required
              class="input"
            />
          </div>
          <button type="button" class="btn btn-primary" @click="enviarSolicitudGestor">
            Enviar solicitud
          </button>
        </div>

        <!-- Mensaje si ya se envió la solicitud -->
        <div v-if="usuario.solicitud_gestor" class="vendor-request-status">
          <p>Tu solicitud para ser gestor está pendiente de aprobación.</p>
        </div>

        <!-- Botón de guardar cambios -->
        <div class="action-buttons">
          <button type="submit" class="btn btn-primary w-full md:w-auto">
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>

    <!-- Footer -->
    <Footer></Footer>
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

<style lang="scss" scoped>
@import '../assets/scss/_variables.scss';
@import '../assets/scss/global.scss';

.profile-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
}

/* Contenido principal */
.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin-top: 40px; /* Ajustar el espacio superior */
}

.profile-title {
  font-size: 2rem;
  font-weight: 600;
  color: #333333; /* Color más oscuro para el título */
}

.profile-form {
  background: #ffffff; /* Blanco para el fondo del formulario */
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1); /* Sombra más prominente */
  width: 100%;
  max-width: 800px;
}

.form-group {
  margin-bottom: 20px;
}

.label {
  display: block;
  font-weight: bold;
  color: #555555; /* Color más suave para las etiquetas */
}

.input, .input-disabled {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-top: 5px;
  font-size: 1rem;
}

.input-disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.address-section {
  margin-top: 20px;
}

.address-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333333;
}

.address-card {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.btn {
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
  font-size: 1rem;
}

.btn-primary {
  background-color: #007bff; /* Color azul para el botón principal */
  color: white;
  border: none;
}

.btn-secondary {
  background-color: #28a745; /* Verde suave para el botón secundario */
  color: white;
  border: none;
}

.btn-danger {
  background-color: #dc3545; /* Rojo para el botón de eliminar */
  color: white;
  border: none;
}

.vendor-request-section {
  margin-top: 20px;
  border-top: 1px solid #ddd;
  padding-top: 20px;
}

.vendor-request-status {
  margin-top: 20px;
  color: #555;
}

.social-icons {
  display: flex;
  gap: 15px;
  font-size: 1.5rem;
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 10px;
  }

  .form-group {
    margin-bottom: 15px;
  }
}
</style>