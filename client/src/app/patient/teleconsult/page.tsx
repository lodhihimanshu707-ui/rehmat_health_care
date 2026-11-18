"use client";

import React, { useState } from "react";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { AuthGuard } from "@/shared/components/AuthGuard";
import { DoctorsView } from "@/modules/doctors/DoctorsView";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Video,
  ArrowLeft,
  MessageSquare,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

export default function PatientTeleconsultPage() {
  const router = useRouter();

  const handleOpenChat = (doctorId: string, doctorName: string) => {
    router.push(`/chat?recipientId=${doctorId}&recipientName=${encodeURIComponent(doctorName)}`);
  };

  return (
    <AuthGuard requiredRole="patient">
      <div className="flex min-h-screen flex-col bg-[#f0f2f5] select-none">
        <Navbar />

        <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-20 md:pb-8 space-y-4 sm:space-y-5">
          
          {/* WhatsApp Green App Bar Header */}
          <div className="rounded-3xl bg-gradient-to-r from-[#008069] via-[#075e54] to-slate-900 text-white p-5 sm:p-7 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <Link
                href="/patient"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>

              <div className="inline-flex items-center gap-1.5 text-xs text-emerald-200 font-semibold">
                <Lock className="h-3.5 w-3.5 text-[#25d366]" />
                <span>Encrypted Telemedicine</span>
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Live Video Teleconsultation
              </h1>
              <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
                Connect directly with Dr. Raees Akhtar via encrypted WebRTC HD video. Pay strictly for the consultation minutes you talk with transparent Health Wallet deduction.
              </p>
            </div>
          </div>

          {/* Doctor Consultation Deck with WhatsApp Styling */}
          <div className="rounded-3xl bg-white border border-[#d1d7db] p-4 sm:p-6 shadow-sm">
            <DoctorsView
              onOpenChat={handleOpenChat}
              onCallInitiated={() => {}}
            />
          </div>

          {/* Quick Preparation Guidelines */}
          <div className="rounded-3xl bg-white border border-[#d1d7db] p-5 shadow-sm space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#008069]" />
              <span>Tele-OPD Consultation Checklist:</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="p-3 rounded-2xl bg-[#f0f2f5] border border-[#e9edef] space-y-1">
                <span className="font-bold text-slate-900 block">1. Medical Reports</span>
                <p>Keep your previous Mohan X-Ray scan or prescription slips ready to show on camera or send in chat.</p>
              </div>
              <div className="p-3 rounded-2xl bg-[#f0f2f5] border border-[#e9edef] space-y-1">
                <span className="font-bold text-slate-900 block">2. Well-Lit Room</span>
                <p>Sit in a quiet, well-illuminated room so the doctor can clearly evaluate throat and face vitals.</p>
              </div>
              <div className="p-3 rounded-2xl bg-[#f0f2f5] border border-[#e9edef] space-y-1">
                <span className="font-bold text-slate-900 block">3. Health Wallet Balance</span>
                <p>Ensure your wallet has minimum ₹15 balance for seamless per-minute consultation without drops.</p>
              </div>
            </div>
          </div>

        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}
