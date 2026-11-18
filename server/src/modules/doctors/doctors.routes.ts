import { Router } from "express";
import { doctorsController } from "./doctors.controller.js";
import { requireAuth, requireRole } from "../../core/auth/auth.middleware.js";

const router = Router();

// Doctor patient queue requires doctor or admin role
router.get("/patients/queue", requireAuth, requireRole("doctor", "admin"), doctorsController.getPatientsQueue);

// Public doctor discovery
router.get("/", doctorsController.getAll);
router.get("/:id", doctorsController.getById);

// Updating doctor status requires doctor or admin role
router.patch("/:id/status", requireAuth, requireRole("doctor", "admin"), doctorsController.updateStatus);

export default router;
