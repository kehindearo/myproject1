import { Router } from "express";
import * as auth from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiters.js";

const router = Router();

router.post("/otp/request", authLimiter, auth.requestOtp);
router.post("/otp/verify", authLimiter, auth.verifyOtp);
router.post("/signup", authLimiter, auth.signup);
router.post("/login", authLimiter, auth.login);
router.post("/forgot-password", authLimiter, auth.forgotPassword);
router.post("/reset-password", authLimiter, auth.resetPassword);
router.post("/role", protect, auth.setRole);
router.get("/me", protect, auth.me);

export default router;
