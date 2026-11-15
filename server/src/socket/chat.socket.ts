import { Server, Socket } from "socket.io";
import { messagesService } from "../modules/messages/messages.service.js";

export function registerChatHandlers(io: Server, socket: Socket) {
  socket.on(
    "send-message",
    async (data: {
      senderId: string;
      receiverId: string;
      text: string;
      consultationId?: string;
    }) => {
      try {
        const savedMessage = await messagesService.sendMessage(
          data.senderId,
          data.receiverId,
          data.text,
          data.consultationId
        );
        // Emit to receiver's private room
        io.to(`user:${data.receiverId}`).emit("receive-message", savedMessage);
        // Also echo back confirmation to sender
        socket.emit("message-sent", savedMessage);
      } catch (err) {
        console.error("Error saving/sending chat message:", err);
      }
    }
  );
}
