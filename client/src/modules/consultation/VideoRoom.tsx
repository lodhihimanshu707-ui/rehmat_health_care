"use client";

import React, { useEffect } from "react";
import { useCallStore } from "@/stores/call.store";
import { useAuthStore } from "@/stores/auth.store";
import { useWebRTC } from "./useWebRTC";
import { useCallTimer } from "./useCallTimer";
import { BillingHUD } from "./BillingHUD";
import { LowBalanceAlert } from "./LowBalanceAlert";
import { CallControls } from "./CallControls";
import { getSocket } from "@/lib/socket";
import { formatCurrency } from "@/shared/utils/format";
import { PhoneOff, Video } from "lucide-react";
import { Button } from "@/shared/ui/button";

export function VideoRoom() {
  const {
    callStatus,
    activeConsultation,
    durationSeconds,
    setConnected,
    endCall,
    resetCall,
  } = useCallStore();

  const { currentUser } = useAuthStore();
  const isPatient = currentUser.role === "patient";

  const consultationId = activeConsultation?.id || null;
  const ratePerMinute = activeConsultation?.ratePerMinute || 15;

  const {
    localVideoRef,
    remoteVideoRef,
    isAudioMuted,
    isVideoDisabled,
    toggleAudio,
    toggleVideo,
  } = useWebRTC(consultationId, isPatient);

  useCallTimer(consultationId, ratePerMinute);

  useEffect(() => {
    if (!consultationId) return;
    const socket = getSocket();

    socket.on("call-accepted", () => {
      setConnected();
    });

    socket.on("call-rejected", () => {
      alert("The doctor is currently busy or unavailable. Please try again shortly.");
      resetCall();
    });

    socket.on(
      "call-ended",
      (data: {
        durationSeconds: number;
        reason?: "user_ended" | "ended_zero_balance" | "error";
      }) => {
        const billedMins = Math.max(1, Math.ceil((data.durationSeconds || durationSeconds) / 60));
        endCall({
          consultationId,
          doctorName: activeConsultation?.doctorName || "Doctor",
          durationSeconds: data.durationSeconds || durationSeconds,
          billedMinutes: billedMins,
          totalCost: billedMins * ratePerMinute,
          ratePerMinute,
          endedReason: data.reason || "user_ended",
        });
      }
    );

    return () => {
      socket.off("call-accepted");
      socket.off("call-rejected");
      socket.off("call-ended");
    };
  }, [consultationId, durationSeconds, ratePerMinute, activeConsultation]);

  const handleEndCall = () => {
    if (!consultationId) return;

    const socket = getSocket();
    socket.emit("end-call", {
      consultationId,
      durationSeconds,
      reason: "user_ended",
    });

    const billedMins = Math.max(1, Math.ceil(durationSeconds / 60));
    endCall({
      consultationId,
      doctorName: activeConsultation?.doctorName || "Doctor",
      durationSeconds,
      billedMinutes: billedMins,
      totalCost: billedMins * ratePerMinute,
      ratePerMinute,
      endedReason: "user_ended",
    });
  };

  if (callStatus === "idle") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950">
      {callStatus === "ringing_outgoing" && (
        <div className="flex flex-col items-center justify-center space-y-6 text-white text-center p-6">
          <div className="relative">
            <div className="ring-pulse-animation absolute inset-0 rounded-full bg-emerald-500/30" />
            <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full bg-emerald-600 shadow-2xl">
              <Video className="h-12 w-12 text-white animate-pulse" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black">
              Calling {activeConsultation?.doctorName || "Doctor"}...
            </h2>
            <p className="text-sm text-emerald-300 mt-1">
              Rehmat Health Care Teleconsultation • {formatCurrency(ratePerMinute)}/min
            </p>
            <p className="text-xs text-slate-400 mt-3 animate-pulse">
              Waiting for the doctor to answer...
            </p>
          </div>

          <Button
            onClick={resetCall}
            className="rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold px-8 h-12 gap-2 shadow-lg shadow-rose-600/30"
          >
            <PhoneOff className="h-5 w-5" />
            <span>Cancel Call</span>
          </Button>
        </div>
      )}

      {callStatus === "connected" && (
        <div className="relative h-full w-full overflow-hidden bg-slate-950 flex items-center justify-center">
          <BillingHUD />
          <LowBalanceAlert />

          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="h-full w-full object-cover"
          />

          <div className="absolute bottom-24 right-6 z-20 h-36 w-48 sm:h-44 sm:w-60 overflow-hidden rounded-2xl border-2 border-white/20 bg-slate-900 shadow-2xl">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
              You ({currentUser.name})
            </div>
          </div>

          <CallControls
            isAudioMuted={isAudioMuted}
            isVideoDisabled={isVideoDisabled}
            onToggleAudio={toggleAudio}
            onToggleVideo={toggleVideo}
            onEndCall={handleEndCall}
          />
        </div>
      )}
    </div>
  );
}

