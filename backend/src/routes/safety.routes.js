import { Router } from "express";
import * as safety from "../controllers/safetyController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/sos", protect, safety.triggerSos);
router.post("/reports", protect, safety.fileReport);
router.put("/trusted-contacts", protect, safety.updateTrustedContacts);

export default router;
