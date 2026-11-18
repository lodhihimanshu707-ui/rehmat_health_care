"use client";

import React, { Suspense } from "react";
import { AuthGuard } from "@/shared/components/AuthGuard";
import { ChatView } from "@/modules/chat/ChatView";
import { useSearchParams } from "next/navigation";

function PatientChatContent() {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get("doctorId") || undefined;
  const doctorName = searchParams.get("doctorName") || undefined;

  return (
    <div className="h-[100dvh] w-full bg-[#efeae2] overflow-hidden select-none">
      <ChatView
        initialRecipientId={doctorId}
        initialRecipientName={doctorName}
      />
    </div>
  );
}

export default function PatientChatPage() {
  return (
    <AuthGuard requiredRole="patient">
      <Suspense
        fallback={
          <div className="flex h-[100dvh] w-full items-center justify-center bg-[#efeae2]">
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#00a884] border-t-transparent" />
              <span className="text-xs font-bold text-[#54656f]">Loading WhatsApp...</span>
            </div>
          </div>
        }
      >
        <PatientChatContent />
      </Suspense>
    </AuthGuard>
  );
}
