// nuxt.config.ts
export default defineNuxtConfig({
  css: ['~/assets/css/tailwind.css'],
  
  runtimeConfig: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    public: {
      API_BASE_URL: process.env.API_BASE_URL || 'https://proyecto-final.duckdns.org/api',
      //API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8000/api',
      stripePublicKey: process.env.NUXT_PUBLIC_STRIPE_PUBLIC_KEY
    }
  },
  compatibilityDate: '2025-04-01',
  plugins: ['~/plugins/pinia.js'],
  
  // Configuración simplificada
  modules: ['@nuxt/icon'],
  
  // Añadir PostCSS manualmente
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});