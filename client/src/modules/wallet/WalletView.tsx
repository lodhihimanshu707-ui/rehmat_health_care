"use client";

import React from "react";
import { useWallet } from "./useWallet";
import { BalanceCard } from "./BalanceCard";
import { TransactionList } from "./TransactionList";
import { RechargeModal } from "./RechargeModal";
import { History, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/button";

export function WalletView() {
  const { wallet, transactions, isLoadingTransactions, refetchWallet } = useWallet();

  const currentBalance = wallet ? wallet.balance : 0;

  return (
    <div className="mx-auto max-w-4xl px-3 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-6">
      <BalanceCard balance={currentBalance} />

      <div className="rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-slate-50/50 p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-emerald-700 shrink-0" />
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider truncate">
              Consultation & Recharge History
            </h2>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetchWallet()}
            className="h-8 gap-1.5 text-xs text-slate-600 hover:text-emerald-700 shrink-0"
          >
            <RefreshCw className="h-3 w-3" />
            <span className="hidden sm:inline">Sync Ledger</span>
          </Button>
        </div>

        <TransactionList transactions={transactions} isLoading={isLoadingTransactions} />
      </div>

      <RechargeModal />
    </div>
  );
}

