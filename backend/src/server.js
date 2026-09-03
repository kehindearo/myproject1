import http from "http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { getRedis } from "./config/redis.js";
import { initSockets } from "./sockets/index.js";

async function main() {
  try {
    await connectDB();
  } catch (err) {
    console.error("[startup] MongoDB connection failed — API will run but data operations will error:", err.message);
  }
  getRedis(); // best-effort connect; individual calls degrade gracefully if unavailable

  const app = createApp();
  const server = http.createServer(app);
  const io = initSockets(server);
  app.set("io", io);

  server.listen(env.port, () => {
    console.log(`Collabo Travel API listening on port ${env.port} (${env.nodeEnv})`);
  });

  process.on("unhandledRejection", (err) => {
    console.error("[unhandledRejection]", err);
  });
}

main();
