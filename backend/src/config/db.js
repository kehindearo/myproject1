import mongoose from "mongoose";
import { env } from "./env.js";

let connected = false;

export async function connectDB() {
  if (connected) return;
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 4000 });
  connected = true;
  console.log(`[mongo] connected → ${mongoose.connection.name}`);

  mongoose.connection.on("error", (err) => {
    console.error("[mongo] connection error:", err.message);
  });
  mongoose.connection.on("disconnected", () => {
    connected = false;
    console.warn("[mongo] disconnected");
  });
}
