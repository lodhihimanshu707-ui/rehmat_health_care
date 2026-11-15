import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { validate } from "../../core/validate.middleware.js";
import { requireAuth } from "../../core/auth/auth.middleware.js";
import { registerSchema, loginSchema, quickLoginSchema } from "./auth.schema.js";

const router = Router();
const controller = new AuthController();

router.post("/register", validate(registerSchema), controller.register);
router.post("/login", validate(loginSchema), controller.login);
router.post("/quick-login", validate(quickLoginSchema), controller.quickLogin);
router.get("/me", requireAuth, controller.me);
router.post("/logout", controller.logout);

export const authRoutes = router;
