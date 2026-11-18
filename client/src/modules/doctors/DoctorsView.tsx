"use client";

import React from "react";
import { useDoctors } from "./useDoctors";
import { DoctorCard } from "./DoctorCard";
import { useAuthStore } from "@/stores/auth.store";
import { useWalletStore } from "@/stores/wallet.store";
import { formatCurrency } from "@/shared/utils/format";
import { siteConfig } from "@/config/site";
import {
  Video,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Wallet,
  PlusCircle,
  ShieldCheck,
  Clock,
  CheckCircle2,
  FileCheck2,
  Lock,
  Headphones,
  Zap,
  Activity,
  Phone,
  MapPin,
  Building,
  HelpCircle,
  Users,
  FileText,
  CalendarCheck,
  Stethoscope,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { AnimatedCounter } from "@/shared/ui/animated-counter";
import { PulseBadge } from "@/shared/ui/pulse-badge";
import { QueueWidget } from "@/shared/ui/queue-widget";
import { motion } from "framer-motion";

interface DoctorsViewProps {
  onOpenChat: (doctorId: string, doctorName: string) => void;
  onCallInitiated: () => void;
}

export function DoctorsView({ onOpenChat, onCallInitiated }: DoctorsViewProps) {
  const { data: doctors, isLoading, isError, refetch } = useDoctors();
  const { currentUser, isAuthenticated, openAuthModal } = useAuthStore();
  const { cachedBalance, openRechargeModal } = useWalletStore();

  const isPatient = currentUser?.role === "patient";
  const estimatedMins = Math.floor(cachedBalance / 15);

  return (
    <div className="w-full">
      {/* 2-Column Responsive Widescreen Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================= */}
        {/* LEFT / MAIN COLUMN: DOCTOR CHAMBER & TELECONSULT ACTIONS */}
        {/* ========================================================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* Patient Health Wallet Status Strip */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-5 sm:p-6 text-white shadow-xl border border-emerald-500/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-inner shrink-0">
                  <Wallet className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-300">
                      {isAuthenticated && isPatient ? "Your Health Wallet" : "Fair Per-Minute Tele-OPD"}
                    </span>
                    <PulseBadge isLive={true} label="Active" size="sm" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white flex items-baseline gap-2 mt-0.5">
                    {isAuthenticated && isPatient ? (
                      <>
                        <span>{formatCurrency(cachedBalance)}</span>
                        <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                          ~{estimatedMins} mins talk time
                        </span>
                      </>
                    ) : (
                      <span>₹15.00 / minute • Pay strictly for what you use</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-start md:self-center shrink-0 flex-wrap">
                {isAuthenticated && isPatient ? (
                  <Button
                    size="sm"
                    onClick={openRechargeModal}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs h-10 px-4 rounded-xl gap-1.5 shadow-md shadow-emerald-500/25 cursor-pointer"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Add Balance</span>
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => openAuthModal("login")}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs h-10 px-4 rounded-xl gap-1.5 shadow-md shadow-emerald-500/25 cursor-pointer"
                  >
                    <span>Sign In to Call</span>
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="border-white/20 bg-white/10 text-white hover:bg-white/20 h-10 px-3 rounded-xl text-xs font-bold gap-1 cursor-pointer"
                  title="Refresh availability"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Loading & Error States */}
          {isLoading && (
            <div className="h-72 rounded-3xl bg-slate-100 animate-pulse border border-slate-200" />
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center p-8 text-center rounded-3xl border border-rose-200 bg-rose-50 text-rose-800 space-y-3">
              <AlertCircle className="h-8 w-8 text-rose-600" />
              <div>
                <h4 className="font-bold text-sm">Failed to connect to clinic server</h4>
                <p className="text-xs text-rose-600 mt-1">Please ensure the backend server is reachable.</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => refetch()} className="text-xs bg-white">
                Try Again
              </Button>
            </div>
          )}

          {/* Doctor Chamber Card */}
          {!isLoading && !isError && doctors && doctors.length > 0 && (
            <div className="space-y-6">
              {doctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onOpenChat={onOpenChat}
                  onCallInitiated={onCallInitiated}
                />
              ))}
            </div>
          )}

          {/* Pre-Call Consultation Prep Advice Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="rounded-2xl bg-white border border-slate-200/90 p-4 shadow-sm flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Encrypted 1-on-1 Video</h4>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed font-normal">
                  Direct peer-to-peer WebRTC connection. No recordings without explicit consent.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200/90 p-4 shadow-sm flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Mohan X-Ray Reports</h4>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed font-normal">
                  Have your chest X-ray or pathology test results nearby for Dr. Raees to review live.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200/90 p-4 shadow-sm flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Second-by-Second Fee</h4>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed font-normal">
                  Cut the call when your query is solved. Remaining wallet balance never expires.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT SIDEBAR: LIVE OPD LOUNGE, DIAGNOSTICS & HELPDESK */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: Interactive Live OPD Queue Widget */}
          <QueueWidget />

          {/* Card 2: Mohan X-Ray Diagnostics Synergy Card */}
          <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40 p-6 shadow-md shadow-slate-200/40 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-emerald-100 pb-3.5">
              <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Mohan X-Ray Diagnostics</h3>
                <p className="text-[10px] text-emerald-700 font-bold">Direct Synergy • Beside Clinic</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Need diagnostic report evaluation? Dr. Raees Akhtar reviews digital films and blood panels from Mohan X-Ray during your live consultation.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Digital Chest X-Ray (PA View)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>3D/4D Abdomen & Pelvis Ultrasound</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Complete Blood Count (CBC) & Lipid Profile</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/919837012345?text=Hello%20Rehmat%20Health%20Care,%20I%20have%20an%20X-Ray%20report%20to%20review"
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <span>WhatsApp Report to Clinic</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Card 3: Clinic Contact & Emergency Assistance */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-md shadow-slate-200/40 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Phone className="h-4 w-4 text-emerald-600" />
              <h3 className="text-sm font-black text-slate-900">Clinic Helpdesk & Timings</h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Walk-in OPD Hours:</span>
                <span className="font-bold text-slate-800">Mon – Sat (10 AM – 7 PM)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Virtual Video OPD:</span>
                <span className="font-black text-emerald-700">24/7 Available</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Mobile:</span>
                <a href={`tel:${siteConfig.phone}`} className="font-bold text-emerald-700 hover:underline">
                  {siteConfig.phone}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Landline:</span>
                <a href={`tel:${siteConfig.landline}`} className="font-bold text-slate-800 hover:underline">
                  {siteConfig.landline}
                </a>
              </div>
            </div>

            {/* Emergency Hotline Notice */}
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
              <span className="font-bold block text-amber-950">Emergency Ambulance Notice:</span>
              <p className="font-normal leading-relaxed text-amber-900">
                For urgent trauma or cardiac emergencies in Moradabad, dial government emergency at <strong>108 / 112</strong> immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
