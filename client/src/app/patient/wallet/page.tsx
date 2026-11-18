"use client";

import React from "react";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { AuthGuard } from "@/shared/components/AuthGuard";
import { WalletView } from "@/modules/wallet/WalletView";
import Link from "next/link";
import { Wallet, ArrowLeft } from "lucide-react";

export default function PatientWalletPage() {
  return (
    <AuthGuard requiredRole="patient">
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 w-full px-3 sm:px-6 md:px-10 lg:px-14 xl:px-16 py-6 sm:py-8 max-w-5xl mx-auto space-y-4">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-black text-emerald-800 uppercase tracking-wider">
                  <Wallet className="h-3 w-3" />
                  Health Wallet
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Prepaid Consultation Passbook
              </h1>
            </div>

            <Link
              href="/patient"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs transition-all shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Dashboard</span>
            </Link>
          </div>

          <WalletView />
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}
