import * as monnify from "./monnify.js";
import * as paystack from "./paystack.js";
import * as stripeProvider from "./stripe.js";

/**
 * Single entry point the rest of the app calls for payments. Nigerian-currency
 * transactions try Monnify first (primary) and fall back to Paystack; any
 * other currency routes to Stripe, keeping the app "global-ready" per the
 * multi-currency architecture goal without branching provider logic at each
 * call site.
 */
export async function initializePayment({ amountMinorUnits, currency = "NGN", reference, customerEmail, customerName, redirectUrl }) {
  if (currency !== "NGN") {
    return stripeProvider.createCheckoutSession({
      amountMinorUnits,
      currency,
      customerEmail,
      successUrl: redirectUrl,
      cancelUrl: redirectUrl,
    });
  }

  try {
    const result = await monnify.initializeTransaction({
      amountKobo: amountMinorUnits,
      reference,
      customerEmail,
      customerName,
      redirectUrl,
    });
    return { provider: "monnify", ...result };
  } catch (err) {
    console.warn("[payments] Monnify unavailable, falling back to Paystack:", err.message);
    const result = await paystack.initializeTransaction({ amountKobo: amountMinorUnits, reference, customerEmail });
    return { provider: "paystack", ...result };
  }
}

export async function verifyPayment(reference, provider = "monnify") {
  if (provider === "paystack") return paystack.verifyTransaction(reference);
  return monnify.verifyTransaction(reference);
}

export async function disburseEarnings(payload) {
  return monnify.disburseToBank(payload);
}
