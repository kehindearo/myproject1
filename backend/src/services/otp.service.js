import crypto from "crypto";
import { getRedis } from "../config/redis.js";
import { sendMail } from "./notifications/mailer.js";

const OTP_TTL_SECONDS = 300;
const memoryStore = new Map(); // fallback when Redis is unavailable (dev only)

function otpKey(email) {
  return `otp:${email.toLowerCase()}`;
}

export async function generateAndSendOtp(email) {
  const code = crypto.randomInt(100000, 999999).toString();
  const redis = getRedis();
  try {
    await redis.set(otpKey(email), code, "EX", OTP_TTL_SECONDS);
  } catch {
    memoryStore.set(otpKey(email), { code, expiresAt: Date.now() + OTP_TTL_SECONDS * 1000 });
  }

  await sendMail({
    to: email,
    subject: "Your Collabo Travel verification code",
    html: `<p>Your verification code is <b style="font-size:20px;letter-spacing:4px">${code}</b>. It expires in 5 minutes.</p>`,
  });

  return true;
}

export async function verifyOtp(email, code) {
  const redis = getRedis();
  let stored;
  try {
    stored = await redis.get(otpKey(email));
  } catch {
    const entry = memoryStore.get(otpKey(email));
    stored = entry && entry.expiresAt > Date.now() ? entry.code : null;
  }
  if (!stored || stored !== code) return false;

  try {
    await redis.del(otpKey(email));
  } catch {
    memoryStore.delete(otpKey(email));
  }
  return true;
}
