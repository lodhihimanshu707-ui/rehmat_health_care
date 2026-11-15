"use client";

import React from "react";
import { Wallet, Video, Clock, ShieldCheck, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface TeleconsultExplainerSectionProps {
  onOpenRecharge: () => void;
  onBrowseDoctors: () => void;
}

export function TeleconsultExplainerSection({
  onOpenRecharge,
  onBrowseDoctors,
}: TeleconsultExplainerSectionProps) {
  const steps = [
    {
      num: "01",
      icon: Wallet,
      title: "Top-Up Your Health Wallet",
      description:
        "Add ₹50, ₹100 or ₹250 seamlessly using UPI (GPay, PhonePe, Paytm) or RuPay/Debit Card. No subscription, no expiry.",
    },
    {
      num: "02",
      icon: Video,
      title: "1-Click HD Video Consultation",
      description:
        "Pick Dr. Rehmat Ali or Dr. Sana Khan and tap 'Video Call'. Connect immediately via secure WebRTC video without waiting rooms.",
    },
    {
      num: "03",
      icon: Clock,
      title: "Transparent Per-Minute Billing",
      description:
        "Watch the live on-screen timer and wallet deduction HUD in real-time. Hang up whenever you're done — pay only for actual seconds used.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-emerald-950 text-white relative overflow-hidden">
      {/* Glow decorations */}
      <div className="absolute top-0 right-10 -z-0 h-96 w-96 rounded-full bg-emerald-700/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 -z-0 h-80 w-80 rounded-full bg-teal-600/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-emerald-800/80 border border-emerald-600/50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
            Smart & Fair Healthcare
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Why Pay Fixed ₹500 When You Only Need 5 Minutes?
          </h2>
          <p className="mt-4 text-base text-emerald-200/90 sm:text-lg">
            Traditional clinics charge high fixed fees for a quick 3-minute report review or follow-up question. At Rehmat Health Care, our per-minute model is fair, transparent, and patient-first.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={i}
                className="relative rounded-2xl border border-emerald-800/80 bg-emerald-900/40 p-6 backdrop-blur-sm hover:border-emerald-500/60 transition-all"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="h-12 w-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-3xl font-black text-emerald-700/60">{st.num}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{st.title}</h3>
                <p className="mt-2 text-xs text-emerald-200/80 leading-relaxed">{st.description}</p>
              </div>
            );
          })}
        </div>

        {/* Comparison Box */}
        <div className="mt-14 rounded-2xl border border-emerald-800/70 bg-emerald-900/30 p-6 sm:p-8 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-center text-white mb-6">
            Compare The Difference
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Traditional OPD */}
            <div className="rounded-xl bg-slate-900/60 border border-slate-700/60 p-5 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <XCircle className="h-5 w-5" />
                <span>Traditional Hospital & Clinic OPD</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">✕</span>
                  <span>Heavy upfront consultation fee (₹400 – ₹800)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">✕</span>
                  <span>45 to 90 minutes waiting in crowded clinic corridors</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">✕</span>
                  <span>Same full fee charged for asking a 2-minute test report follow-up</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">✕</span>
                  <span>Travel hassle, parking issues, and contagion risk</span>
                </li>
              </ul>
            </div>

            {/* Rehmat Health Care */}
            <div className="rounded-xl bg-emerald-800/40 border border-emerald-500/50 p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <CheckCircle2 className="h-5 w-5" />
                <span>Rehmat Health Care Digital Tele-OPD</span>
              </div>
              <ul className="space-y-2 text-xs text-emerald-100">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Pay strictly per minute (₹15/min for Dr. Rehmat Ali)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Instant video connection — zero waiting room queues</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>A quick 4-minute consultation costs just ₹60, not ₹500</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Wallet balance never expires; use whenever needed</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              onClick={onOpenRecharge}
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-6 h-11 rounded-xl shadow-lg gap-2"
            >
              <Wallet className="h-4 w-4" />
              <span>Recharge Health Wallet</span>
            </Button>
            <Button
              onClick={onBrowseDoctors}
              variant="outline"
              size="lg"
              className="border-emerald-600/70 text-emerald-100 hover:bg-emerald-900/60 font-semibold px-6 h-11 rounded-xl"
            >
              <span>See Available Doctors</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

