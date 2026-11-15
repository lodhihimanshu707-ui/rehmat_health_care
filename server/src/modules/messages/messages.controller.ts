import { Request, Response } from "express";
import { BaseController } from "../../core/base/base.controller.js";
import { asyncHandler } from "../../core/async-handler.js";
import { messagesService } from "./messages.service.js";

export class MessagesController extends BaseController {
  getThread = asyncHandler(async (req: Request, res: Response) => {
    const { user1Id, user2Id } = req.params;
    const messages = await messagesService.getThread(user1Id, user2Id);
    return this.ok(res, messages, "Chat thread retrieved");
  });

  send = asyncHandler(async (req: Request, res: Response) => {
    const { senderId, receiverId, text, consultationId } = req.body;
    const message = await messagesService.sendMessage(senderId, receiverId, text, consultationId);
    return this.created(res, message, "Message sent successfully");
  });

  markRead = asyncHandler(async (req: Request, res: Response) => {
    const { senderId, receiverId } = req.body;
    await messagesService.markAsRead(senderId, receiverId);
    return this.ok(res, null, "Messages marked as read");
  });
}

export const messagesController = new MessagesController();
