import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { registerCallHandlers } from "./call.socket.js";
import { registerChatHandlers } from "./chat.socket.js";
import { registerQueueHandlers } from "./queue.socket.js";

let socketServer: SocketIOServer | null = null;

export function initializeSocket(httpServer: HttpServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  socketServer = io;

  io.on("connection", (socket) => {
    registerCallHandlers(io, socket);
    registerChatHandlers(io, socket);
    registerQueueHandlers(io, socket);

    socket.on("disconnect", () => {
      // Clean up if needed
    });
  });

  return io;
}

export function getIO(): SocketIOServer | null {
  return socketServer;
}
