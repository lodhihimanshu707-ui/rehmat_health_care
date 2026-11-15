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
} from "lucide-react";
import { Button } from "@/shared/ui/button";

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
}

export function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const services = [
    {
      icon: Stethoscope,
      iconColor: "text-emerald-700 bg-emerald-100",
      title: "General Medicine & Chronic Diseases",
      leadDoctor: "Dr. Rehmat Ali, MBBS, MD",
      description:
        "Comprehensive diagnosis and long-term management of Diabetes, Hypertension, Thyroid disorders, seasonal fevers, respiratory tract infections, and digestive ailments.",
      features: ["Diabetes & BP Control", "Fever & Infection Workup", "Preventive Health Screening"],
      price: "₹15 / min online",
    },
    {
      icon: Heart,
      iconColor: "text-rose-700 bg-rose-100",
      title: "Gynecology & Women's Health",
      leadDoctor: "Dr. Sana Khan, MBBS, MS",
      description:
        "Dedicated and confidential care for women across all stages of life, including prenatal guidance, PCOD/PCOS hormonal management, antenatal care, and menopausal wellness.",
      features: ["PCOD & Infertility Guidance", "Pregnancy & Trimester Care", "Pelvic Health & Wellness"],
      price: "₹18 / min online",
    },
    {
      icon: Baby,
      iconColor: "text-amber-700 bg-amber-100",
      title: "Pediatrics & Child Care",
      leadDoctor: "Dr. Tariq Mansoor, MBBS, DCH",
      description:
        "Specialized pediatric consultations for newborns, toddlers, and adolescents. Growth monitoring, childhood vaccinations, allergic cough, diarrhea, and fever care.",
      features: ["Vaccination Schedules", "Child Nutrition & Growth", "Pediatric Emergency Advice"],
      price: "₹12 / min online",
    },
    {
      icon: Activity,
      iconColor: "text-blue-700 bg-blue-100",
      title: "Diagnostics (Mohan X-Ray Partner)",
      leadDoctor: "Radiology & Pathology Desk",
      description:
        "Coordinated diagnostic testing with Mohan X-Ray right next door: High-resolution digital X-Rays, 3D/4D ultrasound, ECG, Lipid profiles, HbA1c, and complete CBC panels.",
      features: ["Same-Day Digital X-Ray", "Color Doppler & Sonography", "Fasting Blood Sugar & CBC"],
      price: "In-Clinic / Mohan X-Ray",
    },
    {
      icon: Video,
      iconColor: "text-teal-700 bg-teal-100",
      title: "24/7 Live Video Teleconsultation",
      leadDoctor: "Virtual OPD on Duty",
      description:
        "Speak directly with qualified Moradabad doctors over encrypted WebRTC video. Zero appointment queues, transparent per-minute wallet billing, and live duration HUD.",
      features: ["Starts at ₹15/min only", "Encrypted HD Video & Audio", "Integrated In-Call Messaging"],
      price: "Pay Per Minute",
    },
    {
      icon: FileText,
      iconColor: "text-purple-700 bg-purple-100",
      title: "E-Prescriptions & Follow-ups",
      leadDoctor: "Rehmat Health Digital Desk",
      description:
        "Receive signed digital prescriptions with dosage regimens instantly on your phone. Easy 1-click refills and follow-up reviews without travelling in Moradabad traffic.",
      features: ["Accepted at all Pharmacies", "WhatsApp & PDF Download", "Prescription Archive"],
      price: "Included with Consult",
    },
  ];

  return (
    <section id="services" className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
            Clinical Specialities
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Complete Medical Services for Every Need
          </h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            From routine checkups to specialized gynecological and pediatric care, our experienced medical team is here for you in-clinic in Malviya Nagar and online.
          </p>
        </div>

        {/* Services Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${svc.iconColor}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {svc.price}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-800 mt-1">{svc.leadDoctor}</p>
                  <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">{svc.description}</p>

                  <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
                    {svc.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Button
                    onClick={() => onSelectService(svc.title)}
                    variant="ghost"
                    className="w-full justify-between text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 h-9"
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

