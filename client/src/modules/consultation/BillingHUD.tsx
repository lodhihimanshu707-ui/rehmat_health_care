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
    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-20 flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-3 pointer-events-none">
      {/* 1. Doctor Info Chip */}
      <div className="flex items-center gap-2 rounded-xl sm:rounded-2xl bg-black/75 px-2.5 sm:px-4 py-1 sm:py-2 text-white backdrop-blur-md border border-white/10 pointer-events-auto shadow-md self-start sm:self-auto max-w-[95vw]">
        <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-emerald-500"></span>
        </span>
        <div className="flex items-center sm:flex-col gap-1 sm:gap-0 min-w-0">
          <span className="text-[11px] sm:text-xs font-bold leading-tight truncate">
            {activeConsultation.doctorName || "Dr. Raees Akhtar"}
          </span>
          <span className="text-[9px] sm:text-[10px] text-emerald-300 hidden xs:inline">
            • {activeConsultation.doctorSpecialization || "General Physician"}
          </span>
        </div>
      </div>

      {/* 2. Billing & Timer Strip */}
      <div className="flex items-center gap-1 sm:gap-2 rounded-xl sm:rounded-2xl bg-black/75 p-1 sm:p-1.5 text-white backdrop-blur-md border border-white/10 pointer-events-auto shadow-lg self-end sm:self-auto max-w-[95vw]">
        {/* Timer */}
        <div className="flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 bg-white/10 rounded-lg sm:rounded-xl">
          <Clock className="h-3 w-3 text-emerald-400 shrink-0" />
          <span className="font-mono text-[11px] sm:text-xs md:text-sm font-bold tracking-wide">
            {formatSeconds(durationSeconds)}
          </span>
        </div>

        {/* Live Cost */}
        <div className="flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 hidden xs:inline">
            Cost:
          </span>
          <span className="text-[11px] sm:text-xs md:text-sm font-extrabold text-emerald-400">
            {formatCurrency(liveCost)}
          </span>
        </div>

        {/* Rate (Hidden on smallest mobile, visible on sm+) */}
        <div className="hidden md:flex items-center gap-1 px-2 py-1 text-xs text-slate-300 border-l border-white/10">
          <span className="text-[10px] text-slate-400">Rate:</span>
          <span className="font-bold text-white">
            {formatCurrency(activeConsultation.ratePerMinute)}/min
          </span>
        </div>

        {/* Remaining Time / Wallet Pill */}
        <div
          className={`flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold ${
            isLowBalanceAlert
              ? "bg-rose-500 text-white animate-pulse"
              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
          }`}
        >
          <Timer className="h-3 w-3 shrink-0" />
          <span>{formatSeconds(remainingSeconds)}</span>
        </div>
      </div>
    </div>
  );
}
