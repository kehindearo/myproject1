import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";
import { sanitizeInput } from "./middleware/sanitize.js";
import { apiLimiter } from "./middleware/rateLimiters.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.routes.js";
import tripRoutes from "./routes/trip.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import walletRoutes from "./routes/wallet.routes.js";
import driverRoutes from "./routes/driver.routes.js";
import safetyRoutes from "./routes/safety.routes.js";
import ratingRoutes from "./routes/rating.routes.js";
import adminRoutes from "./routes/admin.routes.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.clientUrl, credentials: true }));
  app.use(compression());
  app.use(express.json({ limit: "2mb" }));
  app.use(cookieParser());
  app.use(sanitizeInput);
  if (env.nodeEnv !== "test") app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
  app.use("/api/v1", apiLimiter);

  app.get("/api/v1/health", (_req, res) => res.json({ success: true, status: "ok", time: new Date().toISOString() }));

  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/trips", tripRoutes);
  app.use("/api/v1/bookings", bookingRoutes);
  app.use("/api/v1/wallet", walletRoutes);
  app.use("/api/v1/driver", driverRoutes);
  app.use("/api/v1/safety", safetyRoutes);
  app.use("/api/v1/ratings", ratingRoutes);
  app.use("/api/v1/admin", adminRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
