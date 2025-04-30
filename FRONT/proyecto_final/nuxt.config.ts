export default defineNuxtConfig({
  css: [
    './assets/scss/global.scss' // Ruta relativa al directorio raíz
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @use "./assets/scss/_variables.scss" as *;
          @use "./assets/scss/_mixins.scss" as *;`
        }
      }
    }
  },
  
  runtimeConfig: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY, // Disponible solo en el servidor
    public: {
      API_BASE_URL: process.env.API_BASE_URL || 'https://proyecto-final.duckdns.org/api',
      //API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8000/api',
      stripePublicKey: process.env.NUXT_PUBLIC_STRIPE_PUBLIC_KEY // Disponible en el cliente
    }
  },
  compatibilityDate: '2025-04-01',
  plugins: ['~/plugins/pinia.js']
});