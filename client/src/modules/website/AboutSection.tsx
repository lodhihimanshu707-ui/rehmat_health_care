"use client";

import React from "react";
import { siteConfig } from "@/config/site";
import {
  HeartHandshake,
  Stethoscope,
  Microscope,
  FileCheck,
  ShieldCheck,
  Building,
  CheckCircle,
  Clock,
  Sparkles,
} from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-20 bg-white">
      <div className="mx-auto  px-4 sm:px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
            About Our Clinic
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Providing Ethical, Compassionate Care in Moradabad
          </h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Founded by <strong>Dr. Rehmat Ali</strong>, Rehmat Health Care was established to eliminate barriers to high-quality primary medical care for families across Moradabad, Sambhal, Rampur, and western Uttar Pradesh.
          </p>
        </div>

        {/* 2-Column Content */}
        <div className="mt-14 grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Column: Clinic Highlights */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-slate-900">
                Primary Care & Diagnostic Excellence Under One Roof
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Located conveniently on Malviya Nagar Main Road, right next to the esteemed <strong>Mohan X-Ray & Ultrasound Centre</strong>, our clinic provides seamless patient care. Patients visiting us can receive immediate doctor consultation and undergo necessary diagnostic imaging or laboratory tests in minutes.
              </p>

              <div className="mt-6 space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Rapid Diagnosis & Care</h4>
                    <p className="text-xs text-slate-500">
                      Fast coordination with Mohan X-Ray for digital radiography, 3D/4D ultrasound, and blood panels.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Fair Per-Minute Tele-OPD</h4>
                    <p className="text-xs text-slate-500">
                      No heavy upfront consultation fees. Consult our doctors from home at ₹15/min and pay only for actual call duration.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Digital Prescriptions with QR Verification</h4>
                    <p className="text-xs text-slate-500">
                      Instantly receive official e-prescriptions on WhatsApp and portal, accepted at any pharmacy in Moradabad.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timings Callout */}
            <div className="flex items-center gap-4 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
              <Clock className="h-6 w-6 text-emerald-700 shrink-0" />
              <div className="text-xs text-emerald-950">
                <span className="font-bold">Clinic Walk-in OPD:</span> Mon-Sat 9:00 AM - 2:00 PM & 5:00 PM - 9:00 PM | Sun 10:00 AM - 2:00 PM.
                <br />
                <span className="text-emerald-700 font-semibold">Virtual Video Consultations: Active 24 Hours.</span>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Feature Grid Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Stethoscope className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Experienced Physicians</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Led by Dr. Rehmat Ali (MD Medicine) with over 15+ years managing chronic diseases, diabetes, hypertension, and acute infections.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <Microscope className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Mohan X-Ray Synergy</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Direct diagnostic linkage for chest X-Rays, bone scans, abdominal ultrasound, ECG, and pathology investigations right next door.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Patient-Centric Care</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                We believe in listening patiently, explaining treatment plans clearly in Hindi and Urdu, and avoiding unnecessary medications.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Prepaid Digital Health Wallet</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Recharge ₹50 or ₹100 via UPI. Pay strictly for consultation minutes used. Zero hidden doctor booking charges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
