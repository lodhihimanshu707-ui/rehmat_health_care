"use client";

import React from "react";
import { siteConfig } from "@/config/site";
import { Button } from "@/shared/ui/button";
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
  CheckCircle2,
  Activity,
  HeartPulse,
} from "lucide-react";

interface HeroSectionProps {
  onStartTeleconsult: () => void;
  onBookAppointment: () => void;
}

export function HeroSection({ onStartTeleconsult, onBookAppointment }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-slate-50/80 pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200/80">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-emerald-200/30 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 -z-10 h-[400px] w-[400px] rounded-full bg-teal-200/20 blur-3xl pointer-events-none" />

      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white/95 px-4 py-1.5 shadow-sm text-xs font-semibold text-emerald-900 backdrop-blur-sm">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-emerald-800">{siteConfig.urduName}</span>
              <span className="text-slate-300">•</span>
              <span>10 Years in Healthcare (Est. 2016)</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-bold">Near Mohan Xray, Malviya Nagar</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.18]">
              Trusted Healthcare For Your Entire Family —{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">
                In-Clinic & 24/7 Online
              </span>
            </h1>

            {/* Subtitle / Description */}
            <p className="text-base text-slate-600 sm:text-lg leading-relaxed max-w-3xl font-normal">
              Welcome to <strong>Rehmat Health Care</strong>. Consult our verified senior physicians online with transparent <strong>₹15/min</strong> wallet billing from the comfort of home, or visit our primary care clinic beside Mohan X-Ray in Moradabad for routine OPD and diagnostic checkups.
            </p>

            {/* Key USPs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs text-slate-700 font-semibold">
              <div className="flex items-center gap-2.5 bg-white/80 border border-slate-200/70 p-2.5 rounded-xl shadow-2xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Fair Per-Minute Video OPD (Starts at ₹15/min)</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/80 border border-slate-200/70 p-2.5 rounded-xl shadow-2xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Instant QR Prescriptions on WhatsApp</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/80 border border-slate-200/70 p-2.5 rounded-xl shadow-2xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Walk-in OPD & Mohan X-Ray Diagnostic Synergy</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/80 border border-slate-200/70 p-2.5 rounded-xl shadow-2xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Prepaid Health Wallet — Credits Never Expire</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Button
                onClick={onStartTeleconsult}
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 px-6 h-12 text-sm font-bold rounded-xl gap-2 transition-all hover:scale-[1.02]"
              >
                <Video className="h-4 w-4" />
                <span>Consult Doctor Online</span>
                <ArrowRight className="h-4 w-4 opacity-80" />
              </Button>

              <Button
                onClick={onBookAppointment}
                variant="outline"
                size="lg"
                className="bg-white border-slate-300 hover:bg-slate-50 text-slate-800 px-5 h-12 text-sm font-bold rounded-xl gap-2 shadow-2xs"
              >
                <Calendar className="h-4 w-4 text-slate-600" />
                <span>Book Clinic Visit</span>
              </Button>

              <a
                href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 px-4 h-12 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/80 transition-colors"
              >
                <Phone className="h-4 w-4 text-emerald-600" />
                <span>Call Clinic</span>
              </a>
            </div>

            {/* Fast Clinic Location Snapshot */}
            <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-slate-600 border-t border-slate-200/80">
              <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
                {siteConfig.landmark}, Moradabad
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Clock className="h-4 w-4 text-emerald-600 shrink-0" />
                Clinic OPD: Mon – Sat 10:00 AM – 7:00 PM
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                4.5 ★ Justdial Verified
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Clinic Card & Live Doctor Showcase */}
          <div className="lg:col-span-5 relative">
            {/* Visual Healthcare Card */}
            <div className="relative rounded-3xl border border-emerald-200/80 bg-white p-7 shadow-xl shadow-slate-200/70">
              {/* Doctor Header Badge */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-md">
                      RA
                    </div>
                    <span
                      className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-100 animate-pulse"
                      title="Doctor Online Now"
                    />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">Dr. Raees Akhtar</h3>
                    <p className="text-xs text-emerald-700 font-bold">MBBS, MD (General Medicine)</p>
                    <p className="text-[11px] text-slate-500 font-medium">Chief Medical Consultant • 10+ Yrs Exp (Est. 2016)</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-900">
                    ₹15 / min
                  </span>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-1 justify-end">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span>4.5 (8+ Justdial Reviews)</span>
                  </div>
                </div>
              </div>

              {/* Consultation Live Status */}
              <div className="my-5 rounded-2xl bg-slate-50/90 border border-slate-100 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                    Live Video OPD Queue:
                  </span>
                  <span className="font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                    0 min wait time
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Video Encryption:</span>
                  <span className="font-bold text-slate-800">HD WebRTC Encrypted</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Next In-Clinic Slot:</span>
                  <span className="font-bold text-slate-800">Today, 5:30 PM (Malviya Nagar)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <Button
                  onClick={onStartTeleconsult}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-xl shadow-md gap-2 text-sm transition-all hover:scale-[1.01]"
                >
                  <Video className="h-4 w-4" />
                  <span>Start Instant Video Call (₹15/min)</span>
                </Button>
                <Button
                  onClick={onBookAppointment}
                  variant="outline"
                  className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 font-bold h-11 rounded-xl text-xs"
                >
                  Book Walk-in Clinic Slot
                </Button>
              </div>

              {/* Trust Badge footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  NMC / MCI Registered
                </span>
                <span>Near Mohan X-Ray, Moradabad</span>
              </div>
            </div>

            {/* Floating Trust Card */}
            <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3.5 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xl backdrop-blur-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-900">15,000+ Consultations</p>
                <p className="text-[11px] text-slate-500 font-medium">Serving Moradabad families since 2011</p>
              </div>
            </div>
          </div>
        </div>

        {/* Highlight Stats Row */}
        <div className="mt-16 grid grid-cols-2 gap-4 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm sm:grid-cols-4">
          <div className="text-center sm:border-r border-slate-100 last:border-0 p-2">
            <p className="text-2xl sm:text-3xl font-black text-emerald-700">{siteConfig.stats.patientsServed}</p>
            <p className="text-xs font-semibold text-slate-600 mt-1">Patients Treated</p>
          </div>
          <div className="text-center sm:border-r border-slate-100 last:border-0 p-2">
            <p className="text-2xl sm:text-3xl font-black text-slate-900">{siteConfig.stats.yearsInHealthcare}</p>
            <p className="text-xs font-semibold text-slate-600 mt-1">In Healthcare (Est. 2016)</p>
          </div>
          <div className="text-center sm:border-r border-slate-100 last:border-0 p-2">
            <p className="text-2xl sm:text-3xl font-black text-emerald-700">₹15/min</p>
            <p className="text-xs font-semibold text-slate-600 mt-1">Transparent Teleconsult Fee</p>
          </div>
          <div className="text-center p-2">
            <p className="text-2xl sm:text-3xl font-black text-amber-500">{siteConfig.stats.rating}</p>
            <p className="text-xs font-semibold text-slate-600 mt-1">Justdial Rating (Claimed)</p>
          </div>
        </div>
      </div>
    </section>
  );
}
