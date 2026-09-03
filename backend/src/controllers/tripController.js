import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import Trip from "../models/Trip.js";
import { applySurge } from "../services/pricing.service.js";
import { getRedis } from "../config/redis.js";

const MAX_PRICE_KOBO = 5_000_000; // ₦50,000

export const createTrip = asyncHandler(async (req, res) => {
  const { origin, destination, departureAt, pricePerSeatKobo, tier, seatsTotal, recurring, notes, estimatedDurationMins } = req.body;

  if (!origin?.state || !destination?.state || !departureAt || !pricePerSeatKobo || !seatsTotal) {
    throw new ApiError(400, "Missing required trip fields");
  }
  if (pricePerSeatKobo > MAX_PRICE_KOBO) {
    throw new ApiError(400, "Price per seat cannot exceed ₦50,000");
  }

  const { fareKobo, surgeApplied } = applySurge(pricePerSeatKobo, new Date(departureAt));

  const trip = await Trip.create({
    driver: req.user._id,
    origin,
    destination,
    departureAt,
    estimatedDurationMins,
    pricePerSeatKobo: fareKobo,
    tier,
    seatsTotal,
    seatsAvailable: seatsTotal,
    recurring,
    notes,
    surgeApplied,
  });

  // Invalidate cached trip-search pages so new listings appear immediately.
  try {
    const redis = getRedis();
    const keys = await redis.keys("trips:search:*");
    if (keys.length) await redis.del(keys);
  } catch {
    /* cache best-effort */
  }

  res.status(201).json({ success: true, trip });
});

export const listTrips = asyncHandler(async (req, res) => {
  const { fromState, toState, date, sort = "date", page = 1, limit = 10 } = req.query;
  const cacheKey = `trips:search:${fromState || ""}:${toState || ""}:${date || ""}:${sort}:${page}`;

  const redis = getRedis();
  try {
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));
  } catch {
    /* cache miss on redis-unavailable */
  }

  const query = { status: "scheduled", seatsAvailable: { $gt: 0 } };
  if (fromState) query["origin.state"] = fromState;
  if (toState) query["destination.state"] = toState;
  if (date) {
    const day = new Date(date);
    const nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    query.departureAt = { $gte: day, $lt: nextDay };
  }

  const sortMap = {
    date: { departureAt: 1 },
    price_asc: { pricePerSeatKobo: 1 },
    seats: { seatsAvailable: -1 },
  };

  const trips = await Trip.find(query)
    .sort(sortMap[sort] || sortMap.date)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .populate("driver", "fullName avatarUrl")
    .lean();

  const payload = { success: true, trips, page: Number(page) };
  try {
    await redis.set(cacheKey, JSON.stringify(payload), "EX", 30);
  } catch {
    /* best-effort cache */
  }

  res.json(payload);
});

export const getTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id).populate("driver", "fullName avatarUrl phone");
  if (!trip) throw new ApiError(404, "Trip not found");
  res.json({ success: true, trip });
});

export const myPostedTrips = asyncHandler(async (req, res) => {
  const trips = await Trip.find({ driver: req.user._id }).sort({ departureAt: -1 });
  res.json({ success: true, trips });
});

export const startTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, driver: req.user._id });
  if (!trip) throw new ApiError(404, "Trip not found");
  trip.status = "active";
  await trip.save();
  req.app.get("io")?.to(`trip:${trip._id}`).emit("trip:status", { tripId: trip._id, status: "active" });
  res.json({ success: true, trip });
});

export const endTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, driver: req.user._id });
  if (!trip) throw new ApiError(404, "Trip not found");
  trip.status = "completed";
  await trip.save();
  req.app.get("io")?.to(`trip:${trip._id}`).emit("trip:status", { tripId: trip._id, status: "completed" });
  res.json({ success: true, trip });
});
