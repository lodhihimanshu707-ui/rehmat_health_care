"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { AuthGuard } from "@/shared/components/AuthGuard";
import { useAuthStore } from "@/stores/auth.store";
import { useWalletStore } from "@/stores/wallet.store";
import { formatCurrency } from "@/shared/utils/format";
import { AppointmentModal } from "@/modules/website/AppointmentModal";
import { RechargeModal } from "@/modules/wallet/RechargeModal";
import {
  Video,
  MessageSquare,
  Wallet,
  Calendar,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  FileText,
  Activity,
  Plus,
  HeartPulse,
  Ticket,
  Clock,
  CheckCircle2,
  Phone,
  Zap,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";

export default function PatientDashboardPage() {
  const { currentUser } = useAuthStore();
  const { cachedBalance, openRechargeModal } = useWalletStore();
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  return (
    <AuthGuard allowedRoles={["patient", "admin"]}>
      <div className="flex min-h-screen flex-col bg-[#f0f2f5] select-none">
        <Navbar />

        <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-20 md:pb-8 space-y-4 sm:space-y-5">
          
          {/* ========================================================================= */}
          {/* 1. WHATSAPP STYLE HERO PATIENT APP BAR                                    */}
          {/* ========================================================================= */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#008069] via-[#075e54] to-slate-900 p-5 sm:p-7 text-white shadow-lg">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-center gap-3.5 sm:gap-4">
                <Avatar className="h-14 w-14 sm:h-16 sm:w-16 border-2 border-white/60 shadow-md">
                  <AvatarImage src={currentUser?.avatarUrl} />
                  <AvatarFallback className="bg-white/20 text-white font-extrabold text-xl">
                    {currentUser?.name?.slice(0, 2).toUpperCase() || "PT"}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-emerald-100 text-[11px] font-bold uppercase tracking-wider mb-1">
                    <span className="h-2 w-2 rounded-full bg-[#25d366] animate-pulse" />
                    <span>Patient Portal • Moradabad</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white">
                    {currentUser?.name || "Rahul Sharma"}
                  </h1>
                  <p className="text-xs text-white/80">
                    {currentUser?.phone || "+91 94120 54321"} • Malviya Nagar
                  </p>
                </div>
              </div>

              {/* Health Wallet Pass Card */}
              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4 flex items-center justify-between sm:justify-end gap-4 shrink-0">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-200 font-bold uppercase tracking-wider">
                    <Wallet className="h-3.5 w-3.5" />
                    <span>Health Wallet</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                    {formatCurrency(cachedBalance)}
                  </div>
                  <span className="text-[10px] text-emerald-200">~{Math.floor(cachedBalance / 15)} mins @ ₹15/min</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={openRechargeModal}
                    className="bg-[#25d366] hover:bg-[#20ba59] active:scale-95 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl shadow-md flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Top-up</span>
                  </button>
                  <Link
                    href="/patient/wallet"
                    className="text-[11px] text-center text-white/90 hover:text-white underline font-semibold"
                  >
                    View Passbook
                  </Link>
                </div>
              </div>
            </div>

            {/* Subtle background glow */}
            <div className="absolute -right-8 -bottom-8 h-48 w-48 rounded-full bg-[#25d366]/15 blur-3xl pointer-events-none" />
          </div>

          {/* ========================================================================= */}
          {/* 2. DR. RAEES AKHTAR LIVE CONSULTATION CARD (WHATSAPP DESIGN)              */}
          {/* ========================================================================= */}
          <div className="rounded-3xl bg-white border border-[#d1d7db] p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-start sm:items-center gap-4">
                <div className="relative shrink-0">
                  <div className="h-16 w-16 sm:h-18 sm:w-18 rounded-2xl bg-gradient-to-tr from-[#008069] to-[#075e54] flex items-center justify-center text-white font-extrabold text-2xl shadow-md border-2 border-white">
                    RA
                  </div>
                  <span
                    className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-[#25d366] border-2 border-white animate-pulse"
                    title="Online for Video Consultation"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-extrabold text-slate-900 text-lg sm:text-xl">
                      Dr. Raees Akhtar
                    </h2>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#25d366]/15 text-[#008069] px-2.5 py-0.5 text-[11px] font-extrabold">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#25d366]" />
                      Online Now
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#008069]">
                    MBBS, MD (General Medicine) • ₹15/min
                  </p>
                  <p className="text-xs text-slate-500">
                    Chief Physician • Beside Mohan X-Ray, Malviya Nagar, Moradabad
                  </p>
                </div>
              </div>

              {/* WhatsApp Action Buttons */}
              <div className="flex items-center gap-2.5 pt-1 sm:pt-0">
                <Link href="/patient/teleconsult" className="flex-1 sm:flex-none">
                  <button className="w-full bg-[#008069] hover:bg-[#00705b] active:scale-95 text-white font-extrabold h-11 px-5 rounded-2xl shadow-md flex items-center justify-center gap-2 text-xs sm:text-sm transition-all cursor-pointer">
                    <Video className="h-4 w-4" />
                    <span>Start Video OPD</span>
                  </button>
                </Link>

                <Link href="/chat">
                  <button className="bg-[#f0f2f5] hover:bg-[#e9edef] active:scale-95 text-[#008069] border border-[#d1d7db] font-extrabold h-11 px-4 rounded-2xl text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer">
                    <MessageSquare className="h-4 w-4 text-[#008069]" />
                    <span>Doctor Chat</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. LIVE QUEUE & CLINIC TOKEN WIDGET                                       */}
          {/* ========================================================================= */}
          <div className="rounded-3xl bg-white border border-[#d1d7db] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Ticket className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-sm text-slate-900">
                    Token #RH-101
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Waiting in Queue
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Est. Wait Time: ~4 mins • Cabin 1 (Dr. Raees Akhtar)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/chat" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto text-xs font-bold text-[#008069] bg-[#008069]/10 hover:bg-[#008069]/20 px-3.5 py-2 rounded-xl transition-colors">
                  Ask Receptionist
                </button>
              </Link>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 4. QUICK ACTION 4-TILE APP GRID (WHATSAPP APP STYLE)                      */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            
            {/* Tile 1: Live Video Tele-OPD */}
            <Link
              href="/patient/teleconsult"
              className="group p-4 sm:p-5 rounded-3xl bg-white border border-[#d1d7db] hover:border-[#008069] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="h-11 w-11 rounded-2xl bg-[#008069]/15 text-[#008069] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Video className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-[#008069] transition-colors">
                  Live Video OPD
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Encrypted WebRTC consultation</p>
              </div>
              <div className="mt-3 flex items-center text-xs font-bold text-[#008069]">
                <span>Connect</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Tile 2: Consultation Chat */}
            <Link
              href="/chat"
              className="group p-4 sm:p-5 rounded-3xl bg-white border border-[#d1d7db] hover:border-[#008069] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="h-11 w-11 rounded-2xl bg-[#008069]/15 text-[#008069] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-[#008069] transition-colors">
                  Consultation Chat
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Direct doctor consultation</p>
              </div>
              <div className="mt-3 flex items-center text-xs font-bold text-[#008069]">
                <span>Open Chat</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Tile 3: Health Wallet */}
            <Link
              href="/patient/wallet"
              className="group p-4 sm:p-5 rounded-3xl bg-white border border-[#d1d7db] hover:border-[#008069] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="h-11 w-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-[#008069] transition-colors">
                  Health Wallet
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Balance: {formatCurrency(cachedBalance)}</p>
              </div>
              <div className="mt-3 flex items-center text-xs font-bold text-amber-700">
                <span>View Ledger</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Tile 4: Mohan X-Ray Diagnostics */}
            <div
              onClick={() => setIsBookModalOpen(true)}
              className="group p-4 sm:p-5 rounded-3xl bg-white border border-[#d1d7db] hover:border-[#008069] hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
            >
              <div className="h-11 w-11 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">
                  Mohan X-Ray
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Beside clinic • Fast reports</p>
              </div>
              <div className="mt-3 flex items-center text-xs font-bold text-blue-700">
                <span>Book Test</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>

        </main>

        <Footer />
        <AppointmentModal
          isOpen={isBookModalOpen}
          onClose={() => setIsBookModalOpen(false)}
        />
        <RechargeModal />
      </div>
    </AuthGuard>
  );
}
