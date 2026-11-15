import { Router } from "express";
import { messagesController } from "./messages.controller.js";

const router = Router();

router.get("/:user1Id/:user2Id", messagesController.getThread);
router.post("/", messagesController.send);
router.post("/read", messagesController.markRead);

export default router;
