export default defineNuxtRouteMiddleware((to) => {
    const authToken = sessionStorage.getItem('authToken');
    if (!authToken) return navigateTo('/login');
  });

