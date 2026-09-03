import axios from "axios";
import { env } from "../../config/env.js";

const client = () =>
  axios.create({
    baseURL: "https://api.paystack.co",
    headers: { Authorization: `Bearer ${env.paystack.secretKey}` },
  });

/** Backup payment initializer used automatically when Monnify is unreachable. */
export async function initializeTransaction({ amountKobo, reference, customerEmail }) {
  if (!env.paystack.secretKey) {
    return { simulated: true, authorizationUrl: null, reference };
  }
  const { data } = await client().post("/transaction/initialize", {
    amount: amountKobo,
    email: customerEmail,
    reference,
  });
  return { authorizationUrl: data.data.authorization_url, reference };
}

export async function verifyTransaction(reference) {
  if (!env.paystack.secretKey) {
    return { simulated: true, paid: true, reference };
  }
  const { data } = await client().get(`/transaction/verify/${reference}`);
  return { paid: data.data.status === "success", raw: data.data };
}

export async function resolveAccountNumber(accountNumber, bankCode) {
  if (!env.paystack.secretKey) {
    return { simulated: true, accountName: "Verified Account Holder" };
  }
  const { data } = await client().get(`/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`);
  return { accountName: data.data.account_name };
}
