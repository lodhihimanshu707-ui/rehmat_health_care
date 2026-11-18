"use client";

import React from "react";
import { useCallStore } from "@/stores/call.store";
import { useWalletStore } from "@/stores/wallet.store";
import { formatCurrency, formatSeconds } from "@/shared/utils/format";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { CheckCircle2, AlertOctagon, CreditCard } from "lucide-react";

export function CallSummaryModal() {
  const { callStatus, callSummary, resetCall } = useCallStore();
  const { openRechargeModal } = useWalletStore();

  const isOpen = callStatus === "ended" && callSummary !== null;
  const isZeroBalance = callSummary?.endedReason === "ended_zero_balance";

  const handleDone = () => {
    resetCall();
  };

  const handleRechargeNow = () => {
    resetCall();
    openRechargeModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDone}>
      <DialogContent className="w-[95vw] sm:max-w-md max-h-[92vh] overflow-y-auto bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-center">
        <DialogHeader>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full mb-2 bg-emerald-50 text-emerald-600">
            {isZeroBalance ? (
              <AlertOctagon className="h-8 w-8 text-amber-600" />
            ) : (
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            )}
          </div>

          <DialogTitle className="text-xl font-bold text-slate-900">
            {isZeroBalance ? "Call Ended: Balance Exhausted" : "Consultation Concluded"}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {isZeroBalance
              ? "Your prepaid consultation wallet reached ₹0.00. The call was safely terminated."
              : "Thank you for consulting with Rehmat Health Care Moradabad."}
          </DialogDescription>
        </DialogHeader>

        {callSummary && (
          <div className="py-3 space-y-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Doctor:</span>
                <span className="font-bold text-slate-900">{callSummary.doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Duration:</span>
                <span className="font-mono font-bold text-slate-800">
                  {formatSeconds(callSummary.durationSeconds)} ({callSummary.billedMinutes} min billed)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Rate:</span>
                <span className="font-semibold text-slate-700">
                  {formatCurrency(callSummary.ratePerMinute)} / min
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200/60 pt-2 text-sm">
                <span className="font-bold text-slate-800">Total Deducted:</span>
                <span className="font-extrabold text-emerald-700">
                  {formatCurrency(callSummary.totalCost)}
                </span>
              </div>
            </div>

            {isZeroBalance && (
              <Button
                onClick={handleRechargeNow}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 rounded-xl text-xs gap-2"
              >
                <CreditCard className="h-4 w-4" />
                <span>Recharge Wallet to Call Again</span>
              </Button>
            )}

            <Button
              variant="outline"
              onClick={handleDone}
              className="w-full border-slate-200 text-slate-700 font-semibold h-11 rounded-xl text-xs"
            >
              Back to Doctors
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

