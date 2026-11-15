"use client";

import React, { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/api/query-client";
import { VideoRoom } from "@/modules/consultation/VideoRoom";
import { IncomingCallModal } from "@/modules/consultation/IncomingCallModal";
import { CallSummaryModal } from "@/modules/consultation/CallSummaryModal";
import { RechargeModal } from "@/modules/wallet/RechargeModal";
import { useAuthStore } from "@/stores/auth.store";
import { useCallStore } from "@/stores/call.store";
import { getSocket, syncSocketUser } from "@/lib/socket";

function SocketBootstrap() {
  const { currentUser } = useAuthStore();
  const { receiveIncomingCall } = useCallStore();

  useEffect(() => {
    const socket = getSocket();
    syncSocketUser(currentUser.id);

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
  }, [currentUser.id, receiveIncomingCall]);

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
    </QueryClientProvider>
  );
}

