"use client";

import React, { Suspense } from "react";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { AuthGuard } from "@/shared/components/AuthGuard";
import { ChatView } from "@/modules/chat/ChatView";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MessageSquare, ArrowLeft } from "lucide-react";

function ChatContent() {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get("doctorId") || undefined;
  const doctorName = searchParams.get("doctorName") || undefined;

  return (
    <div className="flex-1 w-full px-3 sm:px-6 md:px-10 lg:px-14 xl:px-16 py-6 sm:py-8 max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-black text-emerald-800 uppercase tracking-wider">
              <MessageSquare className="h-3 w-3" />
              Doctor Chat
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Consultation Messaging Desk
          </h1>
        </div>

        <Link
          href="/patient"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs transition-all shrink-0"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Dashboard</span>
        </Link>
      </div>

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
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading chat desk...</div>}>
          <ChatContent />
        </Suspense>
        <Footer />
      </div>
    </AuthGuard>
  );
}
