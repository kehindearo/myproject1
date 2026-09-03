import Redis from "ioredis";
import { env } from "./env.js";

let client = null;

/**
 * Lazily creates a shared Redis client. In local/dev environments without
 * Redis running, callers should treat cache/OTP operations as best-effort —
 * this client retries quietly rather than crashing the API process.
 */
export function getRedis() {
  if (client) return client;
  client = new Redis(env.redisUrl, {
    maxRetriesPerRequest: 2,
    retryStrategy: (times) => Math.min(times * 200, 2000),
    lazyConnect: false,
  });
  client.on("error", (err) => {
    console.warn("[redis] connection issue:", err.message);
  });
  return client;
}
