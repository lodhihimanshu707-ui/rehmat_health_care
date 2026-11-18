"use client";

import React, { Suspense } from "react";
import { ChatView } from "@/modules/chat/ChatView";
import { AuthGuard } from "@/shared/components/AuthGuard";
import { useSearchParams } from "next/navigation";

function ChatContent() {
  const searchParams = useSearchParams();
  const recipientId = searchParams.get("recipientId") || searchParams.get("doctorId") || undefined;
  const recipientName = searchParams.get("recipientName") || searchParams.get("doctorName") || undefined;

  return (
    <div className="h-[calc(100dvh-56px)] md:h-[100dvh] w-full bg-[#efeae2] overflow-hidden select-none">
      <ChatView
        initialRecipientId={recipientId}
        initialRecipientName={recipientName}
      />
    </div>
  );
}

export default function ChatPage() {
  return (
    <AuthGuard
      title="Patient Authentication Required"
      description="In compliance with telemedicine confidentiality regulations, doctor-patient consultation messages are private. Please sign in to access your chat history."
    >
      <Suspense
        fallback={
          <div className="flex h-[100dvh] w-full items-center justify-center bg-[#efeae2]">
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#00a884] border-t-transparent" />
              <span className="text-xs font-bold text-[#54656f]">Loading Rehmat Care...</span>
            </div>
          </div>
        }
      >
        <ChatContent />
      </Suspense>
    </AuthGuard>
  );
}
