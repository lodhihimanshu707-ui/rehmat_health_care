"use client";

import React, { Suspense } from "react";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { ChatView } from "@/modules/chat/ChatView";
import { AuthGuard } from "@/shared/components/AuthGuard";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageSquare, ShieldCheck } from "lucide-react";

function ChatContent() {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get("doctorId") || undefined;
  const doctorName = searchParams.get("doctorName") || undefined;

  return (
    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 py-8">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5 max-w-4xl mx-auto">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-black text-emerald-800 uppercase tracking-wider">
              <MessageSquare className="h-3 w-3" />
              Doctor Chat
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              End-to-End Encrypted
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Consultation Chat Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            Communicate securely with Dr. Raees Akhtar. Send symptom updates, previous reports, and follow-up queries.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-white border border-slate-200 hover:border-emerald-300 px-4 py-2.5 rounded-xl shadow-xs transition-all shrink-0"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      <ChatView
        initialRecipientId={doctorId}
        initialRecipientName={doctorName}
      />
    </div>
  );
}

export default function ChatPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        <AuthGuard
          title="Patient Authentication Required"
          description="In compliance with telemedicine confidentiality regulations, doctor-patient consultation messages are private. Please sign in to access your chat history."
        >
          <Suspense
            fallback={
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
              </div>
            }
          >
            <ChatContent />
          </Suspense>
        </AuthGuard>
      </main>

      <Footer />
    </div>
  );
}
