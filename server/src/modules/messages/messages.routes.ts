import { Router } from "express";
import { messagesController } from "./messages.controller.js";
import { requireAuth } from "../../core/auth/auth.middleware.js";

const router = Router();

// Chat messaging requires active authentication
router.get("/:user1Id/:user2Id", requireAuth, messagesController.getThread);
router.post("/", requireAuth, messagesController.send);
router.post("/read", requireAuth, messagesController.markRead);

export default router;
