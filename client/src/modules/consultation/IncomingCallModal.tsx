"use client";

import React, { useEffect, useState } from "react";
import { useCallStore } from "@/stores/call.store";
import { formatCurrency } from "@/shared/utils/format";
import { getSocket } from "@/lib/socket";
import { soundManager } from "@/lib/sound";
import {
  Dialog,
  DialogContent,
} from "@/shared/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import { PhoneOff, Video, Lock, Volume2, VolumeX, ShieldCheck } from "lucide-react";

export function IncomingCallModal() {
  const { callStatus, activeConsultation, setConnected, resetCall } = useCallStore();
  const [isMuted, setIsMuted] = useState(false);

  const isIncoming = callStatus === "incoming" && activeConsultation !== null;
  const isDoctorCaller = activeConsultation?.callerRole === "doctor";
  const callerName = isDoctorCaller
    ? activeConsultation?.doctorName || "Dr. Raees Akhtar"
    : activeConsultation?.patientName || "Patient";
  const callerAvatar = isDoctorCaller
    ? activeConsultation?.doctorAvatar
    : activeConsultation?.patientAvatar;
  const callerSubtitle = isDoctorCaller
    ? "Chief Physician • Rehmat Health Care, Moradabad"
    : "Rehmat Health Care Patient • OPD Queue";

  // Play WhatsApp marimba ringtone loop while incoming
  useEffect(() => {
    if (isIncoming && !isMuted) {
      soundManager.startIncomingRingtone();
    } else {
      soundManager.stopIncomingRingtone();
    }

    return () => {
      soundManager.stopIncomingRingtone();
    };
  }, [isIncoming, isMuted]);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (nextMuted) {
      soundManager.stopIncomingRingtone();
    } else {
      soundManager.startIncomingRingtone();
    }
  };

  const handleAccept = () => {
    soundManager.stopIncomingRingtone();
    soundManager.playCallConnected();

    if (!activeConsultation) return;

    const socket = getSocket();
    socket.emit("accept-call", {
      consultationId: activeConsultation.id,
      patientId: activeConsultation.patientId,
      doctorId: activeConsultation.doctorId,
    });

    socket.emit("join-consultation", activeConsultation.id);
    setConnected();
  };

  const handleReject = () => {
    soundManager.stopIncomingRingtone();
    soundManager.playCallEnded();

    if (!activeConsultation) return;

    const socket = getSocket();
    socket.emit("reject-call", {
      consultationId: activeConsultation.id,
      patientId: activeConsultation.patientId,
    });

    resetCall();
  };

  return (
    <Dialog open={isIncoming} onOpenChange={() => {}}>
      <DialogContent className="w-[95vw] sm:max-w-md max-h-[95vh] overflow-hidden bg-[#111b21] text-white rounded-3xl p-0 border-[#222e35] shadow-2xl select-none">
        
        {/* WhatsApp Video Call Header */}
        <div className="pt-6 px-6 pb-2 text-center space-y-1 relative">
          <button
            onClick={toggleMute}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
            title={isMuted ? "Unmute Ringtone" : "Mute Ringtone"}
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4 text-[#00a884]" />}
          </button>

          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#8696a0] uppercase tracking-wider">
            <Lock className="h-3 w-3 text-[#00a884]" />
            <span>WhatsApp Video Call</span>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight pt-1">
            {callerName}
          </h2>
          <p className="text-xs text-[#00a884] font-medium flex items-center justify-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#00a884] animate-ping" />
            <span>Incoming video consultation...</span>
          </p>
        </div>

        {/* Central WhatsApp Pulsing Avatar */}
        <div className="py-8 flex flex-col items-center justify-center">
          <div className="relative">
            {/* WhatsApp Green Pulsing Glow Rings */}
            <div className="absolute -inset-4 rounded-full bg-[#00a884]/20 animate-ping pointer-events-none" />
            <div className="absolute -inset-8 rounded-full bg-[#00a884]/10 animate-pulse pointer-events-none" />
            
            <Avatar className="h-32 w-32 border-4 border-[#00a884] shadow-2xl relative z-10">
              <AvatarImage src={callerAvatar} />
              <AvatarFallback className="bg-[#00a884] text-white font-extrabold text-3xl">
                {callerName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="mt-5 text-center px-6">
            <p className="text-xs text-[#8696a0]">{callerSubtitle}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#d1d7db]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#00a884]" />
              <span>
                Rate: <strong className="text-white">{formatCurrency(activeConsultation?.ratePerMinute || 15)}/min</strong>
              </span>
            </div>
          </div>
        </div>

        {/* WhatsApp Call Action Bottom Bar */}
        <div className="bg-[#202c33] px-8 py-6 flex items-center justify-around border-t border-[#222e35]">
          {/* Decline (Red Circle) */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={handleReject}
              className="h-16 w-16 rounded-full bg-[#ea0038] hover:bg-[#d00030] active:scale-90 text-white flex items-center justify-center shadow-lg shadow-rose-950/40 transition-all cursor-pointer"
            >
              <PhoneOff className="h-7 w-7" />
            </button>
            <span className="text-[11px] font-semibold text-[#8696a0]">Decline</span>
          </div>

          {/* Accept (WhatsApp Green Circle) */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={handleAccept}
              className="h-16 w-16 rounded-full bg-[#00a884] hover:bg-[#008f6f] active:scale-90 text-white flex items-center justify-center shadow-lg shadow-[#00a884]/30 transition-all animate-bounce cursor-pointer"
            >
              <Video className="h-7 w-7" />
            </button>
            <span className="text-[11px] font-bold text-[#00a884]">Accept Video</span>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
