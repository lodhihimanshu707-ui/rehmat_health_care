"use client";

import React from "react";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { AuthGuard } from "@/shared/components/AuthGuard";
import { WalletView } from "@/modules/wallet/WalletView";
import Link from "next/link";
import { Wallet, ArrowLeft, ShieldCheck, Lock } from "lucide-react";

export default function PatientWalletPage() {
  return (
    <AuthGuard requiredRole="patient">
      <div className="flex min-h-screen flex-col bg-[#f0f2f5] select-none">
        <Navbar />

        <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-20 md:pb-8 space-y-4 sm:space-y-5">
          
          {/* WhatsApp Green Top App Bar for Health Wallet */}
          <div className="rounded-3xl bg-gradient-to-r from-[#008069] via-[#075e54] to-slate-900 text-white p-5 sm:p-7 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <Link
                href="/patient"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>

              <div className="inline-flex items-center gap-1.5 text-xs text-emerald-200 font-semibold">
                <ShieldCheck className="h-3.5 w-3.5 text-[#25d366]" />
                <span>Instant UPI • Zero Transaction Fees</span>
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Prepaid Consultation Passbook
              </h1>
              <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
                Fair & transparent per-minute telehealth deductions. Every rupee is accounted for with detailed consultation timestamps.
              </p>
            </div>
          </div>

          <WalletView />
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}
