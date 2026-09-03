import nodemailer from "nodemailer";
import { env } from "../../config/env.js";

let transporter = null;

function getTransporter() {
  if (!env.smtp.host) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: { user: env.smtp.user, pass: env.smtp.pass },
    });
  }
  return transporter;
}

/** Sends transactional email via SMTP if configured; otherwise logs (dev). */
export async function sendMail({ to, subject, html }) {
  const t = getTransporter();
  if (!t) {
    console.log(`[mailer:dev] → ${to} | ${subject}\n${html}`);
    return { simulated: true };
  }
  return t.sendMail({ from: env.smtp.from, to, subject, html });
}
