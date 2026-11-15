import { Server, Socket } from "socket.io";
import { consultationsService } from "../modules/consultations/consultations.service.js";

export function registerCallHandlers(io: Server, socket: Socket) {
  // Join private user room (for alerts, incoming calls)
  socket.on("join-user-room", (userId: string) => {
    socket.join(`user:${userId}`);
  });

  // Join consultation room
  socket.on("join-consultation", (consultationId: string) => {
    socket.join(`consultation:${consultationId}`);
  });

  // Patient initiates call -> doctor receives incoming-call alert
  socket.on(
    "call-user",
    (data: {
      consultationId: string;
      patientId: string;
      patientName: string;
      patientAvatar?: string;
      doctorId: string;
      doctorUserId: string;
      ratePerMinute: number;
    }) => {
      socket.to(`user:${data.doctorUserId}`).emit("incoming-call", data);
    }
  );

  // Doctor accepts call
  socket.on(
    "accept-call",
    async (data: { consultationId: string; patientId: string; doctorId: string }) => {
      try {
        await consultationsService.accept(data.consultationId);
      } catch (err) {
        console.error("Error accepting consultation:", err);
      }
      socket.to(`user:${data.patientId}`).emit("call-accepted", data);
      io.to(`consultation:${data.consultationId}`).emit("call-status-changed", {
        status: "connected",
        startedAt: new Date(),
      });
    }
  );

  // Doctor rejects call
  socket.on("reject-call", (data: { consultationId: string; patientId: string }) => {
    socket.to(`user:${data.patientId}`).emit("call-rejected", data);
  });

  // WebRTC Signaling: Offer
  socket.on("webrtc-offer", (data: { consultationId: string; sdp: any; senderId: string }) => {
    socket.to(`consultation:${data.consultationId}`).emit("webrtc-offer", data);
  });

  // WebRTC Signaling: Answer
  socket.on("webrtc-answer", (data: { consultationId: string; sdp: any; senderId: string }) => {
    socket.to(`consultation:${data.consultationId}`).emit("webrtc-answer", data);
  });

  // WebRTC Signaling: ICE Candidate
  socket.on(
    "ice-candidate",
    (data: { consultationId: string; candidate: any; senderId: string }) => {
      socket.to(`consultation:${data.consultationId}`).emit("ice-candidate", data);
    }
  );

  // End Call
  socket.on(
    "end-call",
    async (data: {
      consultationId: string;
      durationSeconds: number;
      reason?: "user_ended" | "ended_zero_balance" | "error";
    }) => {
      try {
        await consultationsService.end(data.consultationId, {
          durationSeconds: data.durationSeconds,
          reason: data.reason || "user_ended",
        });
      } catch (err) {
        console.error("Error ending consultation in socket:", err);
      }

      io.to(`consultation:${data.consultationId}`).emit("call-ended", data);
    }
  );
}
