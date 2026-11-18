"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  Video,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Calculator,
  Zap,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { formatCurrency } from "@/shared/utils/format";

interface TeleconsultExplainerSectionProps {
  onOpenRecharge: () => void;
  onBrowseDoctors: () => void;
}

export function TeleconsultExplainerSection({
  onOpenRecharge,
  onBrowseDoctors,
}: TeleconsultExplainerSectionProps) {
  const [selectedMinutes, setSelectedMinutes] = useState(10);
  const rate = 15;
  const estimatedCost = selectedMinutes * rate;

  const minutePresets = [5, 10, 15, 20];

  const steps = [
    {
      num: "01",
      icon: Wallet,
      title: "Top-Up Your Health Wallet",
      description:
        "Add ₹50, ₹100 or ₹250 seamlessly using UPI (GPay, PhonePe, Paytm). No monthly subscriptions, zero expiry, zero hidden deductions.",
    },
    {
      num: "02",
      icon: Video,
      title: "1-Click HD Video Consultation",
      description:
        "Tap 'Consult Doctor' to connect directly with Dr. Raees Akhtar over secure, encrypted WebRTC video without hospital waiting lines.",
    },
    {
      num: "03",
      icon: Clock,
      title: "Transparent Per-Minute Billing",
      description:
        "Watch your on-screen live timer and ₹15/min HUD tick in real-time. Cut the call whenever done — pay only for what you actually use.",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-950 text-white relative overflow-hidden">
      {/* Glow decorations */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-10 -z-0 h-[500px] w-[500px] rounded-full bg-emerald-600/20 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-0 left-10 -z-0 h-[400px] w-[400px] rounded-full bg-teal-500/20 blur-3xl pointer-events-none"
      />

      <div className="relative z-10 w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center space-y-4"
        >
          <span className="inline-block rounded-full bg-emerald-800/80 border border-emerald-500/50 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-300 shadow-inner">
            Fair & Transparent Billing
          </span>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Why Pay Fixed ₹500 When You Only Need 5 Minutes?
          </h2>
          <p className="text-base text-emerald-100/85 sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            Traditional hospitals charge high fixed fees for a quick 3-minute report review or follow-up question. At Rehmat Health Care, our ₹15/minute model is fair, transparent, and patient-first.
          </p>
        </motion.div>

        {/* 3 Step Cards */}
        <div className="mt-14 sm:mt-18 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="relative rounded-3xl border border-emerald-800/70 bg-emerald-950/40 p-8 backdrop-blur-xl hover:border-emerald-500/60 shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center shadow-inner">
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="text-4xl font-black text-emerald-700/60">{st.num}</span>
                </div>
                <h3 className="text-xl font-black text-white">{st.title}</h3>
                <p className="mt-3 text-xs text-emerald-200/80 leading-relaxed font-normal">{st.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Interactive Minute & Cost Calculator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 sm:mt-16 rounded-3xl border border-emerald-500/40 bg-gradient-to-tr from-emerald-950/80 via-slate-900 to-teal-950/80 p-6 sm:p-10 shadow-2xl backdrop-blur-xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Calculator Controls */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/40">
                <Calculator className="h-3.5 w-3.5" />
                <span>Interactive Tele-OPD Fee Estimator</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Estimate Your Consultation Fee
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                Select your expected consultation duration. ₹15 is cut per minute in real time. If your call ends in 4 minutes, you pay exactly ₹60.
              </p>

              {/* Minute preset buttons with Motion.dev Sliding Capsule */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                {minutePresets.map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setSelectedMinutes(mins)}
                    className="relative px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <span
                      className={`relative z-10 transition-colors ${
                        selectedMinutes === mins
                          ? "text-slate-950 font-black"
                          : "text-slate-200 hover:text-white"
                      }`}
                    >
                      {mins} Minutes
                    </span>
                    {selectedMinutes === mins ? (
                      <motion.span
                        layoutId="minute-preset-pill"
                        className="absolute inset-0 z-0 rounded-xl bg-emerald-400 shadow-lg shadow-emerald-400/30"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    ) : (
                      <span className="absolute inset-0 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10" />
                    )}
                  </button>
                ))}
              </div>

              {/* Slider */}
              <div className="pt-3 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-400">
                  <span>1 Minute (₹15)</span>
                  <span className="text-emerald-300 font-bold">{selectedMinutes} Minutes</span>
                  <span>30 Minutes (₹450)</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={selectedMinutes}
                  onChange={(e) => setSelectedMinutes(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>
            </div>

            {/* Right: Live Calculation Card with Motion.dev Circular Progress Gauge */}
            <div className="lg:col-span-5 rounded-3xl bg-slate-950/95 border border-emerald-500/40 p-6 text-center space-y-4 shadow-2xl relative overflow-hidden">
              {/* Radial subtle ambient lighting */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Estimated Wallet Deduction
              </span>

              {/* Animated Circular Gauge Meter */}
              <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-slate-800"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-emerald-400"
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    animate={{ strokeDashoffset: 251.2 * (1 - selectedMinutes / 30) }}
                    transition={{ type: "spring", stiffness: 220, damping: 26 }}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black text-white">{selectedMinutes}m</span>
                  <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-extrabold">OPD</span>
                </div>
              </div>

              <div className="text-3xl sm:text-4xl font-black text-emerald-400">
                {formatCurrency(estimatedCost)}
              </div>

              <div className="text-xs text-slate-400">
                Calculation: {selectedMinutes} mins × ₹15/min ={" "}
                <strong className="text-white">{formatCurrency(estimatedCost)}</strong>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Button
                  onClick={onOpenRecharge}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black h-11 rounded-xl shadow-lg shadow-emerald-500/30 text-xs sm:text-sm cursor-pointer active:scale-95"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  <span>Top-Up Wallet ({formatCurrency(estimatedCost)})</span>
                </Button>
                <Button
                  onClick={onBrowseDoctors}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10 font-bold h-10 rounded-xl text-xs cursor-pointer active:scale-95"
                >
                  <Video className="h-4 w-4 mr-2 text-emerald-400" />
                  <span>Start Consultation Now</span>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Comparison Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 sm:mt-16 rounded-3xl border border-emerald-800/70 bg-emerald-950/30 p-5 sm:p-10 backdrop-blur-xl shadow-2xl"
        >
          <h3 className="text-xl sm:text-2xl font-black text-center text-white mb-6 sm:mb-8">
            Compare The Difference
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Traditional OPD */}
            <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-5 sm:p-7 space-y-4">
              <div className="flex items-center gap-2.5 text-rose-400 font-black text-base border-b border-slate-800 pb-3">
                <XCircle className="h-5 w-5 shrink-0" />
                <span>Traditional Hospital & Clinic OPD</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300 font-medium">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Heavy upfront consultation fee (₹400 – ₹800 fixed)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>45 to 90 minutes of crowded waiting room delays</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Full fee charged even if consult lasts only 2 minutes</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Repeated travel and fuel cost for routine test reviews</span>
                </li>
              </ul>
            </div>

            {/* Rehmat Health Care Per-Minute OPD */}
            <div className="rounded-2xl bg-emerald-950/80 border border-emerald-500/40 p-5 sm:p-7 space-y-4 shadow-xl">
              <div className="flex items-center gap-2.5 text-emerald-300 font-black text-base border-b border-emerald-800/80 pb-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                <span>Rehmat Health Care Tele-OPD</span>
              </div>
              <ul className="space-y-3 text-xs text-emerald-100 font-medium">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Pay only <strong>₹15/minute</strong> — 5 mins is just ₹75!</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Zero waiting room delay. Connects directly in seconds</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Top-up anytime via UPI with zero monthly commitments</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Immediate prescription delivery to your WhatsApp & phone</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
