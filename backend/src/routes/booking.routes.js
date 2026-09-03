import { Router } from "express";
import * as bookings from "../controllers/bookingController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = Router();

router.post("/", protect, restrictTo("rider"), bookings.createBooking);
router.get("/mine", protect, restrictTo("rider"), bookings.myBookings);
router.post("/:id/cancel", protect, restrictTo("rider"), bookings.cancelBooking);
router.post("/:id/respond", protect, restrictTo("driver"), bookings.respondToBooking);
router.post("/negotiate", protect, restrictTo("rider"), bookings.negotiateFare);

export default router;
