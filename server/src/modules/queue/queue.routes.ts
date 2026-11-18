import { Router } from "express";
import { queueController } from "./queue.controller.js";
import { requireAuth, requireRole } from "../../core/auth/auth.middleware.js";

const router = Router();

// Patient & Staff endpoints: patients, doctors and admins can join/leave/check status
router.post("/join", requireAuth, requireRole("patient", "doctor", "admin"), queueController.join);
router.get("/status", requireAuth, queueController.getMyStatus);
router.delete("/leave", requireAuth, queueController.leave);

// Doctor & Admin endpoints: requireAuth, doctors and admins can manage queue
router.get("/", requireAuth, requireRole("doctor", "admin"), queueController.getDoctorQueue);
router.post("/call-next", requireAuth, requireRole("doctor", "admin"), queueController.callNext);
router.patch("/:id/status", requireAuth, requireRole("doctor", "admin"), queueController.updateStatus);

export default router;
