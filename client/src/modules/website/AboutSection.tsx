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
  MapPin,
  Award,
} from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-white relative">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-800">
            About Our Clinic
          </span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Providing Ethical, Compassionate Care in Moradabad
          </h2>
          <p className="text-base text-slate-600 sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Founded by <strong>Dr. Rehmat Ali</strong>, Rehmat Health Care was established to eliminate barriers to high-quality primary medical care for families across Moradabad, Sambhal, Rampur, and western Uttar Pradesh.
          </p>
        </div>

        {/* 2-Column Content */}
        <div className="mt-16 grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12">
          {/* Left Column: Clinic Highlights */}
          <div className="lg:col-span-6 flex flex-col justify-between rounded-3xl bg-slate-50 border border-slate-200/90 p-8 sm:p-10 shadow-sm">
            <div>
              <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-100/80 px-3 py-1 text-xs font-bold text-emerald-800 mb-4">
                <Building className="h-4 w-4" />
                <span>Malviya Nagar Main Road</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                Primary Care & Diagnostic Excellence Under One Roof
              </h3>
              <p className="mt-4 text-sm text-slate-600 leading-relaxed font-normal">
                Located conveniently on Malviya Nagar Main Road, right beside the renowned <strong>Mohan X-Ray & Ultrasound Centre</strong>, our clinic provides seamless patient care. Patients visiting us can receive immediate doctor consultation and undergo necessary diagnostic imaging or laboratory tests in minutes.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-3.5">
                  <div className="h-7 w-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Rapid Diagnosis with Mohan X-Ray Synergy</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Instant coordination for high-resolution digital X-rays, 3D/4D ultrasound, ECG, and pathology blood panels right next door.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="h-7 w-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Fair Per-Minute Tele-OPD</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Zero heavy upfront consultation charges. Consult senior doctors from home at ₹15/min and pay only for actual call minutes used.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="h-7 w-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Digital Prescriptions with QR Verification</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Instantly receive official e-prescriptions on WhatsApp and portal, accepted at any pharmacy in Moradabad.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timings Callout */}
            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-emerald-300 bg-emerald-50/80 p-4">
              <Clock className="h-6 w-6 text-emerald-700 shrink-0" />
              <div className="text-xs text-emerald-950">
                <span className="font-bold">Clinic Walk-in OPD:</span> Mon-Sat 9:00 AM - 2:00 PM & 5:00 PM - 9:00 PM | Sun 10:00 AM - 2:00 PM.
                <br />
                <span className="text-emerald-700 font-extrabold">Virtual Video Consultations: Active 24 Hours.</span>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Feature Grid Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:border-emerald-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="h-14 w-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
                  <Stethoscope className="h-7 w-7" />
                </div>
                <h4 className="text-lg font-black text-slate-900">Experienced Physicians</h4>
                <p className="mt-2.5 text-xs text-slate-600 leading-relaxed font-normal">
                  Led by Dr. Rehmat Ali (MD Medicine) with over 15+ years managing chronic diseases, diabetes, hypertension, and acute infections.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-emerald-700">
                15+ Years Clinical Practice
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:border-blue-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="h-14 w-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5">
                  <Microscope className="h-7 w-7" />
                </div>
                <h4 className="text-lg font-black text-slate-900">Mohan X-Ray Synergy</h4>
                <p className="mt-2.5 text-xs text-slate-600 leading-relaxed font-normal">
                  Direct diagnostic linkage for chest X-Rays, bone scans, abdominal ultrasound, ECG, and pathology investigations right next door.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-blue-700">
                Adjacent Diagnostic Centre
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:border-amber-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="h-14 w-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5">
                  <HeartHandshake className="h-7 w-7" />
                </div>
                <h4 className="text-lg font-black text-slate-900">Patient-Centric Care</h4>
                <p className="mt-2.5 text-xs text-slate-600 leading-relaxed font-normal">
                  We believe in listening patiently, explaining treatment plans clearly in Hindi and Urdu, and avoiding unnecessary medications.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-amber-700">
                Clear Consultation in Urdu/Hindi
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:border-purple-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="h-14 w-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-5">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h4 className="text-lg font-black text-slate-900">Prepaid Health Wallet</h4>
                <p className="mt-2.5 text-xs text-slate-600 leading-relaxed font-normal">
                  Recharge ₹50 or ₹100 via UPI. Pay strictly for consultation minutes used. Zero hidden doctor booking charges.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-purple-700">
                Unused Balance Never Expires
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
