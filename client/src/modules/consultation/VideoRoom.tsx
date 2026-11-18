"use client";

import React, { useEffect, useState } from "react";
import { useCallStore } from "@/stores/call.store";
import { useAuthStore } from "@/stores/auth.store";
import { useWebRTC } from "./useWebRTC";
import { useCallTimer } from "./useCallTimer";
import { BillingHUD } from "./BillingHUD";
import { LowBalanceAlert } from "./LowBalanceAlert";
import { CallControls } from "./CallControls";
import { getSocket } from "@/lib/socket";
import { PhoneOff, Video, VideoOff, MicOff, Stethoscope, ArrowLeftRight } from "lucide-react";
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

  const [isSwapped, setIsSwapped] = useState(false);

  const { currentUser } = useAuthStore();
  const isPatient = currentUser?.role === "patient";
  const isDoctor = currentUser?.role === "doctor";
  const isInitiator = activeConsultation?.callerRole === "doctor" ? isDoctor : isPatient;

  const consultationId = activeConsultation?.id || null;
  const ratePerMinute = activeConsultation?.ratePerMinute || 15;
  const isConnected = callStatus === "connected";

  const participantLabel = currentUser?.name
    ? `${currentUser.name} (${currentUser.role === "doctor" ? "Doctor" : "Patient"})`
    : isPatient
    ? "Rahul Sharma (Patient)"
    : "Dr. Raees Akhtar (MD Medicine)";

  const {
    localVideoRef,
    remoteVideoRef,
    remoteAudioRef,
    remoteStream,
    isAudioMuted,
    isVideoDisabled,
    isRemoteAudioMuted,
    isRemoteVideoDisabled,
    toggleAudio,
    toggleVideo,
    stopMediaTracks,
    hasMicrophonePermission,
  } = useWebRTC(consultationId, isInitiator, callStatus, participantLabel);

  useCallTimer(consultationId, ratePerMinute);

  useEffect(() => {
    if (!consultationId) return;
    const socket = getSocket();

    const handleCallAccepted = () => {
      setConnected();
    };

    const handleCallRejected = () => {
      stopMediaTracks();
      alert("The doctor is currently attending another patient. Please try again shortly.");
      resetCall();
    };

    const handleCallEnded = (data: {
      durationSeconds: number;
      reason?: "user_ended" | "ended_zero_balance" | "error";
    }) => {
      // Immediately shut down camera and mic hardware when remote peer ends call
      stopMediaTracks();
      const actualDuration = data.durationSeconds || durationSeconds;
      const billedMins = Math.max(1, Math.ceil(actualDuration / 60));
      endCall({
        consultationId,
        doctorName: activeConsultation?.doctorName || "Dr. Raees Akhtar",
        durationSeconds: actualDuration,
        billedMinutes: billedMins,
        totalCost: billedMins * ratePerMinute,
        ratePerMinute,
        endedReason: data.reason || "user_ended",
      });
    };

    socket.on("call-accepted", handleCallAccepted);
    socket.on("call-rejected", handleCallRejected);
    socket.on("call-ended", handleCallEnded);

    return () => {
      socket.off("call-accepted", handleCallAccepted);
      socket.off("call-rejected", handleCallRejected);
      socket.off("call-ended", handleCallEnded);
    };
  }, [consultationId, durationSeconds, ratePerMinute, activeConsultation, setConnected, resetCall, endCall, stopMediaTracks]);

  const handleEndCall = () => {
    stopMediaTracks();
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
      doctorName: activeConsultation?.doctorName || "Dr. Raees Akhtar",
      durationSeconds,
      billedMinutes: billedMins,
      totalCost: billedMins * ratePerMinute,
      ratePerMinute,
      endedReason: "user_ended",
    });
  };

  const handleCancelCall = () => {
    stopMediaTracks();
    resetCall();
  };

  if (callStatus === "idle" || callStatus === "ended") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 overflow-hidden select-none">
      {/* 1. Outgoing Ringing Screen with Local Camera Self-Preview */}
      {callStatus === "ringing_outgoing" && (
        <div className="relative h-full w-full flex flex-col items-center justify-between p-4 sm:p-8 text-white text-center overflow-y-auto max-h-screen">
          {/* Background blurred camera preview */}
          <div className="absolute inset-0 -z-10 overflow-hidden opacity-25">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover blur-md"
            />
          </div>

          {/* Top Branding Header */}
          <div className="flex items-center gap-2 pt-2 sm:pt-4">
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md">
              <Stethoscope className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-300">
              Rehmat Health Care • Tele-OPD
            </span>
          </div>

          {/* Central Profile Card & Ringing Animation */}
          <div className="flex flex-col items-center space-y-3 sm:space-y-4 max-w-sm my-auto py-4">
            <div className="relative">
              <div className="ring-pulse-animation absolute inset-0 rounded-full bg-emerald-500/30" />
              <div className="relative z-10 flex h-20 w-20 sm:h-28 sm:w-28 items-center justify-center rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-extrabold text-2xl sm:text-3xl shadow-2xl border-4 border-white/20">
                {activeConsultation?.callerRole === "doctor"
                  ? (activeConsultation?.patientName?.slice(0, 2).toUpperCase() || "PT")
                  : (activeConsultation?.doctorName
                      ? activeConsultation.doctorName
                          .split(" ")
                          .filter((w) => !w.includes("Dr"))
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      : "RA")}
              </div>
            </div>

            <div>
              <h2 className="text-lg sm:text-2xl font-black text-white leading-tight">
                Calling {activeConsultation?.callerRole === "doctor"
                  ? (activeConsultation?.patientName || "Patient")
                  : (activeConsultation?.doctorName || "Dr. Raees Akhtar")}...
              </h2>
              <p className="text-[11px] sm:text-xs font-semibold text-emerald-300 mt-1">
                {activeConsultation?.callerRole === "doctor"
                  ? "Rehmat Health Care • Video OPD Queue"
                  : (activeConsultation?.doctorSpecialization || "General Physician & Family Medicine")}
              </p>
              <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-slate-200 text-[11px] sm:text-xs backdrop-blur-sm border border-white/10">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span>
                  {activeConsultation?.callerRole === "doctor"
                    ? "Ringing patient device..."
                    : "Ringing doctor's cockpit..."}
                </span>
              </div>
            </div>

            {/* Local Preview Window */}
            <div className="h-24 w-32 sm:h-28 sm:w-40 overflow-hidden rounded-2xl border-2 border-white/30 bg-slate-900 shadow-xl relative mt-2 shrink-0">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-1 left-1.5 text-[8px] sm:text-[9px] font-bold text-white/90 bg-black/60 px-1 py-0.5 rounded">
                Your Camera
              </span>
            </div>
          </div>

          {/* Cancel Call Button */}
          <div className="pb-4 sm:pb-6">
            <Button
              onClick={handleCancelCall}
              className="rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 sm:px-8 h-10 sm:h-12 gap-2 shadow-xl shadow-rose-600/40 text-xs sm:text-sm active:scale-95 transition-transform"
            >
              <PhoneOff className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Cancel Call</span>
            </Button>
          </div>
        </div>
      )}

      {/* 2. Connected Live Consultation Room */}
      {callStatus === "connected" && (
        <div className="relative h-full w-full overflow-hidden bg-slate-950 flex items-center justify-center">
          <BillingHUD />
          <LowBalanceAlert />

          {/* Dedicated Audio Element for Remote Audio Transmission (Hard-muted when peer is muted) */}
          <audio
            ref={remoteAudioRef}
            autoPlay
            playsInline
            muted={isRemoteAudioMuted}
            className="hidden"
          />

          {/* Browser Permission Alert for Insecure Mobile Connections */}
          {!hasMicrophonePermission && (
            <div className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 z-40 bg-amber-500/95 text-slate-950 text-[11px] sm:text-xs font-semibold px-4 py-2 rounded-2xl shadow-2xl border border-amber-300 max-w-[92%] sm:max-w-md text-center backdrop-blur-md">
              <span className="font-bold">⚠️ Microphone/Camera blocked by browser:</span> Mobile browsers require enabling Chrome flags for HTTP LAN testing to hear voice.
            </div>
          )}

          {/* Indicator when Remote Peer is Muted */}
          {isRemoteAudioMuted && (
            <div className="absolute top-16 sm:top-20 right-4 z-40 bg-rose-600/90 text-white text-[11px] sm:text-xs font-bold px-3 py-1.5 rounded-full shadow-xl flex items-center gap-1.5 backdrop-blur-md border border-rose-400">
              <MicOff className="h-3.5 w-3.5" />
              <span>{isPatient ? "Doctor" : "Patient"} Muted</span>
            </div>
          )}

          {/* Main Full-Screen Video (Remote by default, or Local if swapped) */}
          <video
            ref={isSwapped ? localVideoRef : remoteVideoRef}
            autoPlay
            playsInline
            muted={isSwapped || isRemoteAudioMuted}
            className={`h-full w-full object-cover ${(isSwapped ? isVideoDisabled : isRemoteVideoDisabled) ? "hidden" : "block"}`}
          />

          {/* Placeholder if Main Video is Turned Off */}
          {(isSwapped ? isVideoDisabled : isRemoteVideoDisabled) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-white space-y-4 p-6">
              <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-3xl bg-slate-900 border-2 border-white/10 flex items-center justify-center text-4xl sm:text-5xl font-black text-emerald-400 shadow-2xl">
                {isSwapped ? (isPatient ? "PT" : "DR") : (isPatient ? "DR" : "PT")}
              </div>
              <div className="text-center">
                <p className="text-base sm:text-lg font-bold text-slate-200">
                  {isSwapped ? "Your Camera is Off" : `${isPatient ? "Doctor" : "Patient"}'s Camera is Off`}
                </p>
                <p className="text-xs text-slate-400 mt-1">Audio consultation is active</p>
              </div>
            </div>
          )}

          {/* Connecting remote feed placeholder (only if remote not yet disabled and not yet streaming) */}
          {!isSwapped && !isRemoteVideoDisabled && !remoteStream && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 text-white text-center p-6 space-y-3">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Video className="h-8 w-8 sm:h-10 sm:w-10 animate-pulse" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-200">Connecting HD video feed...</p>
              <p className="text-[10px] sm:text-xs text-slate-400">WebRTC peer negotiation active</p>
            </div>
          )}

          {/* Picture-in-Picture Corner Video (Tappable to swap views) */}
          <div
            onClick={() => setIsSwapped(!isSwapped)}
            title="Click to swap video view"
            className="group absolute top-16 right-2.5 sm:top-auto sm:bottom-24 sm:right-6 z-20 h-28 w-22 xs:h-32 xs:w-24 sm:h-40 sm:w-56 overflow-hidden rounded-xl sm:rounded-2xl border-2 border-white/25 bg-slate-900 shadow-2xl transition-all cursor-pointer hover:border-emerald-400 hover:scale-105 active:scale-95"
          >
            <video
              ref={isSwapped ? remoteVideoRef : localVideoRef}
              autoPlay
              playsInline
              muted={!isSwapped || isRemoteAudioMuted}
              className={`h-full w-full object-cover ${(isSwapped ? isRemoteVideoDisabled : isVideoDisabled) ? "hidden" : "block"}`}
            />
            {/* PIP Camera Off placeholder */}
            {(isSwapped ? isRemoteVideoDisabled : isVideoDisabled) && (
              <div className="h-full w-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-2 text-center">
                <VideoOff className="h-6 w-6 text-slate-500 mb-1" />
                <span className="text-[9px] font-semibold">Camera Off</span>
              </div>
            )}
            <div className="absolute bottom-1 left-1 flex items-center gap-1 rounded bg-black/75 px-1.5 py-0.5 text-[8px] sm:text-[9px] font-bold text-white backdrop-blur-sm truncate max-w-[90%]">
              <span>{isSwapped ? "Remote" : "You"}</span>
              <ArrowLeftRight className="h-2.5 w-2.5 opacity-70 group-hover:opacity-100" />
            </div>
          </div>

          {/* Control Bar (Mute, Camera, End Call) */}
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
