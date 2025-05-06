export default defineNuxtConfig({
  css: ['./assets/css/tailwind.css'],
  
  runtimeConfig: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY, // Disponible solo en el servidor
    public: {
      API_BASE_URL: process.env.API_BASE_URL || 'https://proyecto-final.duckdns.org/api',
      //API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8000/api',
      stripePublicKey: process.env.NUXT_PUBLIC_STRIPE_PUBLIC_KEY // Disponible en el cliente
    }
  },
  compatibilityDate: '2025-04-01',
  plugins: ['~/plugins/pinia.js'],
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon'],
            
  
});