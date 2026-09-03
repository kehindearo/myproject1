import { env } from "../../config/env.js";

let app = null;

async function getApp() {
  if (!env.firebase.projectId) return null;
  if (app) return app;
  const { initializeApp, cert } = await import("firebase-admin/app");
  app = initializeApp({
    credential: cert({
      projectId: env.firebase.projectId,
      clientEmail: env.firebase.clientEmail,
      privateKey: env.firebase.privateKey,
    }),
  });
  return app;
}

/**
 * Sends a push notification via Firebase Cloud Messaging when credentials
 * are configured; otherwise logs the payload so the calling flow (booking
 * confirmations, trip status, earnings, approvals) still completes in dev.
 */
export async function sendPush({ token, title, body, data = {} }) {
  const firebaseApp = await getApp();
  if (!firebaseApp) {
    console.log(`[push:dev] → ${token || "broadcast"} | ${title}: ${body}`);
    return { simulated: true };
  }
  const { getMessaging } = await import("firebase-admin/messaging");
  return getMessaging(firebaseApp).send({
    token,
    notification: { title, body },
    data,
  });
}
