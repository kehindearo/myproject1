import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import DriverProfile from "../models/DriverProfile.js";
import Transaction from "../models/Transaction.js";
import { splitCommission } from "../services/pricing.service.js";

export const submitOnboarding = asyncHandler(async (req, res) => {
  const { vehicle, documents, bankDetails } = req.body;
  if (!vehicle?.plate || !bankDetails?.accountNumber) {
    throw new ApiError(400, "Missing required onboarding fields");
  }

  req.user.role = "driver";
  await req.user.save();

  const profile = await DriverProfile.findOneAndUpdate(
    { user: req.user._id },
    { user: req.user._id, vehicle, documents, bankDetails, approvalStatus: "pending" },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(201).json({ success: true, profile });
});

export const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await DriverProfile.findOne({ user: req.user._id });
  if (!profile) throw new ApiError(404, "Driver profile not found");
  res.json({ success: true, profile });
});

export const setOnlineStatus = asyncHandler(async (req, res) => {
  const { online, lng, lat } = req.body;
  const profile = await DriverProfile.findOneAndUpdate(
    { user: req.user._id },
    {
      online,
      ...(lng != null && lat != null ? { currentLocation: { type: "Point", coordinates: [lng, lat] } } : {}),
    },
    { new: true }
  );
  if (!profile) throw new ApiError(404, "Driver profile not found");
  res.json({ success: true, profile });
});

export const updateLocation = asyncHandler(async (req, res) => {
  const { lng, lat } = req.body;
  await DriverProfile.updateOne(
    { user: req.user._id },
    { currentLocation: { type: "Point", coordinates: [lng, lat] } }
  );
  req.app.get("io")?.emit(`driver:${req.user._id}:location`, { lng, lat });
  res.json({ success: true });
});

export const getEarnings = asyncHandler(async (req, res) => {
  const { range = "week" } = req.query;
  const since = new Date();
  if (range === "today") since.setHours(0, 0, 0, 0);
  else if (range === "month") since.setDate(since.getDate() - 30);
  else since.setDate(since.getDate() - 7);

  const credits = await Transaction.find({
    user: req.user._id,
    type: "credit",
    description: /trip earnings/i,
    createdAt: { $gte: since },
  }).sort({ createdAt: -1 });

  const totalKobo = credits.reduce((sum, tx) => sum + tx.amountKobo, 0);
  res.json({ success: true, totalKobo, transactions: credits, commissionRate: 0.1 });
});

/** Called when a trip ends: splits fare 90/10 and credits driver's wallet. */
export async function payoutDriverForTrip(driverUser, fareKobo, tripId) {
  const { commissionKobo, driverPayoutKobo } = splitCommission(fareKobo);
  driverUser.walletBalanceKobo += driverPayoutKobo;
  await driverUser.save();
  await Transaction.create({
    user: driverUser._id,
    type: "credit",
    amountKobo: driverPayoutKobo,
    description: `Trip earnings (trip ${tripId})`,
    reference: `earn_${tripId}`,
    meta: { commissionKobo },
  });
  return { commissionKobo, driverPayoutKobo };
}
