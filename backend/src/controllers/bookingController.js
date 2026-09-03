import crypto from "crypto";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import Trip from "../models/Trip.js";
import Booking from "../models/Booking.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import { computeCancellationFee } from "../services/pricing.service.js";
import { initializePayment } from "../services/payments/gateway.js";

export const createBooking = asyncHandler(async (req, res) => {
  const { tripId, seats = 1, paymentMethod = "wallet", negotiatedPriceKobo } = req.body;

  const trip = await Trip.findById(tripId);
  if (!trip || trip.status !== "scheduled") throw new ApiError(404, "Trip not available");
  if (trip.seatsAvailable < seats) throw new ApiError(400, "Not enough seats available");

  const pricePerSeat = negotiatedPriceKobo || trip.pricePerSeatKobo;
  const amountKobo = pricePerSeat * seats;

  const booking = await Booking.create({
    trip: trip._id,
    rider: req.user._id,
    seats,
    amountKobo,
    negotiatedPriceKobo,
    paymentMethod,
  });

  if (paymentMethod === "wallet") {
    if (req.user.walletBalanceKobo < amountKobo) throw new ApiError(400, "Insufficient wallet balance");
    req.user.walletBalanceKobo -= amountKobo;
    await req.user.save();
    booking.paymentStatus = "paid";
    booking.status = "accepted";
    await booking.save();

    trip.seatsAvailable -= seats;
    await trip.save();

    await Transaction.create({
      user: req.user._id,
      type: "debit",
      amountKobo,
      description: `Trip booking: ${trip.origin.state} → ${trip.destination.state}`,
      reference: `bk_${booking._id}`,
    });

    req.app.get("io")?.to(`trip:${trip._id}`).emit("booking:new", { bookingId: booking._id, driverId: trip.driver });
    return res.status(201).json({ success: true, booking });
  }

  const reference = `collabo_${crypto.randomUUID()}`;
  const payment = await initializePayment({
    amountMinorUnits: amountKobo,
    currency: req.user.currency,
    reference,
    customerEmail: req.user.email,
    customerName: req.user.fullName,
    redirectUrl: `${req.headers.origin || ""}/rider/trip/${trip._id}`,
  });

  booking.paymentReference = reference;
  await booking.save();

  res.status(201).json({ success: true, booking, payment });
});

export const myBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ rider: req.user._id })
    .populate({ path: "trip", populate: { path: "driver", select: "fullName avatarUrl" } })
    .sort({ createdAt: -1 });
  res.json({ success: true, bookings });
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, rider: req.user._id }).populate("trip");
  if (!booking) throw new ApiError(404, "Booking not found");

  const feeKobo = computeCancellationFee(booking.trip.departureAt);
  booking.status = "cancelled";
  booking.cancellationFeeKobo = feeKobo;
  await booking.save();

  booking.trip.seatsAvailable += booking.seats;
  await booking.trip.save();

  if (booking.paymentStatus === "paid") {
    const refundKobo = booking.amountKobo - feeKobo;
    const rider = await User.findById(req.user._id);
    rider.walletBalanceKobo += refundKobo;
    await rider.save();
    await Transaction.create({
      user: rider._id,
      type: "credit",
      amountKobo: refundKobo,
      description: "Trip cancellation refund",
      reference: `refund_${booking._id}`,
    });
  }

  res.json({ success: true, booking, cancellationFeeKobo: feeKobo });
});

export const respondToBooking = asyncHandler(async (req, res) => {
  const { action } = req.body; // "accept" | "reject"
  const booking = await Booking.findById(req.params.id).populate("trip");
  if (!booking) throw new ApiError(404, "Booking not found");
  if (String(booking.trip.driver) !== String(req.user._id)) throw new ApiError(403, "Not your trip");

  booking.status = action === "accept" ? "accepted" : "rejected";
  await booking.save();

  req.app.get("io")?.to(`trip:${booking.trip._id}`).emit("booking:status", { bookingId: booking._id, status: booking.status });
  res.json({ success: true, booking });
});

export const negotiateFare = asyncHandler(async (req, res) => {
  const { tripId, offerKobo } = req.body;
  const trip = await Trip.findById(tripId);
  if (!trip) throw new ApiError(404, "Trip not found");

  // Real-time negotiation is brokered over Socket.io ("negotiation:offer" /
  // "negotiation:response" events, see sockets/index.js) so the driver gets
  // an instant prompt; this endpoint just persists the opening offer.
  req.app.get("io")?.to(`driver:${trip.driver}`).emit("negotiation:offer", {
    tripId,
    riderId: req.user._id,
    riderName: req.user.fullName,
    offerKobo,
    listedPriceKobo: trip.pricePerSeatKobo,
  });

  res.json({ success: true, message: "Offer sent to driver" });
});
