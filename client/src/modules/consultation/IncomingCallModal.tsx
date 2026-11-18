"use client";

import React, { useEffect, useState } from "react";
import { useCallStore } from "@/stores/call.store";
import { formatCurrency } from "@/shared/utils/format";
import { getSocket } from "@/lib/socket";
import { soundManager } from "@/lib/sound";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import { PhoneOff, Video, BellRing, Volume2, VolumeX } from "lucide-react";

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
    : "Rehmat Health Care Patient";

  // Play incoming ringtone while incoming call is active
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
      <DialogContent className="w-[95vw] sm:max-w-md max-h-[92vh] overflow-y-auto bg-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border-slate-800 text-center">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-center flex-1 text-sm font-semibold tracking-wider text-emerald-400 uppercase flex items-center justify-center gap-1.5">
              <BellRing className="h-4 w-4 animate-bounce text-emerald-400" />
              Incoming Video Consultation
            </DialogTitle>
            <button
              onClick={toggleMute}
              className="text-xs text-slate-400 hover:text-white p-1 rounded-lg bg-white/5 border border-white/10"
              title={isMuted ? "Unmute Ringtone" : "Mute Ringtone"}
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4 text-emerald-400" />}
            </button>
          </div>
        </DialogHeader>

        <div className="py-6 flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="ring-pulse-animation absolute inset-0 rounded-full bg-emerald-500/30" />
            <Avatar className="h-24 w-24 border-4 border-emerald-500 shadow-xl relative z-10">
              <AvatarImage src={callerAvatar} />
              <AvatarFallback className="bg-emerald-800 text-white font-bold text-2xl">
                {callerName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-white">
              {callerName}
            </h3>
            <p className="text-xs text-slate-400 mt-1">{callerSubtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              Ringing...
            </span>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-2 text-xs text-slate-300">
            Consultation Billing:{" "}
            <strong className="text-emerald-400">
              {formatCurrency(activeConsultation?.ratePerMinute || 15)}/min
            </strong>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 pt-2">
          <Button
            onClick={handleReject}
            className="flex-1 h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold gap-2 text-sm"
          >
            <PhoneOff className="h-5 w-5" />
            <span>Decline</span>
          </Button>

          <Button
            onClick={handleAccept}
            className="flex-1 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-2 text-sm shadow-lg shadow-emerald-600/40"
          >
            <Video className="h-5 w-5" />
            <span>Accept Call</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

