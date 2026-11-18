"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Stethoscope,
  Heart,
  Baby,
  Activity,
  Video,
  FileText,
  ArrowRight,
  Shield,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/shared/ui/button";

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
}

export function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const services = [
    {
      icon: Stethoscope,
      iconColor: "text-emerald-700 bg-emerald-100/90 border-emerald-200",
      tag: "Primary Medicine",
      title: "General Medicine & Chronic Care",
      leadDoctor: "Dr. Raees Akhtar, MBBS, MD",
      description:
        "Comprehensive diagnosis and long-term control of Type-2 Diabetes, Hypertension, Thyroid, seasonal viral fevers, respiratory infections, and digestive ailments.",
      features: ["Diabetes & BP Control", "Fever & Infection Workup", "Preventive Health Screening"],
      price: "₹15 / min online",
    },
    {
      icon: Heart,
      iconColor: "text-rose-700 bg-rose-100/90 border-rose-200",
      tag: "Family Care",
      title: "Family Practice & Wellness",
      leadDoctor: "Dr. Raees Akhtar, MBBS, MD",
      description:
        "Holistic healthcare for children, adults, and elderly family members. Routine health checkups, geriatric medication reviews, and lifestyle management.",
      features: ["Family Health Consultation", "Geriatric & Adult Care", "Preventive Health Advice"],
      price: "₹15 / min online",
    },
    {
      icon: Baby,
      iconColor: "text-amber-700 bg-amber-100/90 border-amber-200",
      tag: "Infection Care",
      title: "Seasonal Fevers & Infections",
      leadDoctor: "Dr. Raees Akhtar, MBBS, MD",
      description:
        "Prompt medical diagnosis for seasonal viral fevers, typhoid, dengue, acute cough, flu, gastrointestinal infections, and pediatric fever relief.",
      features: ["Rapid Viral & Fever Workup", "Antibiotic Stewardship", "Emergency Referral Support"],
      price: "₹15 / min online",
    },
    {
      icon: Activity,
      iconColor: "text-blue-700 bg-blue-100/90 border-blue-200",
      tag: "Diagnostic Partner",
      title: "Diagnostics & Mohan X-Ray Synergy",
      leadDoctor: "Mohan X-Ray & Ultrasound Centre",
      description:
        "Direct diagnostic synergy with Mohan X-Ray right next door: High-resolution digital X-rays, 3D/4D ultrasound, ECG, Lipid profiles, HbA1c, and complete blood panels.",
      features: ["Same-Day Digital X-Ray", "Color Doppler & Sonography", "Fasting Blood Sugar & CBC"],
      price: "In-Clinic / Mohan X-Ray",
    },
    {
      icon: Video,
      iconColor: "text-teal-700 bg-teal-100/90 border-teal-200",
      tag: "24/7 Digital OPD",
      title: "Live Video Teleconsultation",
      leadDoctor: "Virtual OPD on Duty",
      description:
        "Consult directly with senior doctor over encrypted WebRTC video. Zero appointment queues, transparent per-minute wallet billing, and live duration HUD.",
      features: ["Starts at ₹15/min only", "Encrypted HD Video & Audio", "Integrated In-Call Messaging"],
      price: "Pay Per Minute",
    },
    {
      icon: FileText,
      iconColor: "text-purple-700 bg-purple-100/90 border-purple-200",
      tag: "Prescription Desk",
      title: "E-Prescriptions & Follow-ups",
      leadDoctor: "Rehmat Health Digital Desk",
      description:
        "Receive signed digital prescriptions with dosage regimens instantly on your phone. Easy 1-click refills and follow-up reviews without travelling in Moradabad traffic.",
      features: ["Accepted at all Pharmacies", "WhatsApp & PDF Download", "Prescription Archive"],
      price: "Included with Consult",
    },
  ];

  return (
    <section id="services" className="py-20 sm:py-28 bg-slate-50 border-y border-slate-200/90 relative overflow-hidden">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center space-y-4"
        >
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-800">
            Clinical Specialities
          </span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Specialized Care & Diagnostics
          </h2>
          <p className="text-base text-slate-600 sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            Whether consulting from home via HD video or visiting our Malviya Nagar clinic beside Mohan X-Ray, get immediate, personalized treatment.
          </p>
        </motion.div>

        {/* 6 Services Grid */}
        <div className="mt-14 sm:mt-18 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`h-12 w-12 rounded-2xl flex items-center justify-center border shadow-xs ${svc.iconColor}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                      {svc.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-xs font-bold text-emerald-800 mt-1">{svc.leadDoctor}</p>

                  <p className="mt-3 text-xs text-slate-600 leading-relaxed font-normal">
                    {svc.description}
                  </p>

                  <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                    {svc.features.map((feat, fi) => (
                      <li key={fi} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">{svc.price}</span>
                  <Button
                    onClick={() => onSelectService(svc.title)}
                    size="sm"
                    className="bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white font-bold text-xs rounded-xl h-8 px-3 gap-1 shadow-2xs transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Consult</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
