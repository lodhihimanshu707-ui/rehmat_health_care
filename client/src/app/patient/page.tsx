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
  Clock,
  ArrowRight,
  FileText,
  Activity,
  Plus,
  Stethoscope,
  HeartPulse,
} from "lucide-react";
import { Button } from "@/shared/ui/button";

export default function PatientDashboardPage() {
  const { currentUser } = useAuthStore();
  const { cachedBalance, openRechargeModal } = useWalletStore();
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  return (
    <AuthGuard allowedRoles={["patient", "admin"]}>
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 w-full px-3 sm:px-6 md:px-10 lg:px-14 xl:px-16 py-6 sm:py-8 pb-20 md:pb-8 max-w-6xl mx-auto space-y-6">
          {/* Patient Welcome & Quick Status Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-5 sm:p-8 text-white shadow-xl">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                  <HeartPulse className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Patient Medical Desk • Moradabad</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  Welcome back, {currentUser?.name || "Patient"}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  Your confidential Rehmat Health Care patient portal. Connect directly with Dr. Raees Akhtar for live video OPD, message confidentially, or review your prescriptions.
                </p>
              </div>

              {/* Health Wallet Card in Header */}
              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4 sm:p-5 flex flex-col items-start sm:items-end gap-2.5 shrink-0">
                <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold uppercase tracking-wider">
                  <Wallet className="h-4 w-4" />
                  <span>Health Wallet</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-white">
                    {formatCurrency(cachedBalance)}
                  </span>
                  <span className="text-xs text-slate-300">INR</span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    size="sm"
                    onClick={openRechargeModal}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl h-8 px-3 gap-1 shadow-sm w-full sm:w-auto"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Top-up UPI</span>
                  </Button>
                  <Link href="/wallet" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10 text-xs rounded-xl h-8 px-3 w-full sm:w-auto"
                    >
                      Ledger
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Ambient decoration */}
            <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          </div>

          {/* Dr. Raees Akhtar Live OPD Status Card */}
          <div className="rounded-2xl sm:rounded-3xl border border-emerald-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-extrabold text-xl shadow-md">
                    RA
                  </div>
                  <span
                    className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-100 animate-pulse"
                    title="Dr. Raees Akhtar is Online"
                  />
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                      Dr. Raees Akhtar
                    </h3>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800 uppercase">
                      Online Now
                    </span>
                  </div>
                  <p className="text-xs font-bold text-emerald-700">MBBS, MD (General Medicine)</p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Chief Medical Consultant • Near Mohan X-Ray, Malviya Nagar
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/teleconsult" className="flex-1 sm:flex-none">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 px-5 rounded-xl shadow-md gap-2 text-xs sm:text-sm">
                    <Video className="h-4 w-4" />
                    <span>Start Video OPD (₹15/min)</span>
                  </Button>
                </Link>

                <Link href="/chat">
                  <Button
                    variant="outline"
                    className="border-slate-200 text-slate-700 hover:bg-slate-50 h-11 px-3.5 rounded-xl text-xs font-bold gap-1.5"
                  >
                    <MessageSquare className="h-4 w-4 text-slate-600" />
                    <span className="hidden sm:inline">Chat</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Action 4-Tile Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {/* 1. Live Tele-OPD */}
            <Link
              href="/teleconsult"
              className="group flex flex-col justify-between p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-300 hover:shadow-md transition-all"
            >
              <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Video className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                  Live Video OPD
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">₹15/min per-minute billing</p>
              </div>
              <div className="mt-3 flex items-center text-xs font-bold text-emerald-700">
                <span>Connect</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 2. Confidential Chat */}
            <Link
              href="/chat"
              className="group flex flex-col justify-between p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-300 hover:shadow-md transition-all"
            >
              <div className="h-10 w-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                  Medical Chat
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Encrypted doctor messaging</p>
              </div>
              <div className="mt-3 flex items-center text-xs font-bold text-teal-700">
                <span>Open Chat</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 3. Health Wallet */}
            <Link
              href="/wallet"
              className="group flex flex-col justify-between p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-300 hover:shadow-md transition-all"
            >
              <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                  Health Wallet
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Balance: {formatCurrency(cachedBalance)}</p>
              </div>
              <div className="mt-3 flex items-center text-xs font-bold text-amber-700">
                <span>Passbook</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 4. Book Walk-in Visit */}
            <button
              type="button"
              onClick={() => setIsBookModalOpen(true)}
              className="group flex flex-col justify-between p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-300 hover:shadow-md transition-all text-left"
            >
              <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                  In-Clinic OPD
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Beside Mohan X-Ray</p>
              </div>
              <div className="mt-3 flex items-center text-xs font-bold text-blue-700">
                <span>Book Slot</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {/* Digital Prescriptions & Diagnostics Desk */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Prescriptions card */}
            <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-600" />
                  <h3 className="font-extrabold text-slate-900 text-sm">Digital Prescriptions</h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Verified MCI/NMC
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                All prescription orders issued by Dr. Raees Akhtar during video OPD are archived here and sent instantly to your WhatsApp.
              </p>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 text-xs text-slate-600 space-y-1">
                <div className="flex justify-between font-semibold text-slate-800">
                  <span>Prescription #RA-2026-042</span>
                  <span className="text-emerald-700">Active</span>
                </div>
                <p className="text-[11px] text-slate-500">Dr. Raees Akhtar • Tab Paracetamol 650mg TDS, Cough Syrup</p>
              </div>
            </div>

            {/* Diagnostic Synergy card */}
            <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <h3 className="font-extrabold text-slate-900 text-sm">Mohan X-Ray Synergy</h3>
                </div>
                <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  Beside Clinic
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Direct referral coordination with Mohan X-Ray & Ultrasound Centre next door. Share X-ray films and lab reports directly with Dr. Raees Akhtar.
              </p>
              <div className="rounded-xl bg-blue-50/60 p-3 border border-blue-100 text-xs text-slate-700 space-y-1">
                <div className="flex justify-between font-semibold text-slate-900">
                  <span>Diagnostic Services Next Door:</span>
                  <span className="text-blue-700 font-bold">Same Day</span>
                </div>
                <p className="text-[11px] text-slate-600">Digital X-Ray, 3D/4D Sonography, Fasting Blood Sugar, CBC Panel</p>
              </div>
            </div>
          </div>
        </main>

        <Footer />

        <AppointmentModal
          isOpen={isBookModalOpen}
          onClose={() => setIsBookModalOpen(false)}
          initialDoctorName="Dr. Raees Akhtar"
        />
        <RechargeModal />
      </div>
    </AuthGuard>
  );
}
