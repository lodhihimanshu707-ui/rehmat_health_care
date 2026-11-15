import { Router } from "express";
import { consultationsController } from "./consultations.controller.js";
import { validate } from "../../core/validate.middleware.js";
import {
  initiateConsultationSchema,
  tickConsultationSchema,
  endConsultationSchema,
} from "./consultations.schema.js";

const router = Router();

router.post("/initiate", validate(initiateConsultationSchema), consultationsController.initiate);
router.post("/:id/accept", consultationsController.accept);
router.post("/:id/tick", validate(tickConsultationSchema), consultationsController.tick);
router.post("/:id/end", validate(endConsultationSchema), consultationsController.end);
router.get("/history/:userId?", consultationsController.getHistory);
router.get("/:id", consultationsController.getById);

export default router;

