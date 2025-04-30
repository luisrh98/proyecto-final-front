<template>
  <div class="admin-dashboard">
    <!-- Menú Lateral -->
    <aside class="sidebar">
      <h2>Panel de Administrador</h2>
      <ul>
        <li><NuxtLink to="/admin/solicitudes">Solicitudes de Gestor</NuxtLink></li>
        <li><NuxtLink to="/admin/usuarios">Gestión de Usuarios</NuxtLink></li>
        <li><NuxtLink to="/admin/productos">Gestión de Productos</NuxtLink></li>
        <li><NuxtLink to="/admin/pedidos">Gestión de Pedidos</NuxtLink></li>
        <li><NuxtLink to="/admin/categorias">Gestión de Categorías</NuxtLink></li>
        <li><NuxtLink to="/admin/pagos">Gestión de Pagos</NuxtLink></li>
        <li><NuxtLink to="/admin/estadisticas">Estadísticas</NuxtLink></li>
        <li><NuxtLink to="/admin/configuracion">Configuración</NuxtLink></li>
      </ul>
    </aside>

    <!-- Contenido Principal -->
    <main class="content">
      <h1>Gestión de Usuarios</h1>

      <!-- Filtros -->
      <div class="filters">
        <input
          type="text"
          v-model="filtroUsuario"
          placeholder="Buscar usuario por nombre o email"
          @input="filtrarUsuarios"
        />
      </div>

      <!-- Tabla de Usuarios -->
      <table class="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="usuario in usuariosFiltrados" :key="usuario.id">
            <td>{{ usuario.id }}</td>
            <td>{{ usuario.username }}</td>
            <td>{{ usuario.email }}</td>
            <td>{{ usuario.tipo }}</td>
            <td>
              <span :class="usuario.is_active ? 'active' : 'inactive'">
                {{ usuario.is_active ? "Activo" : "Inactivo" }}
              </span>
            </td>
            <td>
              <button @click="editarUsuario(usuario)" class="btn btn-edit">Editar</button>
              <button @click="cambiarEstado(usuario)" class="btn btn-toggle">
                {{ usuario.is_active ? "Suspender" : "Activar" }}
              </button>
              <button @click="eliminarUsuario(usuario.id)" class="btn btn-delete">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Modal para Editar Usuario -->
      <div v-if="mostrarModal" class="modal">
        <div class="modal-content">
          <h2>Editar Usuario</h2>
          <form @submit.prevent="guardarCambios">
            <label for="username">Nombre de Usuario:</label>
            <input type="text" id="username" v-model="usuarioEditado.username" disabled />

            <label for="email">Email:</label>
            <input type="email" id="email" v-model="usuarioEditado.email" required />

            <label for="tipo">Tipo de Usuario:</label>
            <select id="tipo" v-model="usuarioEditado.tipo" required>
              <option value="admin">Administrador</option>
              <option value="gestor">Gestor</option>
              <option value="cliente">Cliente</option>
            </select>

            <button type="submit" class="btn btn-save">Guardar Cambios</button>
            <button type="button" class="btn btn-cancel" @click="cerrarModal">Cancelar</button>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useNuxtApp } from "#app";

const router = useRouter();
const { $axios } = useNuxtApp();

// Estados reactivos
const usuarios = ref([]);
const usuariosFiltrados = ref([]);
const filtroUsuario = ref("");
const mostrarModal = ref(false);
const usuarioEditado = ref({
  id: null,
  username: "",
  email: "",
  tipo: "",
});

// Fetch inicial de usuarios
onMounted(async () => {
  await fetchUsuarios();
});

// Función para cargar usuarios desde el backend
const fetchUsuarios = async () => {
  try {
    const { data } = await $axios.get("/accounts/usuarios/");
    usuarios.value = data;
    usuariosFiltrados.value = data; // Inicialmente, todos los usuarios están filtrados
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
    alert("Ocurrió un error al cargar los usuarios.");
  }
};

// Filtrar usuarios por nombre o email
const filtrarUsuarios = () => {
  usuariosFiltrados.value = usuarios.value.filter(
    (usuario) =>
      usuario.username.toLowerCase().includes(filtroUsuario.value.toLowerCase()) ||
      usuario.email.toLowerCase().includes(filtroUsuario.value.toLowerCase())
  );
};

// Abrir modal para editar usuario
const editarUsuario = (usuario) => {
  usuarioEditado.value = { ...usuario };
  mostrarModal.value = true;
};

// Guardar cambios del usuario editado
const guardarCambios = async () => {
  try {
    await $axios.put(`/accounts/usuarios/${usuarioEditado.value.id}/`, usuarioEditado.value);
    await fetchUsuarios(); // Recargar lista de usuarios
    cerrarModal();
    alert("Usuario actualizado correctamente.");
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    alert("Ocurrió un error al actualizar el usuario.");
  }
};

// Cerrar modal
const cerrarModal = () => {
  mostrarModal.value = false;
  usuarioEditado.value = {
    id: null,
    username: "",
    email: "",
    tipo: "",
  };
};

// Cambiar estado del usuario (activar/suspender)
const cambiarEstado = async (usuario) => {
  try {
    const nuevoEstado = !usuario.is_active;
    await $axios.patch(`/accounts/usuarios/${usuario.id}/`, { is_active: nuevoEstado });
    await fetchUsuarios(); // Recargar lista de usuarios
    alert(`Usuario ${nuevoEstado ? "activado" : "suspendido"} correctamente.`);
  } catch (error) {
    console.error("Error al cambiar estado del usuario:", error);
    alert("Ocurrió un error al cambiar el estado del usuario.");
  }
};

// Eliminar usuario
const eliminarUsuario = async (usuarioId) => {
  if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
    try {
      await $axios.delete(`/accounts/usuarios/${usuarioId}/`);
      await fetchUsuarios(); // Recargar lista de usuarios
      alert("Usuario eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Ocurrió un error al eliminar el usuario.");
    }
  }
};
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  height: 100vh;
}

/* Estilo del Menú Lateral */
.sidebar {
  width: 250px;
  background-color: #f4f4f4;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #333;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar ul li {
  margin-bottom: 10px;
}

.sidebar ul li a {
  text-decoration: none;
  color: #333;
  font-size: 1rem;
  padding: 10px;
  display: block;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.sidebar ul li a:hover {
  background-color: #ddd;
}

/* Estilo del Contenido Principal */
.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.filters {
  margin-bottom: 20px;
}

.filters input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table th,
.user-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.user-table th {
  background-color: #f4f4f4;
}

.user-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-edit {
  background-color: #007bff;
  color: white;
}

.btn-toggle {
  background-color: #ffc107;
  color: black;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
}

.active {
  color: green;
}

.inactive {
  color: red;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}

.modal-content form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal-content label {
  font-weight: bold;
}

.modal-content input,
.modal-content select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-content .btn-save {
  background-color: #28a745;
  color: white;
}

.modal-content .btn-cancel {
  background-color: #6c757d;
  color: white;
}
</style>