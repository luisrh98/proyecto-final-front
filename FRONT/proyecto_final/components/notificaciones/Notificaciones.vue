<template>
  <div class="relative inline-block" ref="contenedorRef">
    <button
      @click="toggleDesplegable"
      class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      Notificaciones ({{ notificacionesNoLeidas }})
    </button>

    <div
      v-if="mostrarDesplegable"
      class="absolute top-full right-0 mt-2 w-64 max-h-72 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg z-50"
    >
      <ul>
        <li
          v-for="noti in notificaciones"
          :key="noti.id"
          :class="{
            'opacity-60 line-through': noti.leido,
            'px-4 py-2 border-b border-gray-200 last:border-b-0': true
          }"
          class="flex justify-between items-center"
        >
          <span class="text-black">{{ noti.mensaje }}</span>
          <button
            v-if="!noti.leido"
            @click.stop="marcarComoLeida(noti.id)"
            class="ml-2 px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Marcar leída
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const notificaciones = ref([])
const mostrarDesplegable = ref(false)
const contenedorRef = ref(null)

const $axios = useNuxtApp().$axios

const toggleDesplegable = () => {
  mostrarDesplegable.value = !mostrarDesplegable.value
}

const cerrarDesplegable = () => {
  mostrarDesplegable.value = false
}

const cargarNotificaciones = async () => {
  try {
    const { data } = await $axios.get('/communications/notificaciones/')
    notificaciones.value = data
  } catch (error) {
    console.error('[Notificaciones] Error cargando notificaciones:', error)
  }
}

const marcarComoLeida = async (id) => {
  try {
    await $axios.post(`/communications/notificaciones/${id}/marcar-leida/`)
    const noti = notificaciones.value.find(n => n.id === id)
    if (noti) noti.leido = true
  } catch (error) {
    console.error('[Notificaciones] Error marcando notificación como leída:', error)
  }
}

const notificacionesNoLeidas = computed(() => {
  return notificaciones.value.filter(noti => !noti.leido).length
})

const onClickOutside = (event) => {
  if (contenedorRef.value && !contenedorRef.value.contains(event.target)) {
    cerrarDesplegable()
  }
}

// Cargar cuando el usuario esté disponible
watch(user, (nuevoUsuario) => {
  if (nuevoUsuario) {
    cargarNotificaciones()
  }
}, { immediate: true }) // ejecuta también si ya estaba cargado al montar

onMounted(() => {

  document.addEventListener('click', onClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>
