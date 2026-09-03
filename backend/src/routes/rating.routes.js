import { Router } from "express";
import * as ratings from "../controllers/ratingController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = Router();

router.post("/", protect, restrictTo("rider"), ratings.submitRating);
router.get("/driver/:driverId", ratings.driverRatings);

export default router;
