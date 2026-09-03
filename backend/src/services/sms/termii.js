import axios from "axios";
import { env } from "../../config/env.js";

/**
 * Sends an SMS via Termii when TERMII_API_KEY is configured. Falls back to
 * a console log so safety-critical flows (SOS, trip reminders) never throw
 * in environments without live credentials.
 */
export async function sendSms({ to, message }) {
  if (!env.termii.apiKey) {
    console.log(`[sms:dev] → ${to} | ${message}`);
    return { simulated: true };
  }
  const { data } = await axios.post("https://api.ng.termii.com/api/sms/send", {
    to,
    from: env.termii.senderId,
    sms: message,
    type: "plain",
    channel: "generic",
    api_key: env.termii.apiKey,
  });
  return data;
}
