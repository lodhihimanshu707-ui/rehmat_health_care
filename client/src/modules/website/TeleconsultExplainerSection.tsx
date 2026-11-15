"use client";

import React from "react";
import { Wallet, Video, Clock, ShieldCheck, CheckCircle2, XCircle, ArrowRight, Sparkles } from "lucide-react";
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
        "Add ₹50, ₹100 or ₹250 seamlessly using UPI (GPay, PhonePe, Paytm) or RuPay/Debit Card. No monthly subscriptions, zero hidden charges.",
    },
    {
      num: "02",
      icon: Video,
      title: "1-Click HD Video Consultation",
      description:
        "Pick Dr. Rehmat Ali, Dr. Sana Khan, or Dr. Tariq and tap 'Video Call'. Connect immediately via secure WebRTC video without waiting rooms.",
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
    <section className="py-20 sm:py-28 bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 text-white relative overflow-hidden">
      {/* Glow decorations */}
      <div className="absolute top-0 right-10 -z-0 h-[500px] w-[500px] rounded-full bg-emerald-600/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 -z-0 h-[400px] w-[400px] rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <span className="inline-block rounded-full bg-emerald-800/80 border border-emerald-500/50 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-300">
            Fair & Transparent Billing
          </span>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Why Pay Fixed ₹500 When You Only Need 5 Minutes?
          </h2>
          <p className="text-base text-emerald-100/85 sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            Traditional clinics charge high fixed fees for a quick 3-minute report review or follow-up question. At Rehmat Health Care, our per-minute model is fair, transparent, and patient-first.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={i}
                className="relative rounded-3xl border border-emerald-800/80 bg-emerald-950/40 p-8 backdrop-blur-md hover:border-emerald-500/60 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center shadow-inner">
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="text-4xl font-black text-emerald-700/60">{st.num}</span>
                </div>
                <h3 className="text-xl font-black text-white">{st.title}</h3>
                <p className="mt-3 text-xs text-emerald-200/80 leading-relaxed font-normal">{st.description}</p>
              </div>
            );
          })}
        </div>

        {/* Comparison Box */}
        <div className="mt-16 rounded-3xl border border-emerald-800/70 bg-emerald-950/30 p-8 sm:p-12 backdrop-blur-md shadow-2xl">
          <h3 className="text-2xl font-black text-center text-white mb-8">
            Compare The Difference
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Traditional OPD */}
            <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-6 sm:p-7 space-y-4">
              <div className="flex items-center gap-2.5 text-rose-400 font-black text-base border-b border-slate-800 pb-3">
                <XCircle className="h-5 w-5 shrink-0" />
                <span>Traditional Hospital & Clinic OPD</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300 font-medium">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Heavy upfront consultation fee (₹400 – ₹800)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>45 to 90 minutes waiting in crowded clinic corridors</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Same full fee charged for asking a 2-minute test report follow-up</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Travel hassle, traffic jams, and contagion risk</span>
                </li>
              </ul>
            </div>

            {/* Rehmat Health Care */}
            <div className="rounded-2xl bg-emerald-900/40 border border-emerald-500/50 p-6 sm:p-7 space-y-4 shadow-lg shadow-emerald-950/50">
              <div className="flex items-center gap-2.5 text-emerald-300 font-black text-base border-b border-emerald-800/80 pb-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                <span>Rehmat Health Care Digital Tele-OPD</span>
              </div>
              <ul className="space-y-3 text-xs text-emerald-100 font-semibold">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Pay strictly per minute (₹15/min for Dr. Rehmat Ali)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Instant video connection — zero waiting room queues</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>A quick 4-minute consultation costs just ₹60, not ₹500</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Wallet balance never expires; use whenever needed</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              onClick={onOpenRecharge}
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black px-7 h-12 rounded-xl shadow-lg gap-2 text-sm transition-all hover:scale-[1.02]"
            >
              <Wallet className="h-4 w-4" />
              <span>Recharge Health Wallet</span>
            </Button>
            <Button
              onClick={onBrowseDoctors}
              variant="outline"
              size="lg"
              className="border-emerald-600/70 text-emerald-100 hover:bg-emerald-900/60 font-bold px-7 h-12 rounded-xl text-sm"
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
