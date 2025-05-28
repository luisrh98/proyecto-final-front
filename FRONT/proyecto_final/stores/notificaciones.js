// stores/notificaciones.js
import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';

export const useNotificaciones = defineStore('notificaciones', {
  state: () => ({
    notificaciones: [],
    nuevas: 0,
    loading: false,
    error: null
  }),
  actions: {
    async cargar() {
      this.loading = true;
      this.error = null;
      try {
        const { $axios } = useNuxtApp();
        console.log('[Notificaciones Store] - Iniciando carga de notificaciones...');
        
        // Revisa que $axios esté definido
        if (!$axios) {
          console.error('[Notificaciones Store] - $axios no está definido');
          this.error = '$axios no está definido';
          this.loading = false;
          return;
        }

        // Hacer la petición
        const response = await $axios.get('/communications/notificaciones/');
        console.log('[Notificaciones Store] - Respuesta recibida:', response.data);

        this.notificaciones = response.data;
        this.nuevas = this.notificaciones.filter(n => !n.leido).length;
        console.log(`[Notificaciones Store] - Notificaciones cargadas: ${this.notificaciones.length}, Nuevas: ${this.nuevas}`);

      } catch (error) {
        this.error = error.message || 'Error al cargar notificaciones';
        console.error('[Notificaciones Store] - Error cargando notificaciones:', this.error);
      } finally {
        this.loading = false;
        console.log('[Notificaciones Store] - Carga finalizada');
      }
    },

    async marcarLeida(id) {
      try {
        const { $axios } = useNuxtApp();
        console.log(`[Notificaciones Store] - Marcando notificación ${id} como leída...`);
        
        await $axios.post(`/communications/notificaciones/${id}/marcar-leida/`);
        
        const noti = this.notificaciones.find(n => n.id === id);
        if (noti) {
          noti.leido = true;
          console.log(`[Notificaciones Store] - Notificación ${id} marcada como leída en local`);
        }
        
        this.nuevas = this.notificaciones.filter(n => !n.leido).length;
        console.log(`[Notificaciones Store] - Nuevas notificaciones actualizadas: ${this.nuevas}`);

      } catch (error) {
        console.error('[Notificaciones Store] - Error marcando notificación como leída:', error);
      }
    },
  },
});
