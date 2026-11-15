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
import { getSocket, syncSocketUser } from "@/lib/socket";

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

    socket.on("incoming-call", handleIncomingCall);

    return () => {
      socket.off("incoming-call", handleIncomingCall);
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
