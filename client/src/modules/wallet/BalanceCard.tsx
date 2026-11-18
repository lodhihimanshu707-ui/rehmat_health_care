"use client";

import React from "react";
import { formatCurrency } from "@/shared/utils/format";
import { useWalletStore } from "@/stores/wallet.store";
import { useAuthStore } from "@/stores/auth.store";
import { Card, CardContent } from "@/shared/ui/card";
import { Wallet, Plus, Zap, ShieldCheck, CreditCard, Sparkles } from "lucide-react";

interface BalanceCardProps {
  balance: number;
}

export function BalanceCard({ balance }: BalanceCardProps) {
  const { openRechargeModal } = useWalletStore();
  const { currentUser } = useAuthStore();
  const estimatedMinutes = Math.floor(balance / 15);

  return (
    <Card className="overflow-hidden border-[#d1d7db] bg-gradient-to-br from-[#008069] via-[#075e54] to-slate-950 text-white shadow-xl rounded-3xl select-none">
      <CardContent className="p-5 sm:p-8 relative">
        {/* Ambient background glow */}
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-[#25d366]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold tracking-wider uppercase">
              <CreditCard className="h-4 w-4 shrink-0 text-[#25d366]" />
              <span>Rehmat Health Digital Passbook</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                {formatCurrency(balance)}
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white border border-white/30">
                INR Credits
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-white/90">
              <span className="flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 text-amber-300 shrink-0" />
                <span>
                  Consult time: <strong className="text-white">~{estimatedMinutes} mins</strong> (@ ₹15/min)
                </span>
              </span>
              <span className="text-white/40">•</span>
              <span className="text-emerald-200 font-mono">
                {currentUser?.phone || "+91 94120 54321"}
              </span>
            </div>
          </div>

          {/* Quick Top-up Actions */}
          <div className="flex flex-col sm:items-end gap-3 shrink-0">
            <button
              onClick={openRechargeModal}
              className="bg-[#25d366] hover:bg-[#20ba59] active:scale-95 text-slate-950 font-black px-6 h-12 rounded-2xl shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 text-sm transition-all cursor-pointer w-full sm:w-auto"
            >
              <Plus className="h-5 w-5" />
              <span>Add Money / UPI Top-up</span>
            </button>

            {/* Quick 1-tap recharge chips */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto justify-center sm:justify-end">
              {[100, 200, 500].map((amt) => (
                <button
                  key={amt}
                  onClick={openRechargeModal}
                  className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-bold text-white border border-white/20 transition-all cursor-pointer"
                >
                  +{formatCurrency(amt)}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-white/70 flex items-center justify-center sm:justify-end gap-1">
              <ShieldCheck className="h-3 w-3 text-[#25d366] shrink-0" />
              <span>Instant UPI credit • Zero gateway surcharge</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
