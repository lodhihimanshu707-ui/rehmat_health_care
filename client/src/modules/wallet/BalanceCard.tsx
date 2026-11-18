"use client";

import React from "react";
import { formatCurrency } from "@/shared/utils/format";
import { useWalletStore } from "@/stores/wallet.store";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Wallet, Plus, Zap, ShieldCheck } from "lucide-react";

interface BalanceCardProps {
  balance: number;
}

export function BalanceCard({ balance }: BalanceCardProps) {
  const { openRechargeModal } = useWalletStore();
  const estimatedMinutes = Math.floor(balance / 15);

  return (
    <Card className="overflow-hidden border-emerald-100 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white shadow-xl rounded-3xl">
      <CardContent className="p-5 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 text-[11px] sm:text-xs font-semibold tracking-wider uppercase">
              <Wallet className="h-4 w-4 shrink-0" />
              <span>Rehmat Health Prepaid Medical Wallet</span>
            </div>

            <div className="flex items-baseline gap-2.5 sm:gap-3">
              <span className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                {formatCurrency(balance)}
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-semibold text-emerald-300 border border-emerald-400/30">
                INR Credits
              </span>
            </div>

            <p className="text-xs text-slate-300 flex items-center gap-1.5 pt-1">
              <Zap className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>
                Available consult time: <strong className="text-white">~{estimatedMinutes} mins</strong> (@ ₹15/min)
              </span>
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2.5 sm:gap-3 w-full sm:w-auto">
            <Button
              onClick={openRechargeModal}
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold gap-2 rounded-2xl shadow-lg shadow-emerald-500/30 w-full sm:w-auto h-11 sm:h-12 text-sm justify-center"
            >
              <Plus className="h-5 w-5" />
              <span>Add Money / Recharge</span>
            </Button>
            <span className="text-[11px] text-slate-400 flex items-center justify-center sm:justify-end gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-400 shrink-0" />
              <span>Instant UPI credit • Deducted per minute</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

