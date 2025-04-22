// plugins/stripe.client.ts
import { loadStripe } from '@stripe/stripe-js';

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig();
  // Carga la clave pública desde runtimeConfig.public
  const stripe = await loadStripe(config.public.stripePublicKey);
  nuxtApp.provide('stripe', stripe);
});