"use client";

import React, { useState } from "react";
import { Doctor } from "./types";
import { useAuthStore } from "@/stores/auth.store";
import { useWalletStore } from "@/stores/wallet.store";
import { useCallStore } from "@/stores/call.store";
import { formatCurrency } from "@/shared/utils/format";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Video,
  MessageSquare,
  Star,
  Clock,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Sparkles,
  PhoneCall,
  Activity,
  Mic,
  Camera,
  FileText,
  BadgeCheck,
  Calendar,
} from "lucide-react";
import { apiClient } from "@/api/client";
import { getSocket } from "@/lib/socket";
import { PulseBadge } from "@/shared/ui/pulse-badge";
import { motion, AnimatePresence } from "framer-motion";

interface DoctorCardProps {
  doctor: Doctor;
  onOpenChat: (doctorId: string, doctorName: string) => void;
  onCallInitiated: () => void;
}

export function DoctorCard({ doctor, onOpenChat, onCallInitiated }: DoctorCardProps) {
  const { currentUser, isAuthenticated, openAuthModal } = useAuthStore();
  const { cachedBalance, openRechargeModal } = useWalletStore();
  const { startOutgoingCall } = useCallStore();
  const [isCalling, setIsCalling] = useState(false);
  const [deviceTestStatus, setDeviceTestStatus] = useState<"idle" | "testing" | "ok" | "error">("idle");
  const [deviceTestMsg, setDeviceTestMsg] = useState("");

  const isPatient = currentUser?.role === "patient";

  const handleTestDevice = async () => {
    setDeviceTestStatus("testing");
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("MediaDevices API not supported on this browser");
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach((t) => t.stop());
      setDeviceTestStatus("ok");
      setDeviceTestMsg("Camera & Microphone are working perfectly!");
    } catch (err: any) {
      setDeviceTestStatus("error");
      setDeviceTestMsg(err.message || "Camera/Mic permission blocked. Please check browser settings.");
    }
  };

  const handleStartCall = async () => {
    if (!isAuthenticated) {
      openAuthModal("login");
      return;
    }

    if (!isPatient) {
      alert("You are currently logged in as a Doctor. Please log in as a Patient to place a consultation call.");
      return;
    }

    if (cachedBalance < doctor.ratePerMinute) {
      alert(
        `Insufficient Balance: Dr. ${doctor.user.name}'s rate is ${formatCurrency(doctor.ratePerMinute)}/min. Your balance is ${formatCurrency(cachedBalance)}. Please recharge to continue.`
      );
      openRechargeModal();
      return;
    }

    setIsCalling(true);
    try {
      const result = await apiClient.post<{ consultation: any }>("/consultations/initiate", {
        doctorId: doctor.id,
        patientId: currentUser.id,
        type: "video",
      });

      const consultation = result.consultation;

      startOutgoingCall({
        id: consultation.id,
        patientId: currentUser.id,
        patientName: currentUser.name,
        patientAvatar: currentUser.avatarUrl,
        doctorId: doctor.id,
        doctorName: doctor.user.name,
        doctorAvatar: doctor.user.avatarUrl,
        doctorSpecialization: doctor.specialization,
        ratePerMinute: doctor.ratePerMinute,
      });

      const socket = getSocket();
      socket.emit("call-user", {
        consultationId: consultation.id,
        patientId: currentUser.id,
        patientName: currentUser.name,
        patientAvatar: currentUser.avatarUrl,
        doctorId: doctor.id,
        doctorUserId: doctor.userId,
        ratePerMinute: doctor.ratePerMinute,
      });

      socket.emit("join-consultation", consultation.id);
      onCallInitiated();
    } catch (err: any) {
      alert(err.message || "Failed to initiate consultation");
    } finally {
      setIsCalling(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl border border-emerald-200/90 bg-white p-6 sm:p-9 shadow-xl shadow-slate-200/70 relative overflow-hidden"
    >
      {/* Decorative top accent gradient */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Doctor Profile & Credentials */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            <div className="relative self-start shrink-0">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-3xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-2xl sm:text-3xl shadow-lg shadow-emerald-600/30">
                {doctor.user.name
                  .split(" ")
                  .filter((w) => !w.includes("Dr"))
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "RA"}
              </div>
              <div className="absolute -bottom-1 -right-1">
                <PulseBadge isLive={doctor.isOnline} label={doctor.isOnline ? "Online" : "Offline"} size="sm" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {doctor.user.name}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                  <BadgeCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>NMC Registered</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm font-black text-emerald-700">
                {doctor.specialization} • {doctor.qualifications}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1.5 text-xs">
                <span className="flex items-center gap-1 rounded-xl bg-amber-50 px-2.5 py-0.5 font-bold text-amber-900 border border-amber-200">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500 shrink-0" />
                  <span>{doctor.rating} ★ Justdial Verified</span>
                </span>
                <span className="flex items-center gap-1 rounded-xl bg-slate-100 px-2.5 py-0.5 font-bold text-slate-700">
                  <Clock className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                  <span>{doctor.experienceYears}+ Years Clinical Practice</span>
                </span>
              </div>
            </div>
          </div>

          {/* About Doctor */}
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              "{doctor.about || "Chief Medical Consultant at Rehmat Health Care, Malviya Nagar, Moradabad. 10+ years dedicated experience in general medicine, seasonal fevers, diabetes, hypertension, and primary healthcare."}"
            </p>
          </div>

          {/* Clinical Focus Badges */}
          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
              Consultation Scope & Services
            </span>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200/70 px-3 py-1">
                Seasonal & Viral Fevers
              </span>
              <span className="rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200/70 px-3 py-1">
                Type-2 Diabetes & Hypertension
              </span>
              <span className="rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200/70 px-3 py-1">
                Mohan X-Ray & Ultrasound Review
              </span>
              <span className="rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200/70 px-3 py-1">
                WhatsApp E-Prescriptions
              </span>
            </div>
          </div>

          {/* Pre-Call Hardware Device Tester */}
          <div className="rounded-2xl bg-slate-50/90 border border-slate-200 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Camera className="h-4 w-4 text-emerald-600" />
                <span>Pre-Call Device Check</span>
              </div>
              <button
                type="button"
                onClick={handleTestDevice}
                disabled={deviceTestStatus === "testing"}
                className="text-[11px] font-black text-emerald-700 hover:text-emerald-800 bg-emerald-100/70 hover:bg-emerald-100 px-3 py-1 rounded-lg transition-colors cursor-pointer"
              >
                {deviceTestStatus === "testing" ? "Testing..." : "Test Mic & Camera"}
              </button>
            </div>

            {deviceTestStatus === "ok" && (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{deviceTestMsg}</span>
              </div>
            )}

            {deviceTestStatus === "error" && (
              <div className="text-xs font-semibold text-rose-700 bg-rose-50 p-2 rounded-xl border border-rose-200">
                {deviceTestMsg}
              </div>
            )}

            {deviceTestStatus === "idle" && (
              <p className="text-[11px] text-slate-500 font-normal">
                Click test to ensure your microphone and webcam permissions are active before connecting.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Live Virtual OPD Initiation Console */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-950 text-white p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                  Consultation Billing
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-black text-white">
                    {formatCurrency(doctor.ratePerMinute)}
                  </span>
                  <span className="text-xs font-semibold text-emerald-300">/ min</span>
                </div>
              </div>

              <span className="rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3 py-1 text-xs font-black flex items-center gap-1.5 shadow-inner">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span>0 min wait</span>
              </span>
            </div>

            {/* Quick Estimate Reference */}
            <div className="mt-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Estimated Duration Examples
              </span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                  <span className="block font-bold text-white text-[11px]">3 mins</span>
                  <span className="text-[10px] text-emerald-400 font-extrabold">₹45</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                  <span className="block font-bold text-white text-[11px]">5 mins</span>
                  <span className="text-[10px] text-emerald-400 font-extrabold">₹75</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                  <span className="block font-bold text-white text-[11px]">10 mins</span>
                  <span className="text-[10px] text-emerald-400 font-extrabold">₹150</span>
                </div>
              </div>
            </div>

            {/* Key Features Check */}
            <div className="space-y-2 pt-4 text-xs text-emerald-100/90 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Encrypted HD Video & Audio</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Second-by-second wallet deduction</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Immediate WhatsApp & PDF Prescription</span>
              </div>
            </div>
          </div>

          {/* Action Triggers */}
          <div className="space-y-3 pt-2">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                disabled={!doctor.isOnline || isCalling}
                onClick={handleStartCall}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black h-12 rounded-2xl shadow-lg shadow-emerald-500/30 text-sm gap-2 transition-all cursor-pointer"
              >
                <Video className="h-4 w-4 text-slate-950" />
                <span>{isCalling ? "Initiating Call..." : `Start Video Consult (₹15/min)`}</span>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                onClick={() => onOpenChat(doctor.userId, doctor.user.name)}
                className="w-full border-white/20 text-white hover:bg-white/10 font-bold h-11 rounded-xl text-xs gap-2 cursor-pointer"
              >
                <MessageSquare className="h-4 w-4 text-emerald-400" />
                <span>Send Message / Inquire</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
