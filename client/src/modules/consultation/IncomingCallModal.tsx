"use client";

import React from "react";
import { useCallStore } from "@/stores/call.store";
import { formatCurrency } from "@/shared/utils/format";
import { getSocket } from "@/lib/socket";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import { PhoneOff, Video } from "lucide-react";

export function IncomingCallModal() {
  const { callStatus, activeConsultation, setConnected, resetCall } = useCallStore();

  const isIncoming = callStatus === "incoming" && activeConsultation !== null;

  const handleAccept = () => {
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
      <DialogContent className="sm:max-w-md bg-slate-900 text-white rounded-3xl p-6 border-slate-800 text-center">
        <DialogHeader>
          <DialogTitle className="text-center text-sm font-semibold tracking-wider text-emerald-400 uppercase">
            Incoming Video Consultation
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="ring-pulse-animation absolute inset-0 rounded-full bg-emerald-500/30" />
            <Avatar className="h-24 w-24 border-4 border-emerald-500 shadow-xl relative z-10">
              <AvatarImage src={activeConsultation?.patientAvatar} />
              <AvatarFallback className="bg-emerald-800 text-white font-bold text-2xl">
                {activeConsultation?.patientName?.slice(0, 2).toUpperCase() || "PT"}
              </AvatarFallback>
            </Avatar>
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-white">
              {activeConsultation?.patientName || "Patient"}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Rehmat Health Care Patient</p>
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

