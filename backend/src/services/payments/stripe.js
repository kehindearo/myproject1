import { env } from "../../config/env.js";

let stripeClient = null;

async function getClient() {
  if (!env.stripe.secretKey) return null;
  if (!stripeClient) {
    const { default: Stripe } = await import("stripe");
    stripeClient = new Stripe(env.stripe.secretKey);
  }
  return stripeClient;
}

/**
 * Global-market payment path (used outside Nigeria once a country's
 * currency/config routes here instead of Monnify/Paystack).
 */
export async function createCheckoutSession({ amountMinorUnits, currency, customerEmail, successUrl, cancelUrl }) {
  const stripe = await getClient();
  if (!stripe) {
    return { simulated: true, url: null };
  }
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: customerEmail,
    line_items: [
      {
        price_data: {
          currency,
          product_data: { name: "Collabo Travel ride" },
          unit_amount: amountMinorUnits,
        },
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
  return { url: session.url };
}
