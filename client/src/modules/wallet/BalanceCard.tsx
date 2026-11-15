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
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold tracking-wider uppercase">
              <Wallet className="h-4 w-4" />
              <span>Rehmat Health Prepaid Medical Wallet</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                {formatCurrency(balance)}
              </span>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-400/30">
                INR Credits
              </span>
            </div>

            <p className="text-xs text-slate-300 flex items-center gap-1.5 pt-1">
              <Zap className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>
                Estimated consultation time: <strong className="text-white">~{estimatedMinutes} minutes</strong> (at avg. ₹15/min)
              </span>
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
            <Button
              onClick={openRechargeModal}
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold gap-2 rounded-2xl shadow-lg shadow-emerald-500/30 w-full sm:w-auto"
            >
              <Plus className="h-5 w-5" />
              <span>Add Money / Recharge</span>
            </Button>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              <span>Instant credit • Deducted per minute</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

