import { Router } from "express";
import * as driver from "../controllers/driverController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = Router();

router.post("/onboarding", protect, driver.submitOnboarding);
router.get("/me", protect, restrictTo("driver"), driver.getMyProfile);
router.post("/status", protect, restrictTo("driver"), driver.setOnlineStatus);
router.post("/location", protect, restrictTo("driver"), driver.updateLocation);
router.get("/earnings", protect, restrictTo("driver"), driver.getEarnings);

export default router;
