import { Router } from "express";
import { doctorsController } from "./doctors.controller.js";

const router = Router();

router.get("/", doctorsController.getAll);
router.get("/:id", doctorsController.getById);
router.patch("/:id/status", doctorsController.updateStatus);

export default router;
