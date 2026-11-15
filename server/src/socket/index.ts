import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { registerCallHandlers } from "./call.socket.js";
import { registerChatHandlers } from "./chat.socket.js";

export function initializeSocket(httpServer: HttpServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    registerCallHandlers(io, socket);
    registerChatHandlers(io, socket);

    socket.on("disconnect", () => {
      // Clean up if needed
    });
  });

  return io;
}
