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
} from "lucide-react";

interface HeroSectionProps {
  onStartTeleconsult: () => void;
  onBookAppointment: () => void;
}

export function HeroSection({ onStartTeleconsult, onBookAppointment }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/80 via-white to-slate-50 pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200/70">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 -z-10 h-72 w-72 rounded-full bg-teal-200/25 blur-3xl pointer-events-none" />

      <div className="mx-auto  px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white/90 px-3.5 py-1.5 shadow-sm text-xs font-medium text-emerald-800 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{siteConfig.urduName}</span>
              <span className="text-slate-300">•</span>
              <span className="font-semibold text-emerald-900">Malviya Nagar, Moradabad</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700">Near Mohan X-Ray</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl lg:leading-tight">
              Trusted Healthcare For Your Family —{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">
                In-Clinic & 24/7 Online
              </span>
            </h1>

            {/* Description */}
            <p className="text-base text-slate-600 sm:text-lg leading-relaxed max-w-2xl">
              Welcome to <strong>Rehmat Health Care</strong>. Whether you need an immediate video consultation with senior physicians from the comfort of home or a walk-in visit to our modern clinic near Mohan X-Ray in Moradabad, we provide compassionate and affordable medical care.
            </p>

            {/* Key USPs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Fair Per-Minute Video OPD (Starts at ₹15/min)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Instant Digital Prescriptions on WhatsApp</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Walk-in OPD & Pathology (Mohan X-Ray partner)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Prepaid Wallet — Unused credits never expire</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                onClick={onStartTeleconsult}
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 px-6 h-12 text-sm font-semibold rounded-xl gap-2 transition-all hover:scale-[1.02]"
              >
                <Video className="h-4 w-4" />
                <span>Consult Doctor Online</span>
                <ArrowRight className="h-4 w-4 opacity-80" />
              </Button>

              <Button
                onClick={onBookAppointment}
                variant="outline"
                size="lg"
                className="border-slate-300 hover:bg-slate-100 text-slate-800 px-5 h-12 text-sm font-semibold rounded-xl gap-2"
              >
                <Calendar className="h-4 w-4 text-slate-600" />
                <span>Book Clinic Visit</span>
              </Button>

              <a
                href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 px-4 h-12 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                <Phone className="h-4 w-4 text-emerald-600" />
                <span>Call Clinic</span>
              </a>
            </div>

            {/* Fast Clinic Location Snapshot */}
            <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-slate-500 border-t border-slate-200/70">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
                {siteConfig.landmark}, Moradabad
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <Clock className="h-4 w-4 text-emerald-600 shrink-0" />
                Clinic OPD: 9:00 AM – 9:00 PM
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Clinic Card & Live Doctor Showcase */}
          <div className="lg:col-span-5 relative">
            {/* Visual Healthcare Card */}
            <div className="relative rounded-2xl border border-emerald-100 bg-white p-6 shadow-xl shadow-slate-200/60">
              {/* Doctor Header Badge */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                      RA
                    </div>
                    <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white" title="Doctor Online Now" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Dr. Rehmat Ali</h3>
                    <p className="text-xs text-emerald-700 font-semibold">MBBS, MD (General Medicine)</p>
                    <p className="text-[11px] text-slate-500">Chief Medical Consultant • 15+ Yrs Exp</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                    ₹15 / min
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mt-1 justify-end">
                    <Star className="h-3 w-3 fill-current" />
                    <span>4.9 (420+ reviews)</span>
                  </div>
                </div>
              </div>

              {/* Consultation Live Status */}
              <div className="my-5 rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                    Live Video OPD Queue:
                  </span>
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">0 min wait time</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Audio/Video Quality:</span>
                  <span className="font-medium text-slate-800">HD WebRTC Encrypted</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Next Clinic OPD Slot:</span>
                  <span className="font-medium text-slate-800">Today, 5:30 PM (Malviya Nagar)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <Button
                  onClick={onStartTeleconsult}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-11 rounded-xl shadow-md gap-2"
                >
                  <Video className="h-4 w-4" />
                  <span>Start Instant Video Call (₹15/min)</span>
                </Button>
                <Button
                  onClick={onBookAppointment}
                  variant="outline"
                  className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 font-medium h-10 rounded-xl"
                >
                  Book Walk-in Clinic Slot
                </Button>
              </div>

              {/* Trust Badge footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  MCI / NMC Registered
                </span>
                <span>Near Mohan X-Ray, Moradabad</span>
              </div>
            </div>

            {/* Floating Trust Card */}
            <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white/95 p-3.5 shadow-lg backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">15,000+ Consultations</p>
                <p className="text-[11px] text-slate-500">Serving Moradabad families since 2011</p>
              </div>
            </div>
          </div>
        </div>

        {/* Highlight Stats Row */}
        <div className="mt-16 grid grid-cols-2 gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:grid-cols-4">
          <div className="text-center sm:border-r border-slate-100 last:border-0 p-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700">{siteConfig.stats.patientsServed}</p>
            <p className="text-xs font-medium text-slate-600 mt-1">Patients Treated</p>
          </div>
          <div className="text-center sm:border-r border-slate-100 last:border-0 p-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{siteConfig.stats.yearsService}</p>
            <p className="text-xs font-medium text-slate-600 mt-1">Years of Clinical Trust</p>
          </div>
          <div className="text-center sm:border-r border-slate-100 last:border-0 p-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700">₹15/min</p>
            <p className="text-xs font-medium text-slate-600 mt-1">Transparent Teleconsult Fee</p>
          </div>
          <div className="text-center p-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-500">4.9 / 5.0</p>
            <p className="text-xs font-medium text-slate-600 mt-1">Patient Satisfaction Rating</p>
          </div>
        </div>
      </div>
    </section>
  );
}
