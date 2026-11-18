import { Server, Socket } from "socket.io";
import { consultationsService } from "../modules/consultations/consultations.service.js";
import { Consultation, Doctor } from "../models/index.js";

export function registerCallHandlers(io: Server, socket: Socket) {
  // Join private user room (for alerts, incoming calls)
  socket.on("join-user-room", (userId: string) => {
    socket.join(`user:${userId}`);
  });

  // Join consultation room
  socket.on("join-consultation", (consultationId: string) => {
    socket.join(`consultation:${consultationId}`);
  });

  // Caller initiates call (Patient calling doctor OR Doctor calling patient)
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
      callerRole?: "patient" | "doctor";
    }) => {
      socket.join(`consultation:${data.consultationId}`);
      const targetRoom =
        data.callerRole === "doctor" ? `user:${data.patientId}` : `user:${data.doctorUserId}`;
      socket.to(targetRoom).emit("incoming-call", data);
    }
  );

  // Doctor accepts call
  socket.on(
    "accept-call",
    async (data: { consultationId: string; patientId: string; doctorId: string }) => {
      try {
        await consultationsService.accept(data.consultationId);
      } catch (err) {
        console.error("Error accepting consultation in socket:", err);
      }

      socket.join(`consultation:${data.consultationId}`);
      socket.to(`user:${data.patientId}`).emit("call-accepted", data);

      io.to(`consultation:${data.consultationId}`).emit("call-status-changed", {
        status: "connected",
        startedAt: new Date(),
      });

      // Signal both peers that room is ready for WebRTC negotiation
      io.to(`consultation:${data.consultationId}`).emit("peer-ready", {
        consultationId: data.consultationId,
      });
    }
  );

  // Doctor rejects call
  socket.on("reject-call", (data: { consultationId: string; patientId: string }) => {
    socket.to(`user:${data.patientId}`).emit("call-rejected", data);
  });

  // WebRTC Signaling: Offer
  socket.on("webrtc-offer", (data: { consultationId: string; sdp: any; senderId?: string }) => {
    socket.to(`consultation:${data.consultationId}`).emit("webrtc-offer", data);
  });

  // WebRTC Signaling: Answer
  socket.on("webrtc-answer", (data: { consultationId: string; sdp: any; senderId?: string }) => {
    socket.to(`consultation:${data.consultationId}`).emit("webrtc-answer", data);
  });

  // WebRTC Signaling: ICE Candidate
  socket.on(
    "ice-candidate",
    (data: { consultationId: string; candidate: any; senderId?: string }) => {
      socket.to(`consultation:${data.consultationId}`).emit("ice-candidate", data);
    }
  );

  // Sync Mute and Camera On/Off state between peers
  socket.on(
    "media-state-changed",
    (data: { consultationId: string; isAudioMuted: boolean; isVideoDisabled: boolean }) => {
      socket.to(`consultation:${data.consultationId}`).emit("peer-media-state", data);
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

      // Guarantee delivery by looking up participants and emitting directly to user rooms
      try {
        const consultation = await Consultation.findByPk(data.consultationId, {
          include: [{ model: Doctor, as: "doctor" }],
        });

        if (consultation) {
          if (consultation.patientId) {
            io.to(`user:${consultation.patientId}`).emit("call-ended", data);
          }
          if ((consultation as any).doctor?.userId) {
            io.to(`user:${(consultation as any).doctor.userId}`).emit("call-ended", data);
          }
        }
      } catch (err) {
        console.error("Error looking up consultation for call-ended broadcast:", err);
      }

      // Also broadcast to consultation room
      io.to(`consultation:${data.consultationId}`).emit("call-ended", data);
    }
  );
}
