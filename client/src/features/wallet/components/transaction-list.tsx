import React from "react";
import { Transaction } from "../types/wallet.types";
import { formatCurrency } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight, Clock, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export function TransactionList({ transactions, isLoading }: TransactionListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-2xl bg-slate-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-slate-200 bg-white space-y-2">
        <Receipt className="h-8 w-8 text-slate-300" />
        <p className="text-xs font-medium text-slate-500">No transactions recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {transactions.map((txn) => {
        const isCredit = txn.type === "credit";
        const dateFormatted = new Date(txn.createdAt).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        });

        return (
          <div
            key={txn.id}
            className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white shadow-xs hover:border-slate-200 transition-all"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  isCredit ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                }`}
              >
                {isCredit ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900">{txn.description}</h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-400" />
                    {dateFormatted}
                  </span>
                  <span>•</span>
                  <span className="font-mono text-[10px] text-slate-400">{txn.referenceId}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`text-sm font-extrabold ${
                  isCredit ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {isCredit ? "+" : "-"}
                {formatCurrency(txn.amount)}
              </span>
              <div>
                <Badge
                  variant="outline"
                  className={`text-[9px] uppercase px-1.5 py-0 ${
                    txn.status === "success"
                      ? "border-emerald-200 text-emerald-700 bg-emerald-50/50"
                      : "border-slate-200 text-slate-600"
                  }`}
                >
                  {txn.status}
                </Badge>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

