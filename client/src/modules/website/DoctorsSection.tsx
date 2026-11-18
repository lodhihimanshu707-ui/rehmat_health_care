"use client";

import React from "react";
import { Doctor } from "@/modules/doctors/types";
import { Button } from "@/shared/ui/button";
import {
  Video,
  MessageSquare,
  Calendar,
  Star,
  Award,
  Sparkles,
  ShieldCheck,
  Stethoscope,
  MapPin,
  Clock,
  HeartPulse,
  Activity,
  CheckCircle2,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { motion } from "framer-motion";

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
          "Chief Medical Officer at Rehmat Health Care, Malviya Nagar, Moradabad. 10+ years of dedicated clinical practice in general medicine, viral fevers, hypertension, type-2 diabetes, and geriatric care.",
        user: {
          id: "b1000000-0000-0000-0000-000000000001",
          name: "Dr. Raees Akhtar",
          email: "dr.raees@rehmathealthcare.com",
          phone: "+91 98370 12345",
        },
      };

  return (
    <section id="doctors" className="py-24 sm:py-32 bg-slate-50 relative overflow-hidden">
      {/* Background radial lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-emerald-100/40 via-teal-100/30 to-blue-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-800 border border-emerald-200">
            <Stethoscope className="h-3.5 w-3.5 text-emerald-700" />
            <span>Chief Medical Officer Desk</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Meet Your Trusted Resident Doctor
          </h2>
          <p className="text-base text-slate-600 sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            Direct, personal consultation with <strong>Dr. Raees Akhtar</strong> — available for walk-in OPD at Malviya Nagar and 24/7 video consultations with real-time ₹15/min wallet billing.
          </p>
        </motion.div>

        {/* Featured Doctor Showcase Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-14 max-w-5xl mx-auto"
        >
          <div className="rounded-3xl border border-emerald-200/90 bg-white p-6 sm:p-10 md:p-12 shadow-xl shadow-slate-200/70 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
            {/* Subtle top banner strip */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Doctor Profile & Credentials */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                  <div className="relative self-start shrink-0">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="h-24 w-24 sm:h-28 sm:w-28 rounded-3xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-3xl sm:text-4xl shadow-lg shadow-emerald-600/30"
                    >
                      RA
                    </motion.div>
                    {/* Live Online Badge */}
                    <div className="absolute -bottom-1 -right-1 flex items-center justify-center">
                      <span className="relative flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 border-2 border-white"></span>
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        {soleDoctor.user.name}
                      </h3>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                        <BadgeCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>NMC Verified</span>
                      </span>
                    </div>

                    <p className="text-sm font-black text-emerald-700">
                      {soleDoctor.qualifications}
                    </p>
                    <p className="text-xs font-semibold text-slate-500">
                      Consultant General Physician & Family Medicine
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
                      <span className="flex items-center gap-1 rounded-xl bg-amber-50 px-3 py-1 font-black text-amber-800 border border-amber-200">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500 shrink-0" />
                        <span>4.5 ★ Justdial Rating</span>
                      </span>
                      <span className="flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1 font-bold text-slate-700">
                        <Award className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                        <span>10+ Years Experience</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Doctor Bio */}
                <div className="rounded-2xl bg-slate-50/90 p-4 border border-slate-200/80">
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    "{soleDoctor.about}"
                  </p>
                </div>

                {/* Clinical Focus Badges */}
                <div className="space-y-2.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                    Core Clinical Areas
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200/70 px-3 py-1">
                      Viral & Seasonal Fevers
                    </span>
                    <span className="rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200/70 px-3 py-1">
                      Type-2 Diabetes Management
                    </span>
                    <span className="rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200/70 px-3 py-1">
                      Hypertension & Cardiac Screening
                    </span>
                    <span className="rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200/70 px-3 py-1">
                      Chest X-Ray & Ultrasound Diagnostics
                    </span>
                    <span className="rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200/70 px-3 py-1">
                      Digital WhatsApp E-Prescriptions
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Tele-OPD & Booking Widget */}
              <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl bg-gradient-to-b from-white via-slate-50 to-emerald-50/40 border border-emerald-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
                        Transparent Fee
                      </span>
                      <span className="text-2xl font-black text-slate-900">₹15 <span className="text-sm font-semibold text-slate-500">/ min</span></span>
                    </div>
                    <span className="rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-xs px-3 py-1.5 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> Live OPD
                    </span>
                  </div>

                  <div className="space-y-3 pt-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        In-Clinic Hours:
                      </span>
                      <span className="font-black text-slate-800">Mon – Sat (10 AM – 7 PM)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <Video className="h-3.5 w-3.5 text-emerald-600" />
                        Online Video OPD:
                      </span>
                      <span className="font-black text-emerald-700">24/7 Available</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-rose-500" />
                        Clinic Location:
                      </span>
                      <span className="font-black text-slate-800 truncate max-w-[170px]">Beside Mohan X-Ray</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-blue-500" />
                        Prescription:
                      </span>
                      <span className="font-bold text-slate-800">Instant PDF & WhatsApp</span>
                    </div>
                  </div>
                </div>

                {/* Call to action buttons */}
                <div className="space-y-3 pt-2">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => onCallDoctor(soleDoctor)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black h-12 rounded-2xl shadow-md shadow-emerald-600/25 gap-2 text-sm"
                    >
                      <Video className="h-4 w-4" />
                      <span>Start Video Consult Now (₹15/min)</span>
                    </Button>
                  </motion.div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={() => onChatDoctor(soleDoctor)}
                        variant="outline"
                        className="w-full border-slate-200 text-slate-700 hover:bg-slate-100/80 h-11 rounded-xl text-xs gap-1.5 font-bold"
                      >
                        <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Chat Online</span>
                      </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={() => onBookClinicVisit(soleDoctor)}
                        variant="outline"
                        className="w-full border-slate-200 text-slate-700 hover:bg-slate-100/80 h-11 rounded-xl text-xs gap-1.5 font-bold"
                      >
                        <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Book Clinic Slot</span>
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
