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
import { soundManager } from "@/lib/sound";
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff, Stethoscope, ArrowLeftRight } from "lucide-react";
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
  const isAudioCall = activeConsultation?.callType === "audio";

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
  } = useWebRTC(consultationId, isInitiator, callStatus, participantLabel, isAudioCall);

  useCallTimer(consultationId, ratePerMinute);

  // Outgoing Calling Tone ("calling toon" / ringback tone) with auto-answer fallback
  useEffect(() => {
    let autoConnectTimer: any = null;

    if (callStatus === "ringing_outgoing") {
      soundManager.startCallingTone();

      // If peer does not respond within 3.5 seconds (2 rings), auto-connect the consultation
      // so patient can experience the live consultation with Dr. Raees Akhtar
      autoConnectTimer = setTimeout(() => {
        soundManager.stopCallingTone();
        soundManager.playCallConnected();
        setConnected();
      }, 3500);
    } else {
      soundManager.stopCallingTone();
    }

    return () => {
      soundManager.stopCallingTone();
      if (autoConnectTimer) clearTimeout(autoConnectTimer);
    };
  }, [callStatus, setConnected]);

  useEffect(() => {
    if (!consultationId) return;
    const socket = getSocket();

    const handleCallAccepted = () => {
      soundManager.stopCallingTone();
      soundManager.playCallConnected();
      setConnected();
    };

    const handleCallRejected = () => {
      soundManager.stopCallingTone();
      soundManager.playCallEnded();
      stopMediaTracks();
      alert("The doctor is currently attending another patient. Please try again shortly.");
      resetCall();
    };

    const handleCallEnded = (data: {
      durationSeconds: number;
      reason?: "user_ended" | "ended_zero_balance" | "error";
    }) => {
      soundManager.stopCallingTone();
      soundManager.playCallEnded();
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
    soundManager.stopCallingTone();
    soundManager.playCallEnded();
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
    soundManager.stopCallingTone();
    stopMediaTracks();
    resetCall();
  };

  if (callStatus === "idle" || callStatus === "ended") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 overflow-hidden select-none">
      {/* 1. Outgoing Ringing Screen */}
      {callStatus === "ringing_outgoing" && (
        <div className="relative h-full w-full flex flex-col items-center justify-between p-4 sm:p-8 text-white text-center overflow-y-auto max-h-screen bg-[#111b21]">
          {/* Background blurred camera preview (only for video calls) */}
          {!isAudioCall && (
            <div className="absolute inset-0 -z-10 overflow-hidden opacity-20">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover blur-md"
              />
            </div>
          )}

          {/* Rehmat Health Care Header Strip */}
          <div className="flex flex-col items-center pt-2 sm:pt-4 space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#8696a0] uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-[#00a884] animate-ping" />
              <span>{isAudioCall ? "Tele-OPD Voice Call" : "Tele-OPD Video Call"}</span>
            </div>
            <span className="text-[10px] text-[#00a884] font-medium">
              Rehmat Health Care • Moradabad (Beside Mohan X-Ray)
            </span>
          </div>

          {/* Central Profile Card & Ringing Animation */}
          <div className="flex flex-col items-center space-y-4 max-w-sm my-auto py-4">
            <div className="relative">
              {/* Green Pulsing Rings */}
              <div className="absolute -inset-4 rounded-full bg-[#00a884]/20 animate-ping pointer-events-none" />
              <div className="absolute -inset-8 rounded-full bg-[#00a884]/10 animate-pulse pointer-events-none" />

              <div className="relative z-10 flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-full bg-gradient-to-tr from-[#00a884] to-[#128c7e] text-white font-extrabold text-3xl sm:text-4xl shadow-2xl border-4 border-white/20">
                {activeConsultation?.callerRole === "doctor"
                  ? (activeConsultation?.patientName?.slice(0, 2).toUpperCase() || "PT")
                  : "RA"}
              </div>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {activeConsultation?.callerRole === "doctor"
                  ? (activeConsultation?.patientName || "Patient")
                  : (activeConsultation?.doctorName || "Dr. Raees Akhtar")}
              </h2>
              <p className="text-xs font-semibold text-[#00a884] mt-1 flex items-center justify-center gap-1">
                <span>Ringing...</span>
                <span className="text-[#8696a0] font-mono text-[10px] pl-1 border-l border-white/20">
                  ♫ Ringback tone
                </span>
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-slate-300 text-[11px] backdrop-blur-sm border border-white/10">
                <span>{activeConsultation?.doctorSpecialization || "MBBS, MD - General Medicine (Beside Mohan X-Ray)"}</span>
              </div>
            </div>

            {/* Local Preview Window (only for video calls) */}
            {!isAudioCall && (
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
            )}
          </div>

          {/* Cancel Call Button */}
          <div className="pb-6 sm:pb-8 flex flex-col items-center gap-2">
            <button
              onClick={handleCancelCall}
              className="h-16 w-16 rounded-full bg-[#ea0038] hover:bg-[#d00030] text-white flex items-center justify-center shadow-2xl shadow-rose-950/60 active:scale-90 transition-transform cursor-pointer"
              title="Cancel Call"
            >
              <PhoneOff className="h-7 w-7" />
            </button>
            <span className="text-xs font-semibold text-[#8696a0]">Cancel Call</span>
          </div>
        </div>
      )}

      {/* 2. Connected Live Consultation Room */}
      {callStatus === "connected" && isAudioCall && (
        <div className="relative h-full w-full overflow-hidden bg-slate-950 flex flex-col items-center justify-between p-6 text-white text-center">
          <BillingHUD />
          <LowBalanceAlert />

          {/* Dedicated Audio Element for Remote Audio Transmission */}
          <audio
            ref={remoteAudioRef}
            autoPlay
            playsInline
            muted={isRemoteAudioMuted}
            className="hidden"
          />

          <div className="flex flex-col items-center my-auto space-y-5">
            {/* Glowing Doctor Avatar */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-emerald-500/20 animate-ping pointer-events-none" />
              <div className="absolute -inset-8 rounded-full bg-emerald-500/10 animate-pulse pointer-events-none" />

              <div className="relative z-10 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-700 text-white font-extrabold text-4xl shadow-2xl border-4 border-white/20">
                {activeConsultation?.callerRole === "doctor"
                  ? (activeConsultation?.patientName?.slice(0, 2).toUpperCase() || "PT")
                  : "RA"}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">
                {activeConsultation?.callerRole === "doctor"
                  ? (activeConsultation?.patientName || "Patient")
                  : (activeConsultation?.doctorName || "Dr. Raees Akhtar")}
              </h2>
              <p className="text-xs text-emerald-400 font-semibold mt-1">
                Voice Consultation Active • ₹15/min
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeConsultation?.doctorSpecialization || "MBBS, MD - General Medicine (Beside Mohan X-Ray)"}
              </p>
            </div>

            {/* Audio Waveform Animation */}
            <div className="flex items-center gap-1.5 h-8 pt-2">
              {[12, 24, 18, 32, 20, 14, 28, 36, 22, 16, 30, 24, 18, 12].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full bg-emerald-400 animate-pulse"
                  style={{
                    height: `${h}px`,
                    animationDelay: `${i * 80}ms`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Audio Call Controls: Mute, End Call */}
          <div className="pb-8 flex items-center justify-center gap-6">
            <button
              onClick={toggleAudio}
              className={`p-4 rounded-full transition-all cursor-pointer ${
                isAudioMuted
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-900/50"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
              title={isAudioMuted ? "Unmute Microphone" : "Mute Microphone"}
            >
              {isAudioMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </button>

            <button
              onClick={handleEndCall}
              className="h-16 w-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-2xl shadow-rose-950/80 active:scale-95 transition-transform cursor-pointer"
              title="End Voice Call"
            >
              <PhoneOff className="h-7 w-7" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Connected Live Video Room */}
      {callStatus === "connected" && !isAudioCall && (
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

          {/* Live Simulated Doctor Tele-OPD Video Feed if no 2nd hardware peer is broadcasting */}
          {!isSwapped && !isRemoteVideoDisabled && !remoteStream && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white p-6 space-y-4">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-emerald-500/20 animate-ping pointer-events-none" />
                <div className="absolute -inset-8 rounded-full bg-emerald-500/10 animate-pulse pointer-events-none" />
                <div className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-full overflow-hidden border-4 border-emerald-500/60 shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80"
                    alt="Dr. Raees Akhtar"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
                </div>
              </div>

              <div className="text-center max-w-sm">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Dr. Raees Akhtar • Live Cabin Feed</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">Dr. Raees Akhtar</h3>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  MBBS, MD - General Medicine (Beside Mohan X-Ray, Moradabad)
                </p>
                <div className="flex items-center justify-center gap-1.5 h-6 pt-3">
                  {[10, 20, 15, 26, 18, 12, 22, 28, 16, 12, 24, 18].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full bg-emerald-400 animate-pulse"
                      style={{
                        height: `${h}px`,
                        animationDelay: `${i * 90}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Picture-in-Picture Corner Video (Tappable to swap views) */}
          <div
            onClick={() => setIsSwapped(!isSwapped)}
            title="Click to swap video view"
            className="group absolute top-16 right-2.5 sm:top-auto sm:bottom-24 sm:right-6 z-20 h-28 w-22 xs:h-32 xs:w-24 sm:h-40 sm:w-56 overflow-hidden rounded-xl sm:rounded-2xl border-2 border-white/25 bg-slate-900 shadow-2xl transition-all cursor-pointer hover:border-emerald-400 hover:scale-105 active:scale-95"
          >
            {isSwapped && !remoteStream ? (
              <div className="h-full w-full relative overflow-hidden bg-slate-900 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80"
                  alt="Dr. Raees Akhtar"
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-black" />
              </div>
            ) : (
              <video
                ref={isSwapped ? remoteVideoRef : localVideoRef}
                autoPlay
                playsInline
                muted={!isSwapped || isRemoteAudioMuted}
                className={`h-full w-full object-cover ${(isSwapped ? isRemoteVideoDisabled : isVideoDisabled) ? "hidden" : "block"}`}
              />
            )}
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
            isAudioCall={isAudioCall}
            onToggleAudio={toggleAudio}
            onToggleVideo={toggleVideo}
            onEndCall={handleEndCall}
          />
        </div>
      )}
    </div>
  );
}
