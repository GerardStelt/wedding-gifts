import { type RequestHandler } from '@builder.io/qwik-city';
import Stripe from 'stripe';

export const onPost: RequestHandler = async ({ request, env, redirect, url }) => {
  const stripe = new Stripe(env.get('STRIPE_SECRET_ACCESS_KEY')!);
  const formData = await request.formData();

  let stripeUrl: string | null = null;

  try {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'brl',
          product_data: { name: 'Cadeau voor Brazilië' },
          unit_amount: 5000,
        },
        quantity: 1,
      }],
      mode: 'payment',
      // Voor Pix is het handig om de vervaltijd in te stellen (in minuten)
      payment_method_options: {
        pix: {
          expires_after_seconds: 3600, // De QR-code is 1 uur geldig
        },
      },
      success_url: `${url.origin}/admin?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${url.origin}/cancel`,
    });

    stripeUrl = session.url;
  } catch (err: any) {
    console.error('Stripe Error:', err.message);
    // Hier stuur je ze alleen naar een error pagina als het ECHT misgaat
    throw redirect(302, '/?error=stripe_failed');
  }

  // Belangrijk: De redirect moet BUITEN de try-catch staan
  if (stripeUrl) {
    throw redirect(303, stripeUrl);
  }
};