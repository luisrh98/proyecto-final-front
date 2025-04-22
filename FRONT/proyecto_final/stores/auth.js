// stores/auth.js
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authToken: null,
    refreshToken: null,
    user: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.authToken,
  },
  actions: {
    cargarTokensDesdeSession() {
      if (import.meta.client) {
        this.authToken = sessionStorage.getItem('authToken');
        this.refreshToken = sessionStorage.getItem('refreshToken');
        const userStored = sessionStorage.getItem('authUser');
        this.user = userStored ? JSON.parse(userStored) : null;
      }
    },
    login(user, token, refreshToken) {
      this.authToken = token;
      this.refreshToken = refreshToken;
      this.user = user;
      if (import.meta.client) {
        sessionStorage.setItem('authToken', token);
        sessionStorage.setItem('authUser', JSON.stringify(user));
        sessionStorage.setItem('refreshToken', refreshToken);
      }
    },
    logout() {
      this.authToken = null;
      this.refreshToken = null;
      this.user = null;
      if (import.meta.client) {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('authUser');
        sessionStorage.removeItem('refreshToken');
      }
    },
  },
});
