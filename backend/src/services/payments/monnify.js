import axios from "axios";
import { env } from "../../config/env.js";

let cachedToken = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;
  const basicAuth = Buffer.from(`${env.monnify.apiKey}:${env.monnify.secretKey}`).toString("base64");
  const { data } = await axios.post(
    `${env.monnify.baseUrl}/api/v1/auth/login`,
    {},
    { headers: { Authorization: `Basic ${basicAuth}` } }
  );
  cachedToken = data.responseBody.accessToken;
  tokenExpiresAt = Date.now() + 50 * 60 * 1000;
  return cachedToken;
}

/** Initializes a Monnify hosted-checkout transaction for wallet top-ups / bookings. */
export async function initializeTransaction({ amountKobo, reference, customerEmail, customerName, redirectUrl }) {
  if (!env.monnify.apiKey) {
    return { simulated: true, checkoutUrl: null, reference };
  }
  const token = await getAccessToken();
  const { data } = await axios.post(
    `${env.monnify.baseUrl}/api/v1/merchant/transactions/init-transaction`,
    {
      amount: amountKobo / 100,
      customerName,
      customerEmail,
      paymentReference: reference,
      paymentDescription: "Collabo Travel payment",
      currencyCode: "NGN",
      contractCode: env.monnify.contractCode,
      redirectUrl,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return { checkoutUrl: data.responseBody.checkoutUrl, reference };
}

export async function verifyTransaction(reference) {
  if (!env.monnify.apiKey) {
    return { simulated: true, paid: true, reference };
  }
  const token = await getAccessToken();
  const { data } = await axios.get(
    `${env.monnify.baseUrl}/api/v2/transactions/${reference}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return { paid: data.responseBody.paymentStatus === "PAID", raw: data.responseBody };
}

/** Instant bank transfer payout — used for driver earnings withdrawals. */
export async function disburseToBank({ amountKobo, bankCode, accountNumber, reference, narration }) {
  if (!env.monnify.apiKey) {
    return { simulated: true, reference };
  }
  const token = await getAccessToken();
  const { data } = await axios.post(
    `${env.monnify.baseUrl}/api/v2/disbursements/single`,
    {
      amount: amountKobo / 100,
      reference,
      narration,
      destinationBankCode: bankCode,
      destinationAccountNumber: accountNumber,
      currency: "NGN",
      sourceAccountNumber: env.monnify.contractCode,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data.responseBody;
}
