"use client";

import React, { useState, useEffect } from "react";
import { useQueueStore } from "@/stores/queue.store";
import { useAuthStore } from "@/stores/auth.store";
import { PulseBadge } from "@/shared/ui/pulse-badge";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Users,
  Clock,
  Ticket,
  CheckCircle2,
  AlertCircle,
  Video,
  MapPin,
  X,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function QueueWidget() {
  const { currentUser, isAuthenticated, openAuthModal } = useAuthStore();
  const {
    myQueueItem,
    myPosition,
    estimatedWaitMinutes,
    totalWaiting,
    isJoining,
    isLeaving,
    joinQueue,
    fetchMyStatus,
    leaveQueue,
    initSocketListeners,
  } = useQueueStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [symptom, setSymptom] = useState("");
  const [consultType, setConsultType] = useState<"video" | "clinic">("video");

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyStatus();
    }
    const cleanup = initSocketListeners();
    return cleanup;
  }, [isAuthenticated]);

  const handleOpenJoin = () => {
    if (!isAuthenticated) {
      openAuthModal("login");
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await joinQueue(consultType, symptom || "General consultation follow-up");
      setIsModalOpen(false);
      setSymptom("");
    } catch (err: any) {
      alert(err.message || "Failed to join queue");
    }
  };

  const isCallingNow = myQueueItem?.status === "calling";

  return (
    <>
      <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm relative overflow-hidden space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-emerald-600" />
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Live OPD Queue Desk
            </h3>
          </div>
          <PulseBadge
            isLive={true}
            label={myQueueItem ? "Token Active" : "Queue Open"}
            variant={myQueueItem ? "emerald" : "blue"}
            size="sm"
          />
        </div>

        {/* State A: Patient has an active token in the queue */}
        {myQueueItem ? (
          <div className="space-y-3.5">
            {/* Calling Alert Banner */}
            {isCallingNow && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs flex items-center gap-2.5 shadow-lg shadow-emerald-600/30 animate-pulse"
              >
                <Video className="h-5 w-5 shrink-0" />
                <span>Dr. Raees Akhtar is calling you now! Please accept the call on your screen.</span>
              </motion.div>
            )}

            {/* Token Badge Display */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-950 text-white shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                  Your Digital OPD Token
                </span>
                <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded-full border border-white/15">
                  {myQueueItem.type === "video" ? "Video Tele-OPD" : "In-Clinic Visit"}
                </span>
              </div>

              <div className="my-2.5 flex items-baseline justify-between">
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {myQueueItem.tokenNumber}
                </span>
                <div className="text-right">
                  <span className="text-xs text-slate-300 block">Position in Line</span>
                  <span className="text-lg sm:text-xl font-black text-emerald-300">
                    {myPosition === 1 ? "Next in Turn!" : `#${myPosition} in Line`}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Est. Wait: ~{estimatedWaitMinutes} mins</span>
                </span>
                <span className="text-[11px] text-emerald-200 truncate max-w-[150px]">
                  Dr. Raees Akhtar Desk
                </span>
              </div>
            </div>

            {/* Leave / Cancel Queue Button */}
            <Button
              variant="outline"
              size="sm"
              disabled={isLeaving}
              onClick={leaveQueue}
              className="w-full border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-800 text-xs font-bold rounded-xl h-9"
            >
              <span>{isLeaving ? "Leaving..." : "Cancel / Leave Queue"}</span>
            </Button>
          </div>
        ) : (
          /* State B: Patient has no token - Show Queue Size & Join Button */
          <div className="space-y-3.5">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-semibold block text-[11px]">Patients Waiting</span>
                <span className="text-xl font-black text-slate-900 mt-0.5 block">
                  {totalWaiting > 0 ? totalWaiting : "0 (No Wait)"}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-semibold block text-[11px]">Avg. Consult Time</span>
                <span className="text-xl font-black text-emerald-700 mt-0.5 block">~5 mins</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Join the live virtual queue to reserve your spot for 1-on-1 consultation with <strong>Dr. Raees Akhtar</strong>.
            </p>

            <Button
              onClick={handleOpenJoin}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 rounded-2xl text-xs gap-2 shadow-md shadow-emerald-600/20"
            >
              <Ticket className="h-4 w-4" />
              <span>Join Live OPD Queue (Get Token)</span>
              <ArrowRight className="h-4 w-4 opacity-75" />
            </Button>
          </div>
        )}
      </div>

      {/* Join Queue Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Ticket className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Join Clinic OPD Queue</h4>
                  <p className="text-[11px] text-slate-500">Rehmat Health Care • Malviya Nagar</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmJoin} className="space-y-3.5">
              {/* Consultation Type */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Consultation Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setConsultType("video")}
                    className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                      consultType === "video"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Video className="h-4 w-4 text-emerald-600" />
                    <span>Video Call (₹15/m)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConsultType("clinic")}
                    className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                      consultType === "clinic"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <MapPin className="h-4 w-4 text-rose-500" />
                    <span>In-Clinic Walk-in</span>
                  </button>
                </div>
              </div>

              {/* Symptoms / Chief Concern */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Chief Concern / Symptoms (Optional)
                </label>
                <Input
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  placeholder="e.g. Fever, sore throat, BP check, routine review"
                  className="text-xs h-10 rounded-2xl"
                />
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <p><strong>Attending Physician:</strong> Dr. Raees Akhtar (MD Medicine)</p>
                <p><strong>Billing:</strong> Second-by-second wallet auto-deduction at ₹15/min.</p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isJoining}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold px-4 h-10 shadow-sm"
                >
                  <span>{isJoining ? "Generating Token..." : "Confirm & Get Token"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
