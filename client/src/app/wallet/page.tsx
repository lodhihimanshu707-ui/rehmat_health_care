"use client";

import React from "react";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { WalletView } from "@/modules/wallet/WalletView";
import { AuthGuard } from "@/shared/components/AuthGuard";
import Link from "next/link";
import { ArrowLeft, Wallet, ShieldCheck } from "lucide-react";

export default function WalletPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 py-8">
        <AuthGuard
          requiredRole="patient"
          title="Patient Wallet Authentication"
          description="Your prepaid Health Wallet holds consultation credits and detailed transaction history. Please log in with your registered phone number or password."
        >
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5 max-w-4xl mx-auto">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-black text-emerald-800 uppercase tracking-wider">
                  <Wallet className="h-3 w-3" />
                  Health Wallet
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  UPI & RuPay Protected
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Teleconsultation Health Wallet
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                Add credits via UPI (GPay, PhonePe, Paytm). Credits are deducted transparently per minute during video calls with Dr. Raees Akhtar and never expire.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-white border border-slate-200 hover:border-emerald-300 px-4 py-2.5 rounded-xl shadow-xs transition-all shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Clinic Home</span>
            </Link>
          </div>

          <WalletView />
        </AuthGuard>
      </main>

      <Footer />
    </div>
  );
}

