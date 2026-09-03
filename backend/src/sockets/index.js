import { Server } from "socket.io";
import { verifyToken } from "../utils/token.js";
import { env } from "../config/env.js";

/**
 * Real-time layer: one Socket.io room per trip ("trip:<id>") for isolated
 * GPS/status/chat broadcasts, a per-driver room for negotiation offers, and
 * an admin room for SOS/report fan-out. Auth happens once at handshake via
 * the same JWT issued by /auth/login, so every emitted event is scoped to
 * an authenticated user.
 */
export function initSockets(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: env.clientUrl, credentials: true },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Unauthorized"));
      const payload = verifyToken(token);
      socket.userId = payload.sub;
      socket.role = payload.role;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    if (socket.role === "driver") socket.join(`driver:${socket.userId}`);
    if (socket.role === "admin") socket.join("admin:room");

    socket.on("trip:join", (tripId) => socket.join(`trip:${tripId}`));
    socket.on("trip:leave", (tripId) => socket.leave(`trip:${tripId}`));

    socket.on("driver:location", ({ tripId, lat, lng, heading }) => {
      socket.to(`trip:${tripId}`).emit("driver:location", { lat, lng, heading, at: Date.now() });
    });

    socket.on("chat:message", ({ tripId, text }) => {
      io.to(`trip:${tripId}`).emit("chat:message", {
        from: socket.userId,
        text,
        at: Date.now(),
      });
    });

    socket.on("negotiation:respond", ({ riderId, tripId, action, counterKobo }) => {
      io.to(`user:${riderId}`).emit("negotiation:response", { tripId, action, counterKobo });
    });

    socket.on("disconnect", () => {
      // Presence cleanup hook — e.g. flip DriverProfile.online off after a
      // grace period if no reconnect arrives, handled by a scheduled sweep.
    });
  });

  return io;
}
