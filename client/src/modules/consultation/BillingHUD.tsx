"use client";

import React from "react";
import { formatCurrency, formatSeconds } from "@/shared/utils/format";
import { useCallStore } from "@/stores/call.store";
import { Clock, Timer } from "lucide-react";

export function BillingHUD() {
  const {
    activeConsultation,
    durationSeconds,
    liveCost,
    remainingSeconds,
    isLowBalanceAlert,
  } = useCallStore();

  if (!activeConsultation) return null;

  return (
    <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
      <div className="flex items-center gap-2 rounded-2xl bg-black/60 px-4 py-2 text-white backdrop-blur-md border border-white/10 pointer-events-auto">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <div className="flex flex-col">
          <span className="text-xs font-bold leading-tight">
            {activeConsultation.doctorName || "Dr. Rehmat Ali"}
          </span>
          <span className="text-[10px] text-emerald-300">
            {activeConsultation.doctorSpecialization || "General Physician"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-2xl bg-black/60 p-1.5 text-white backdrop-blur-md border border-white/10 pointer-events-auto shadow-lg">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-xl">
          <Clock className="h-3.5 w-3.5 text-emerald-400" />
          <span className="font-mono text-sm font-bold tracking-wider">
            {formatSeconds(durationSeconds)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Cost:</span>
          <span className="text-sm font-extrabold text-emerald-400">
            {formatCurrency(liveCost)}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 border-l border-white/10">
          <span className="text-[10px] text-slate-400">Rate:</span>
          <span className="font-bold text-white">
            {formatCurrency(activeConsultation.ratePerMinute)}/min
          </span>
        </div>

        <div
          className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold ${
            isLowBalanceAlert
              ? "bg-rose-500 text-white animate-pulse"
              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
          }`}
        >
          <Timer className="h-3.5 w-3.5" />
          <span>{formatSeconds(remainingSeconds)} left</span>
        </div>
      </div>
    </div>
  );
}

