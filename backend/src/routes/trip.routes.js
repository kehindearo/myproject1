import { Router } from "express";
import * as trips from "../controllers/tripController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = Router();

router.get("/", trips.listTrips);
router.get("/mine", protect, restrictTo("driver"), trips.myPostedTrips);
router.get("/:id", trips.getTrip);
router.post("/", protect, restrictTo("driver"), trips.createTrip);
router.post("/:id/start", protect, restrictTo("driver"), trips.startTrip);
router.post("/:id/end", protect, restrictTo("driver"), trips.endTrip);

export default router;
