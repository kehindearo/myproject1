import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";
import DriverProfile from "../models/DriverProfile.js";
import Trip from "../models/Trip.js";
import Booking from "../models/Booking.js";
import Transaction from "../models/Transaction.js";
import Report from "../models/Report.js";
import PromoCode from "../models/PromoCode.js";
import { sendMail } from "../services/notifications/mailer.js";

export const getStats = asyncHandler(async (_req, res) => {
  const [totalRiders, totalDrivers, activeTripsNow, revenueAgg, todayRevenueAgg] = await Promise.all([
    User.countDocuments({ role: "rider" }),
    User.countDocuments({ role: "driver" }),
    Trip.countDocuments({ status: "active" }),
    Booking.aggregate([{ $match: { paymentStatus: "paid" } }, { $group: { _id: null, total: { $sum: "$amountKobo" } } }]),
    Booking.aggregate([
      { $match: { paymentStatus: "paid", createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } } },
      { $group: { _id: null, total: { $sum: "$amountKobo" } } },
    ]),
  ]);

  res.json({
    success: true,
    stats: {
      totalRiders,
      totalDrivers,
      activeTripsNow,
      totalRevenueKobo: revenueAgg[0]?.total || 0,
      todayRevenueKobo: todayRevenueAgg[0]?.total || 0,
    },
  });
});

export const pendingDrivers = asyncHandler(async (_req, res) => {
  const drivers = await DriverProfile.find({ approvalStatus: "pending" }).populate("user", "fullName email avatarUrl");
  res.json({ success: true, drivers });
});

export const reviewDriver = asyncHandler(async (req, res) => {
  const { action, reason } = req.body; // "approve" | "reject"
  const profile = await DriverProfile.findById(req.params.id).populate("user");
  if (!profile) throw new ApiError(404, "Driver application not found");

  profile.approvalStatus = action === "approve" ? "approved" : "rejected";
  profile.rejectionReason = action === "reject" ? reason : undefined;
  await profile.save();

  await sendMail({
    to: profile.user.email,
    subject: `Collabo Travel driver application ${profile.approvalStatus}`,
    html:
      action === "approve"
        ? `<p>Congratulations ${profile.user.fullName}, you're approved to drive on Collabo Travel! 🎉</p>`
        : `<p>Your application was not approved. Reason: ${reason || "Not specified"}</p>`,
  });

  res.json({ success: true, profile });
});

export const allTrips = asyncHandler(async (req, res) => {
  const { status, state, date } = req.query;
  const query = {};
  if (status) query.status = status;
  if (state) query.$or = [{ "origin.state": state }, { "destination.state": state }];
  if (date) {
    const day = new Date(date);
    const nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    query.departureAt = { $gte: day, $lt: nextDay };
  }
  const trips = await Trip.find(query).populate("driver", "fullName").sort({ departureAt: -1 }).limit(200);
  res.json({ success: true, trips });
});

export const allUsers = asyncHandler(async (req, res) => {
  const { search, role } = req.query;
  const query = {};
  if (role) query.role = role;
  if (search) {
    query.$or = [
      { fullName: new RegExp(search, "i") },
      { email: new RegExp(search, "i") },
    ];
  }
  const users = await User.find(query).limit(200);
  res.json({ success: true, users });
});

export const suspendUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isSuspended: req.body.suspended !== false }, { new: true });
  if (!user) throw new ApiError(404, "User not found");
  res.json({ success: true, user });
});

export const listReports = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = status ? { status } : {};
  const reports = await Report.find(query).populate("reporter", "fullName").sort({ createdAt: -1 });
  res.json({ success: true, reports });
});

export const updateReportStatus = asyncHandler(async (req, res) => {
  const report = await Report.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!report) throw new ApiError(404, "Report not found");
  res.json({ success: true, report });
});

export const createPromoCode = asyncHandler(async (req, res) => {
  const promo = await PromoCode.create(req.body);
  res.status(201).json({ success: true, promo });
});

export const listPromoCodes = asyncHandler(async (_req, res) => {
  const promos = await PromoCode.find().sort({ createdAt: -1 });
  res.json({ success: true, promos });
});

export const togglePromoCode = asyncHandler(async (req, res) => {
  const promo = await PromoCode.findById(req.params.id);
  if (!promo) throw new ApiError(404, "Promo code not found");
  promo.active = !promo.active;
  await promo.save();
  res.json({ success: true, promo });
});

export const broadcastNotification = asyncHandler(async (req, res) => {
  const { audience, message } = req.body; // audience: "riders" | "drivers" | "all"
  const query = audience === "all" ? {} : { role: audience === "riders" ? "rider" : "driver" };
  const recipients = await User.find(query).select("email");
  // Fan-out via Firebase Cloud Messaging in production; email used here as
  // the always-available channel for the admin broadcast demo path.
  await Promise.allSettled(
    recipients.map((r) => sendMail({ to: r.email, subject: "Collabo Travel announcement", html: `<p>${message}</p>` }))
  );
  res.json({ success: true, sentTo: recipients.length });
});
