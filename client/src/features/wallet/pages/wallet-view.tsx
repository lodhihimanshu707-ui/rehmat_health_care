import React from "react";
import { useWallet } from "../hooks/use-wallet";
import { BalanceCard } from "../components/balance-card";
import { TransactionList } from "../components/transaction-list";
import { RechargeModal } from "../components/recharge-modal";
import { History, ShieldCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WalletView() {
  const { wallet, transactions, isLoadingTransactions, refetchWallet } = useWallet();

  const currentBalance = wallet ? wallet.balance : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6">
      {/* Top Balance Banner */}
      <BalanceCard balance={currentBalance} />

      {/* Transaction History Section */}
      <div className="rounded-3xl border border-slate-200/80 bg-slate-50/50 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Consultation & Recharge History
            </h2>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetchWallet()}
            className="h-8 gap-1.5 text-xs text-slate-600 hover:text-emerald-700"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Sync Ledger</span>
          </Button>
        </div>

        <TransactionList transactions={transactions} isLoading={isLoadingTransactions} />
      </div>

      {/* Modal instance */}
      <RechargeModal />
    </div>
  );
}

