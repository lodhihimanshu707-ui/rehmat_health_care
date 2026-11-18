import { Router } from "express";
import { consultationsController } from "./consultations.controller.js";
import { validate } from "../../core/validate.middleware.js";
import {
  initiateConsultationSchema,
  tickConsultationSchema,
  endConsultationSchema,
} from "./consultations.schema.js";
import { requireAuth } from "../../core/auth/auth.middleware.js";

const router = Router();

// Consultations require active authentication
router.post("/initiate", requireAuth, validate(initiateConsultationSchema), consultationsController.initiate);
router.post("/:id/accept", requireAuth, consultationsController.accept);
router.post("/:id/tick", requireAuth, validate(tickConsultationSchema), consultationsController.tick);
router.post("/:id/end", requireAuth, validate(endConsultationSchema), consultationsController.end);
router.get("/history/:userId?", requireAuth, consultationsController.getHistory);
router.get("/:id", requireAuth, consultationsController.getById);

export default router;
