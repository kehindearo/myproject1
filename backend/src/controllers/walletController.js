import crypto from "crypto";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import { initializePayment, verifyPayment, disburseEarnings } from "../services/payments/gateway.js";

export const getWallet = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.json({ success: true, balanceKobo: req.user.walletBalanceKobo, transactions });
});

export const initiateTopUp = asyncHandler(async (req, res) => {
  const { amountKobo, method } = req.body;
  if (!amountKobo || amountKobo <= 0) throw new ApiError(400, "Enter a valid amount");

  const reference = `topup_${crypto.randomUUID()}`;
  const payment = await initializePayment({
    amountMinorUnits: amountKobo,
    currency: req.user.currency,
    reference,
    customerEmail: req.user.email,
    customerName: req.user.fullName,
    redirectUrl: `${req.headers.origin || ""}/rider/wallet`,
  });

  await Transaction.create({
    user: req.user._id,
    type: "credit",
    amountKobo,
    description: `Wallet top-up via ${method || "card"}`,
    reference,
    status: "pending",
  });

  res.json({ success: true, payment, reference });
});

export const confirmTopUp = asyncHandler(async (req, res) => {
  const { reference, provider } = req.body;
  const tx = await Transaction.findOne({ reference, user: req.user._id });
  if (!tx) throw new ApiError(404, "Transaction not found");
  if (tx.status === "success") return res.json({ success: true, alreadyConfirmed: true });

  const result = await verifyPayment(reference, provider);
  if (!result.paid) throw new ApiError(400, "Payment not confirmed yet");

  tx.status = "success";
  await tx.save();

  req.user.walletBalanceKobo += tx.amountKobo;
  await req.user.save();

  res.json({ success: true, balanceKobo: req.user.walletBalanceKobo });
});

export const withdraw = asyncHandler(async (req, res) => {
  const { amountKobo, bankCode, accountNumber } = req.body;
  if (!amountKobo || amountKobo > req.user.walletBalanceKobo) {
    throw new ApiError(400, "Insufficient balance");
  }

  const reference = `wd_${crypto.randomUUID()}`;
  await disburseEarnings({ amountKobo, bankCode, accountNumber, reference, narration: "Collabo Travel withdrawal" });

  req.user.walletBalanceKobo -= amountKobo;
  await req.user.save();

  await Transaction.create({
    user: req.user._id,
    type: "withdrawal",
    amountKobo,
    description: "Withdrawal to bank account",
    reference,
  });

  res.json({ success: true, balanceKobo: req.user.walletBalanceKobo });
});

export const applyReferral = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const referrer = await User.findOne({ referralCode: code });
  if (!referrer || String(referrer._id) === String(req.user._id)) {
    throw new ApiError(400, "Invalid referral code");
  }
  // Bonus is credited to both parties by a completed-trip hook elsewhere;
  // this just links the relationship if not already set.
  if (!req.user.referredBy) {
    req.user.referredBy = referrer._id;
    await req.user.save();
  }
  res.json({ success: true });
});
