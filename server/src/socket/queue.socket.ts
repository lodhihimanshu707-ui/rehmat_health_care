import { Server, Socket } from "socket.io";
import { getIO } from "./index.js";

export function registerQueueHandlers(_io: Server, socket: Socket) {
  socket.on("join-queue-room", () => {
    socket.join("opd-queue-room");
  });

  socket.on("leave-queue-room", () => {
    socket.leave("opd-queue-room");
  });
}

export function broadcastQueueUpdate(payload: any) {
  const io = getIO();
  if (io) {
    io.to("opd-queue-room").emit("queue-updated", payload);
  }
}

export function notifyPatientTurn(patientId: string, payload: any) {
  const io = getIO();
  if (io) {
    io.to(`user:${patientId}`).emit("queue-called", payload);
  }
}
