import { Router } from "express";
import * as admin from "../controllers/adminController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = Router();
router.use(protect, restrictTo("admin"));

router.get("/stats", admin.getStats);

router.get("/drivers/pending", admin.pendingDrivers);
router.post("/drivers/:id/review", admin.reviewDriver);

router.get("/trips", admin.allTrips);

router.get("/users", admin.allUsers);
router.post("/users/:id/suspend", admin.suspendUser);

router.get("/reports", admin.listReports);
router.post("/reports/:id/status", admin.updateReportStatus);

router.get("/promo-codes", admin.listPromoCodes);
router.post("/promo-codes", admin.createPromoCode);
router.post("/promo-codes/:id/toggle", admin.togglePromoCode);

router.post("/notifications/broadcast", admin.broadcastNotification);

export default router;
