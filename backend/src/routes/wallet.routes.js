import { Router } from "express";
import * as wallet from "../controllers/walletController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/", protect, wallet.getWallet);
router.post("/topup", protect, wallet.initiateTopUp);
router.post("/topup/confirm", protect, wallet.confirmTopUp);
router.post("/withdraw", protect, wallet.withdraw);
router.post("/referral/apply", protect, wallet.applyReferral);

export default router;
