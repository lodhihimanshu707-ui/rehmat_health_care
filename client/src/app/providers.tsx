"use client";

import React, { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/api/query-client";
import { VideoRoom } from "@/modules/consultation/VideoRoom";
import { IncomingCallModal } from "@/modules/consultation/IncomingCallModal";
import { CallSummaryModal } from "@/modules/consultation/CallSummaryModal";
import { RechargeModal } from "@/modules/wallet/RechargeModal";
import { AuthModal } from "@/modules/auth/AuthModal";
import { useAuthStore } from "@/stores/auth.store";
import { useCallStore } from "@/stores/call.store";
import { useWalletStore } from "@/stores/wallet.store";
import { getSocket, syncSocketUser } from "@/lib/socket";
import { soundManager } from "@/lib/sound";

function SocketBootstrap() {
  const currentUserId = useAuthStore((s) => s.currentUser?.id);
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const receiveIncomingCall = useCallStore((s) => s.receiveIncomingCall);

  // Check auth once on mount
  useEffect(() => {
    checkAuth();
  }, []); // Run strictly once on mount

  // Sync socket user and listen for incoming calls
  useEffect(() => {
    if (!currentUserId) return;
    const socket = getSocket();
    syncSocketUser(currentUserId);

    const handleIncomingCall = (data: {
      consultationId: string;
      patientId: string;
      patientName: string;
      patientAvatar?: string;
      doctorId: string;
      doctorUserId: string;
      ratePerMinute: number;
    }) => {
      receiveIncomingCall({
        id: data.consultationId,
        patientId: data.patientId,
        patientName: data.patientName,
        patientAvatar: data.patientAvatar,
        doctorId: data.doctorId,
        ratePerMinute: data.ratePerMinute,
      });
    };

    const handleWalletUpdated = (data: { balance: number }) => {
      if (typeof data?.balance === "number") {
        useWalletStore.getState().setCachedBalance(data.balance);
      }
    };

    const handleGlobalCallEnded = (data: {
      consultationId: string;
      durationSeconds?: number;
      reason?: "user_ended" | "ended_zero_balance" | "error";
    }) => {
      const state = useCallStore.getState();
      if (state.callStatus !== "idle" && state.callStatus !== "ended") {
        const active = state.activeConsultation;
        const actualDuration = data.durationSeconds ?? state.durationSeconds;
        const rate = active?.ratePerMinute || 15;
        const billedMins = Math.max(1, Math.ceil(actualDuration / 60));
        state.endCall({
          consultationId: active?.id || data.consultationId,
          doctorName: active?.doctorName || "Dr. Raees Akhtar",
          durationSeconds: actualDuration,
          billedMinutes: billedMins,
          totalCost: billedMins * rate,
          ratePerMinute: rate,
          endedReason: data.reason || "user_ended",
        });
      }
    };

    const handleGlobalMessage = (msg: { receiverId?: string; text?: string; sender?: any }) => {
      if (
        msg.receiverId === currentUserId &&
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/chat")
      ) {
        soundManager.playMessageReceived();
      }
    };

    socket.on("incoming-call", handleIncomingCall);
    socket.on("wallet-updated", handleWalletUpdated);
    socket.on("call-ended", handleGlobalCallEnded);
    socket.on("receive-message", handleGlobalMessage);

    return () => {
      socket.off("incoming-call", handleIncomingCall);
      socket.off("wallet-updated", handleWalletUpdated);
      socket.off("call-ended", handleGlobalCallEnded);
      socket.off("receive-message", handleGlobalMessage);
    };
  }, [currentUserId, receiveIncomingCall]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SocketBootstrap />
      {children}
      <VideoRoom />
      <IncomingCallModal />
      <CallSummaryModal />
      <RechargeModal />
      <AuthModal />
    </QueryClientProvider>
  );
}
