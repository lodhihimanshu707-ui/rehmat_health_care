"use client";

import React from "react";
import { useCallStore } from "@/stores/call.store";
import { useWalletStore } from "@/stores/wallet.store";
import { AlertCircle, PlusCircle } from "lucide-react";
import { Button } from "@/shared/ui/button";

export function LowBalanceAlert() {
  const { isLowBalanceAlert, remainingSeconds } = useCallStore();
  const { openRechargeModal } = useWalletStore();

  if (!isLowBalanceAlert) return null;

  return (
    <div className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 z-30 flex items-center justify-between gap-2.5 rounded-2xl bg-rose-600/95 px-3.5 sm:px-5 py-2 sm:py-2.5 text-white shadow-xl backdrop-blur-md border border-rose-400 w-[92vw] max-w-sm animate-bounce">
      <div className="flex items-center gap-2 min-w-0">
        <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-white" />
        <div className="text-[11px] sm:text-xs leading-tight">
          <span className="font-bold">Low Balance:</span> Auto-cutoff in{" "}
          <span className="underline font-extrabold">{remainingSeconds}s</span>
        </div>
      </div>

      <Button
        size="sm"
        onClick={openRechargeModal}
        className="h-7 bg-white text-rose-700 hover:bg-slate-100 font-bold text-[10px] sm:text-xs rounded-lg px-2 shrink-0 gap-1 shadow-sm"
      >
        <PlusCircle className="h-3 w-3" />
        <span>Add ₹</span>
      </Button>
    </div>
  );
}
