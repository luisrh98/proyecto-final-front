// server/api/create-checkout-session.post.js
import Stripe from 'stripe';

// Asegúrate de que STRIPE_SECRET_KEY esté definido en tus variables de entorno
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15' // O la versión que estés utilizando
});

export default defineEventHandler(async (event) => {
  // Puedes obtener la data enviada desde el cliente (por ejemplo, información de los productos)
  const body = await useBody(event);
  
  try {
    // Crea una sesión de checkout. Ajusta line_items según tus necesidades.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          // Ejemplo: producto fijo, en producción probablemente construyas esto dinámicamente
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Producto de Prueba',
            },
            unit_amount: 1000, // Precio en centavos (por ejemplo, $10)
          },
          quantity: 1,
        },
      ],
      // URLs de éxito o cancelación (asegúrate de configurar las variables de entorno o rutas según sea necesario)
      success_url: process.env.PUBLIC_URL + '/success',
      cancel_url: process.env.PUBLIC_URL + '/cancel',
    });
    
    return { sessionId: session.id };
  } catch (error) {
    console.error('Error creando la sesión de checkout:', error);
    return { error: error.message };
  }
});
