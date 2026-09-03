import crypto from "crypto";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { signToken } from "../utils/token.js";
import { generateAndSendOtp, verifyOtp as verifyOtpCode } from "../services/otp.service.js";
import User from "../models/User.js";

function makeReferralCode(name) {
  const prefix = name.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase() || "COL";
  return `${prefix}${crypto.randomInt(1000, 9999)}`;
}

export const requestOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) throw new ApiError(400, "A valid email is required");
  await generateAndSendOtp(email);
  res.json({ success: true, message: "Verification code sent" });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, code } = req.body;
  const ok = await verifyOtpCode(email, code);
  if (!ok) throw new ApiError(400, "Incorrect or expired code");
  res.json({ success: true });
});

export const signup = asyncHandler(async (req, res) => {
  const { email, fullName, phone, password, referralCode } = req.body;
  if (!email || !fullName || !password) throw new ApiError(400, "Missing required fields");

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ApiError(409, "An account with this email already exists");

  let referredBy = null;
  if (referralCode) {
    const referrer = await User.findOne({ referralCode });
    if (referrer) referredBy = referrer._id;
  }

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({
    email: email.toLowerCase(),
    fullName,
    phone,
    passwordHash,
    referredBy,
    referralCode: makeReferralCode(fullName),
    isEmailVerified: true, // OTP already verified client-side before this call
  });

  const token = signToken(user);
  res.status(201).json({ success: true, user, token });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() }).select("+passwordHash");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }
  user.lastLoginAt = new Date();
  await user.save();
  const token = signToken(user);
  res.json({ success: true, user, token });
});

export const setRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!["rider", "driver"].includes(role)) throw new ApiError(400, "Invalid role");
  req.user.role = role;
  await req.user.save();
  res.json({ success: true, user: req.user });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() });
  if (!user) {
    // Don't leak account existence.
    return res.json({ success: true, message: "If that account exists, a reset code was sent" });
  }
  await generateAndSendOtp(email);
  res.json({ success: true, message: "If that account exists, a reset code was sent" });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, code, newPassword } = req.body;
  const ok = await verifyOtpCode(email, code);
  if (!ok) throw new ApiError(400, "Incorrect or expired code");
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new ApiError(404, "Account not found");
  user.passwordHash = await User.hashPassword(newPassword);
  await user.save();
  res.json({ success: true });
});
