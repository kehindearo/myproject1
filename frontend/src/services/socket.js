import { io } from "socket.io-client";

let socket = null;

/**
 * Lazily creates a shared Socket.io connection authenticated with the same
 * JWT issued by /auth/login. In local/demo mode (no live backend, or a
 * simulated `mock.*` token from AuthContext's fallback) the connection
 * simply fails to authenticate — callers should treat "not connected" as a
 * normal state and degrade to an offline-friendly UI, not an error.
 */
export function getSocket() {
  if (socket) return socket;
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";
  const origin = apiUrl.replace(/\/api\/v1\/?$/, "");
  socket = io(origin, {
    auth: { token: localStorage.getItem("collabo-token") },
    reconnectionAttempts: 2,
    timeout: 4000,
    autoConnect: true,
  });
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
