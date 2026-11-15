"use client";

import React from "react";
import { Doctor } from "@/modules/doctors/types";
import { Button } from "@/shared/ui/button";
import {
  Video,
  MessageSquare,
  Calendar,
  Star,
  Clock,
  Award,
  Sparkles,
  CheckCircle,
  ShieldCheck,
  Stethoscope,
  MapPin,
  HeartPulse,
  Activity,
} from "lucide-react";
import { formatCurrency } from "@/shared/utils/format";

interface DoctorsSectionProps {
  doctors: Doctor[];
  isLoading: boolean;
  onCallDoctor: (doctor: Doctor) => void;
  onChatDoctor: (doctor: Doctor) => void;
  onBookClinicVisit: (doctor: Doctor) => void;
}

export function DoctorsSection({
  doctors,
  isLoading,
  onCallDoctor,
  onChatDoctor,
  onBookClinicVisit,
}: DoctorsSectionProps) {
  // Sole Doctor: Dr. Raees Akhtar
  const soleDoctor: Doctor = (doctors && doctors.length > 0)
    ? doctors[0]
    : {
        id: "b2000000-0000-0000-0000-000000000001",
        userId: "b1000000-0000-0000-0000-000000000001",
        specialization: "General Physician & Family Medicine",
        qualifications: "MBBS, MD (General Medicine)",
        experienceYears: 10,
        clinicName: "Rehmat Health Care (Malviya Nagar)",
        ratePerMinute: 15,
        isOnline: true,
        isBusy: false,
        rating: 4.5,
        about:
          "Chief Medical Consultant at Rehmat Health Care, Malviya Nagar, Moradabad. 10+ years dedicated experience in general medicine, seasonal infections, diabetes, hypertension, and primary healthcare.",
        user: {
          id: "b1000000-0000-0000-0000-000000000001",
          name: "Dr. Raees Akhtar",
          email: "dr.raees@rehmathealthcare.com",
          phone: "+91 98370 12345",
        },
      };

  return (
    <section id="doctors" className="py-20 sm:py-28 bg-white relative">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-800">
            Resident Physician
          </span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Meet Our Chief Doctor
          </h2>
          <p className="text-base text-slate-600 sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            Dr. Raees Akhtar leads Rehmat Health Care, providing trusted primary medical care, in-clinic consultations in Malviya Nagar, and 24/7 video OPD with transparent per-minute billing.
          </p>
        </div>

        {/* Featured Sole Doctor Showcase Card */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="rounded-3xl border border-emerald-200/90 bg-gradient-to-b from-white via-slate-50/60 to-emerald-50/30 p-8 sm:p-12 shadow-xl shadow-slate-200/60 hover:shadow-2xl transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Doctor Profile & Credentials */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-start gap-5">
                  <div className="relative">
                    <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-3xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 flex items-center justify-center text-white font-black text-3xl sm:text-4xl shadow-lg shadow-emerald-500/25">
                      RA
                    </div>
                    <span
                      className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white ring-2 ring-emerald-100 ${
                        soleDoctor.isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                      }`}
                      title={soleDoctor.isOnline ? "Dr. Raees Akhtar is Online" : "Offline"}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                        {soleDoctor.user.name}
                      </h3>
                      <span title="Verified Medical Practitioner">
                        <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                      </span>
                    </div>
                    <p className="text-sm font-bold text-emerald-700">
                      {soleDoctor.qualifications}
                    </p>
                    <p className="text-xs font-semibold text-slate-500">
                      Chief Medical Officer • General Physician Doctors
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
                      <span className="flex items-center gap-1 rounded-xl bg-amber-50 px-3 py-1 font-bold text-amber-800 border border-amber-200/80">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        4.5 ★ (8 Ratings, Justdial Claimed)
                      </span>
                      <span className="flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1 font-bold text-slate-700">
                        <Award className="h-3.5 w-3.5 text-slate-600" />
                        10 Years in Healthcare (Est. 2016)
                      </span>
                    </div>
                  </div>
                </div>

                {/* About Doctor */}
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  "{soleDoctor.about}"
                </p>

                {/* Clinical Focus Badges */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Clinical Focus & Services
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="rounded-xl bg-emerald-100/80 text-emerald-900 px-3 py-1">
                      General Medicine & Primary Care
                    </span>
                    <span className="rounded-xl bg-emerald-100/80 text-emerald-900 px-3 py-1">
                      Seasonal Fevers, Dengue & Viral Workup
                    </span>
                    <span className="rounded-xl bg-emerald-100/80 text-emerald-900 px-3 py-1">
                      Diabetes & Hypertension Management
                    </span>
                    <span className="rounded-xl bg-emerald-100/80 text-emerald-900 px-3 py-1">
                      Mohan X-Ray Diagnostic Coordination
                    </span>
                    <span className="rounded-xl bg-emerald-100/80 text-emerald-900 px-3 py-1">
                      Digital WhatsApp Prescriptions
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Tele-OPD & Booking Widget */}
              <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Consultation Rate
                    </span>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-900">
                      ₹15 / minute
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Clinic OPD Hours:</span>
                      <span className="font-bold text-slate-800">Mon – Sat 10:00 AM – 7:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Teleconsult OPD:</span>
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> 24/7 Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Location:</span>
                      <span className="font-bold text-slate-800">Near Mohan Xray, Malviya Nagar</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Billing Model:</span>
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        Pay-per-minute via Health Wallet
                      </span>
                    </div>
                  </div>
                </div>

                {/* Call to action buttons */}
                <div className="space-y-3 pt-2">
                  <Button
                    onClick={() => onCallDoctor(soleDoctor)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-xl shadow-md gap-2 transition-all hover:scale-[1.01]"
                  >
                    <Video className="h-4 w-4" />
                    <span>Start Video Call Now (₹15/min)</span>
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => onChatDoctor(soleDoctor)}
                      variant="outline"
                      className="border-slate-200 text-slate-700 hover:bg-slate-50 h-10 rounded-xl text-xs gap-1.5 font-bold"
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-slate-600" />
                      <span>Chat with Doctor</span>
                    </Button>

                    <Button
                      onClick={() => onBookClinicVisit(soleDoctor)}
                      variant="outline"
                      className="border-slate-200 text-slate-700 hover:bg-slate-50 h-10 rounded-xl text-xs gap-1.5 font-bold"
                    >
                      <Calendar className="h-3.5 w-3.5 text-slate-600" />
                      <span>Book Walk-in Slot</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}