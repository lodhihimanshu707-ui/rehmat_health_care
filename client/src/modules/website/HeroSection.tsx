"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants, useMotionValue, useMotionTemplate } from "framer-motion";
import { siteConfig } from "@/config/site";
import { Button } from "@/shared/ui/button";
import { AnimatedCounter } from "@/shared/ui/animated-counter";
import { PulseBadge } from "@/shared/ui/pulse-badge";
import {
  Video,
  Calendar,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Star,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  Activity,
  HeartPulse,
  MessageSquare,
  Wallet,
  CheckCircle2,
  FileText,
  BadgeCheck,
  Zap,
} from "lucide-react";

interface HeroSectionProps {
  onStartTeleconsult: () => void;
  onBookAppointment: () => void;
}

export function HeroSection({ onStartTeleconsult, onBookAppointment }: HeroSectionProps) {
  // Motion.dev mouse tracking for spotlight card
  const doctorMouseX = useMotionValue(0);
  const doctorMouseY = useMotionValue(0);

  function handleDoctorMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    doctorMouseX.set(e.clientX - left);
    doctorMouseY.set(e.clientY - top);
  }
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/90 via-white to-slate-50/80 pt-6 sm:pt-10 md:pt-14 pb-14 sm:pb-20 lg:pb-24 border-b border-slate-200/80">
      {/* Decorative ambient background glows */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-emerald-300/30 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/3 left-10 -z-10 h-80 w-80 rounded-full bg-teal-300/25 blur-3xl pointer-events-none"
      />

      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        {/* Main Grid */}
        <div className="grid grid-cols-1 items-center gap-8 lg:gap-12 lg:grid-cols-12">
          {/* Left Column: Headlines, USPs & Call to Actions */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-4 sm:space-y-6"
          >
            {/* Top pill badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/90 bg-white/95 px-3.5 sm:px-4 py-1.5 shadow-sm text-[11px] sm:text-xs font-semibold text-emerald-950 backdrop-blur-md">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="font-extrabold text-emerald-900">Dr. Raees Akhtar is Online Now</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700 font-bold truncate">Live Video OPD (₹15/min)</span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]"
            >
              Caring Healthcare For Your Entire Family —{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">
                In-Clinic & 24/7 Online
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-normal max-w-2xl"
            >
              Welcome to <strong>{siteConfig.name}</strong>. Consult chief physician{" "}
              <strong>Dr. Raees Akhtar (MBBS, MD)</strong> directly via encrypted HD video at fair{" "}
              <strong>₹15/min</strong> wallet billing, or walk into our clinic beside Mohan X-Ray in Moradabad for complete OPD & diagnostic checkups.
            </motion.p>

            {/* 2x2 Feature Bento Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Feature 1 */}
              <motion.div
                whileHover={{ y: -3, scale: 1.01 }}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-default"
              >
                <div className="h-10 w-10 rounded-xl bg-emerald-100/90 text-emerald-700 flex items-center justify-center shrink-0 shadow-inner">
                  <Video className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <span>₹15/min Video OPD</span>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800">
                      Live
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                    Fair second-by-second billing. Auto-stop when wallet ends. Zero travel lag.
                  </p>
                </div>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                whileHover={{ y: -3, scale: 1.01 }}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-blue-100 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-default"
              >
                <div className="h-10 w-10 rounded-xl bg-blue-100/90 text-blue-700 flex items-center justify-center shrink-0 shadow-inner">
                  <Activity className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-slate-900">Mohan X-Ray Synergy</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                    Instant access to digital X-rays, 3D/4D ultrasound & CBC blood work next door.
                  </p>
                </div>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                whileHover={{ y: -3, scale: 1.01 }}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-teal-100 shadow-xs hover:border-teal-300 hover:shadow-md transition-all cursor-default"
              >
                <div className="h-10 w-10 rounded-xl bg-teal-100/90 text-teal-700 flex items-center justify-center shrink-0 shadow-inner">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-slate-900">Digital WhatsApp Rx</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                    Legally valid digital prescriptions delivered right to your WhatsApp & phone.
                  </p>
                </div>
              </motion.div>

              {/* Feature 4 */}
              <motion.div
                whileHover={{ y: -3, scale: 1.01 }}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-amber-100 shadow-xs hover:border-amber-300 hover:shadow-md transition-all cursor-default"
              >
                <div className="h-10 w-10 rounded-xl bg-amber-100/90 text-amber-700 flex items-center justify-center shrink-0 shadow-inner">
                  <Wallet className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-slate-900">1-Tap Health Wallet</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                    Top-up via UPI (GPay/PhonePe). No monthly charges. Unused balance stays safe.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
            >
              <Button
                onClick={onStartTeleconsult}
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-xl shadow-emerald-600/30 px-6 h-12 text-xs sm:text-sm font-bold rounded-2xl gap-2 transition-all hover:scale-[1.02] justify-center cursor-pointer active:scale-95"
              >
                <Video className="h-4 w-4 shrink-0" />
                <span>Consult Doctor Online (₹15/min)</span>
                <ArrowRight className="h-4 w-4 opacity-80 shrink-0" />
              </Button>

              <Button
                onClick={onBookAppointment}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-white border-slate-300 hover:bg-slate-50 text-slate-800 px-5 h-12 text-xs sm:text-sm font-bold rounded-2xl gap-2 shadow-xs justify-center cursor-pointer active:scale-95"
              >
                <Calendar className="h-4 w-4 text-emerald-700 shrink-0" />
                <span>Book Clinic OPD Visit</span>
              </Button>

              <a
                href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center justify-center gap-2 px-4 h-12 rounded-2xl text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/80 transition-colors"
              >
                <Phone className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Call Clinic Desk</span>
              </a>
            </motion.div>

            {/* Fast Clinic Location Snapshot */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-3 sm:gap-5 pt-3 text-[11px] sm:text-xs text-slate-600 border-t border-slate-200/80"
            >
              <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                Near Mohan X-Ray, Malviya Nagar Main Rd
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Clock className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                OPD: Mon – Sat 10:00 AM – 7:00 PM
              </span>
              <span className="flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                4.5 ★ Justdial Verified
              </span>
            </motion.div>
          </motion.div>

          {/* Right Column: Doctor Raees Akhtar Spotlight Card */}
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            <motion.div
              onMouseMove={handleDoctorMouseMove}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="group relative rounded-3xl border border-emerald-200/90 bg-white p-5 sm:p-7 shadow-2xl shadow-emerald-900/10 backdrop-blur-xl overflow-hidden"
            >
              {/* Motion.dev Cursor Radial Spotlight Glow */}
              <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-0"
                style={{
                  background: useMotionTemplate`radial-gradient(380px circle at ${doctorMouseX}px ${doctorMouseY}px, rgba(16, 185, 129, 0.15), transparent 80%)`,
                }}
              />
              {/* Doctor Header Badge */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative shrink-0">
                    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 flex items-center justify-center text-white font-black text-2xl sm:text-3xl shadow-lg shadow-emerald-500/25">
                      RA
                    </div>
                    <span
                      className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-200 animate-pulse"
                      title="Dr. Raees Akhtar is Online"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">Dr. Raees Akhtar</h3>
                      <BadgeCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    </div>
                    <p className="text-xs text-emerald-700 font-bold">MBBS, MD (General Medicine)</p>
                    <p className="text-[11px] text-slate-500 font-medium">10+ Years in Healthcare • Moradabad</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-block rounded-xl bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-900 shadow-2xs">
                    ₹15/min
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold mt-1 justify-end">
                    <Star className="h-3 w-3 fill-current text-amber-500" />
                    <span>4.5 ★</span>
                  </div>
                </div>
              </div>

              {/* Consultation Live Status */}
              <div className="my-4 rounded-2xl bg-slate-50/90 border border-slate-100 p-4 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                    Live Video OPD Queue:
                  </span>
                  <span className="font-bold text-emerald-700 bg-emerald-100/90 px-2.5 py-0.5 rounded-full text-[11px]">
                    Instant Connection (0 min wait)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Diagnostic Centre:</span>
                  <span className="font-bold text-slate-800">Mohan X-Ray (Same Premises)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Clinic Timings:</span>
                  <span className="font-bold text-slate-800">Mon – Sat: 10:00 AM – 7:00 PM</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <Button
                  onClick={onStartTeleconsult}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 sm:h-12 rounded-2xl shadow-lg shadow-emerald-600/25 gap-2 text-xs sm:text-sm transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
                >
                  <Video className="h-4 w-4" />
                  <span>Start Live Video Consultation (₹15/min)</span>
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={onBookAppointment}
                    variant="outline"
                    className="border-slate-200 text-slate-700 hover:bg-slate-50 font-bold h-10 rounded-xl text-xs active:scale-95 cursor-pointer"
                  >
                    <Calendar className="h-3.5 w-3.5 mr-1 text-slate-500" />
                    <span>Book In-Clinic</span>
                  </Button>
                  <Link href="/chat" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 font-bold h-10 rounded-xl text-xs active:scale-95 cursor-pointer"
                    >
                      <MessageSquare className="h-3.5 w-3.5 mr-1 text-teal-600" />
                      <span>Chat Online</span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Trust Badge footer */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1 text-emerald-800 font-bold">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  NMC / MCI Registered Doctor
                </span>
                <span className="text-slate-500">Malviya Nagar, Moradabad</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Highlight Stats Row with Animated Number Counters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 sm:mt-14 grid grid-cols-2 gap-3 sm:gap-4 rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-lg shadow-slate-200/40 sm:grid-cols-4"
        >
          <div className="text-center sm:border-r border-slate-100 p-2">
            <p className="text-2xl sm:text-4xl font-black text-emerald-700">
              <AnimatedCounter value={15000} suffix="+" />
            </p>
            <p className="text-[11px] sm:text-xs font-semibold text-slate-600 mt-1">Patients Treated</p>
          </div>
          <div className="text-center sm:border-r border-slate-100 p-2">
            <p className="text-2xl sm:text-4xl font-black text-slate-900">
              <AnimatedCounter value={10} suffix="+ Yrs" />
            </p>
            <p className="text-[11px] sm:text-xs font-semibold text-slate-600 mt-1">Healthcare Trust</p>
          </div>
          <div className="text-center sm:border-r border-slate-100 p-2">
            <p className="text-2xl sm:text-4xl font-black text-emerald-700">
              <AnimatedCounter value={15} prefix="₹" suffix="/m" />
            </p>
            <p className="text-[11px] sm:text-xs font-semibold text-slate-600 mt-1">Live Video OPD</p>
          </div>
          <div className="text-center p-2">
            <p className="text-2xl sm:text-4xl font-black text-amber-500">
              <AnimatedCounter value={4.5} suffix=" ★" decimals={1} />
            </p>
            <p className="text-[11px] sm:text-xs font-semibold text-slate-600 mt-1">Justdial Verified</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
