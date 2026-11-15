"use client";

import React from "react";
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
      leadDoctor: "Dr. Rehmat Ali, MBBS, MD",
      description:
        "Comprehensive diagnosis and long-term management of Diabetes, Hypertension, Thyroid disorders, seasonal fevers, respiratory tract infections, and digestive ailments.",
      features: ["Diabetes & BP Control", "Fever & Infection Workup", "Preventive Health Screening"],
      price: "₹15 / min online",
    },
    {
      icon: Heart,
      iconColor: "text-rose-700 bg-rose-100/90 border-rose-200",
      tag: "Women's Health",
      title: "Gynecology & Obstetric Care",
      leadDoctor: "Dr. Sana Khan, MBBS, MS",
      description:
        "Dedicated and confidential care for women across all stages of life, including prenatal guidance, PCOD/PCOS hormonal management, antenatal care, and menopausal wellness.",
      features: ["PCOD & Infertility Guidance", "Pregnancy & Trimester Care", "Pelvic Health & Wellness"],
      price: "₹18 / min online",
    },
    {
      icon: Baby,
      iconColor: "text-amber-700 bg-amber-100/90 border-amber-200",
      tag: "Pediatrics",
      title: "Pediatrics & Child Wellness",
      leadDoctor: "Dr. Tariq Mansoor, MBBS, DCH",
      description:
        "Specialized pediatric consultations for newborns, toddlers, and adolescents. Growth monitoring, childhood vaccinations, allergic cough, diarrhea, and fever care.",
      features: ["Vaccination Schedules", "Child Nutrition & Growth", "Pediatric Emergency Advice"],
      price: "₹12 / min online",
    },
    {
      icon: Activity,
      iconColor: "text-blue-700 bg-blue-100/90 border-blue-200",
      tag: "Diagnostic Partner",
      title: "Diagnostics & Mohan X-Ray Synergy",
      leadDoctor: "Radiology & Pathology Desk",
      description:
        "Coordinated diagnostic testing with Mohan X-Ray right next door: High-resolution digital X-Rays, 3D/4D ultrasound, ECG, Lipid profiles, HbA1c, and complete CBC panels.",
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
        "Speak directly with qualified Moradabad doctors over encrypted WebRTC video. Zero appointment queues, transparent per-minute wallet billing, and live duration HUD.",
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
    <section id="services" className="py-20 sm:py-28 bg-slate-50 border-y border-slate-200/90">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-800">
            Clinical Specialities
          </span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Complete Medical Services for Every Need
          </h2>
          <p className="text-base text-slate-600 sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            From routine checkups to specialized gynecological and pediatric care, our experienced medical team is here for you in-clinic in Malviya Nagar and online.
          </p>
        </div>

        {/* Services Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-8 shadow-sm hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`h-14 w-14 rounded-2xl border flex items-center justify-center ${svc.iconColor} shadow-2xs`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200/70">
                      {svc.price}
                    </span>
                  </div>

                  <span className="mt-5 inline-block text-[11px] font-black uppercase tracking-wider text-emerald-700">
                    {svc.tag}
                  </span>

                  <h3 className="mt-1 text-xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-xs font-bold text-slate-500 mt-1">{svc.leadDoctor}</p>
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed font-normal">{svc.description}</p>

                  <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                    {svc.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100">
                  <Button
                    onClick={() => onSelectService(svc.title)}
                    variant="ghost"
                    className="w-full justify-between text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 h-10 rounded-xl"
                  >
                    <span>Consult for {svc.title.split("&")[0].trim()}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
