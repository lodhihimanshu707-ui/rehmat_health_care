import React from "react";
import { useCallStore } from "../store/use-call-store";
import { useWalletStore } from "@/features/wallet/store/use-wallet-store";
import { AlertCircle, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LowBalanceAlert() {
  const { isLowBalanceAlert, remainingSeconds } = useCallStore();
  const { openRechargeModal } = useWalletStore();

  if (!isLowBalanceAlert) return null;

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 rounded-2xl bg-rose-600/95 px-5 py-2.5 text-white shadow-xl backdrop-blur-md border border-rose-400 animate-bounce">
      <AlertCircle className="h-5 w-5 shrink-0 text-white" />
      <div className="text-xs">
        <span className="font-bold">Low Balance Warning:</span> Call will auto-disconnect in{" "}
        <span className="underline font-extrabold">{remainingSeconds}s</span>.
      </div>
      <Button
        size="sm"
        onClick={openRechargeModal}
        className="h-7 bg-white text-rose-700 hover:bg-slate-100 font-bold text-xs rounded-lg gap-1"
      >
        <PlusCircle className="h-3.5 w-3.5" />
        <span>Recharge Now</span>
      </Button>
    </div>
  );
}
