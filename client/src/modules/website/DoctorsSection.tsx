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
  // Comprehensive default roster
  const defaultDoctors: Doctor[] = [
    {
      id: "b2000000-0000-0000-0000-000000000001",
      userId: "b1000000-0000-0000-0000-000000000001",
      specialization: "General Physician & Internal Medicine",
      qualifications: "MBBS, MD (Medicine)",
      experienceYears: 15,
      clinicName: "Rehmat Health Care (Malviya Nagar)",
      ratePerMinute: 15,
      isOnline: true,
      isBusy: false,
      rating: 4.9,
      about: "Chief Medical Officer with 15+ years experience in managing chronic lifestyle diseases, diabetes, hypertension, and acute infections.",
      user: {
        id: "b1000000-0000-0000-0000-000000000001",
        name: "Dr. Rehmat Ali",
        email: "dr.rehmat@rehmatcare.com",
        phone: "+91 98370 12345",
      },
    },
    {
      id: "c2000000-0000-0000-0000-000000000002",
      userId: "c1000000-0000-0000-0000-000000000002",
      specialization: "Gynecologist & Obstetrician",
      qualifications: "MBBS, MS (Obs & Gynae)",
      experienceYears: 11,
      clinicName: "Rehmat Health Care",
      ratePerMinute: 18,
      isOnline: true,
      isBusy: false,
      rating: 4.95,
      about: "Senior specialist in antenatal care, high-risk pregnancies, adolescent PCOD care, and compassionate women's reproductive health.",
      user: {
        id: "c1000000-0000-0000-0000-000000000002",
        name: "Dr. Sana Khan",
        email: "dr.sana@rehmatcare.com",
        phone: "+91 98370 54321",
      },
    },
    {
      id: "d2000000-0000-0000-0000-000000000003",
      userId: "d1000000-0000-0000-0000-000000000003",
      specialization: "Consultant Pediatrician & Neonatologist",
      qualifications: "MBBS, DCH (Pediatrics)",
      experienceYears: 10,
      clinicName: "Rehmat Health Care",
      ratePerMinute: 12,
      isOnline: true,
      isBusy: false,
      rating: 4.85,
      about: "Child health specialist handling neonatal care, growth milestones, pediatric immunization schedules, and childhood respiratory infections.",
      user: {
        id: "d1000000-0000-0000-0000-000000000003",
        name: "Dr. Tariq Mansoor",
        email: "dr.tariq@rehmatcare.com",
        phone: "+91 98370 78910",
      },
    },
  ];

  const displayDoctors = doctors && doctors.length > 0 ? doctors : defaultDoctors;

  return (
    <section id="doctors" className="py-20 sm:py-28 bg-white relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-800">
            Medical Faculty
          </span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Meet Our Senior Doctors
          </h2>
          <p className="text-base text-slate-600 sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            Consult verified specialists online with transparent per-minute wallet billing, or visit them at our Malviya Nagar clinic in Moradabad.
          </p>
        </div>

        {/* Doctor Cards Grid (3 columns on desktop) */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayDoctors.map((doc) => {
            const initials = doc.user.name
              .replace("Dr.", "")
              .trim()
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2);

            return (
              <div
                key={doc.id}
                className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div>
                  {/* Top Doctor Profile Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-2xl shadow-md">
                          {initials}
                        </div>
                        <span
                          className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ring-2 ring-emerald-100 ${
                            doc.isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                          }`}
                          title={doc.isOnline ? "Doctor Online for Video Consult" : "Offline"}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-black text-slate-900 text-lg group-hover:text-emerald-700 transition-colors">
                            {doc.user.name}
                          </h3>
                          <span title="Verified Medical Practitioner">
                            <ShieldCheck className="h-4 w-4 text-emerald-600" />
                          </span>
                        </div>
                        <p className="text-xs font-bold text-emerald-700">{doc.qualifications}</p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{doc.specialization}</p>
                      </div>
                    </div>
                  </div>

                  {/* Highlights badge row */}
                  <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
                    <span className="flex items-center gap-1 rounded-xl bg-amber-50 px-2.5 py-1 font-bold text-amber-800 border border-amber-200/70">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      {doc.rating || 4.9} Rating
                    </span>
                    <span className="flex items-center gap-1 rounded-xl bg-slate-100 px-2.5 py-1 font-bold text-slate-700">
                      <Award className="h-3.5 w-3.5 text-slate-600" />
                      {doc.experienceYears}+ Yrs Exp
                    </span>
                    <span className="flex items-center gap-1 rounded-xl bg-emerald-50 px-2.5 py-1 font-black text-emerald-800 border border-emerald-300">
                      {formatCurrency(doc.ratePerMinute)} / min
                    </span>
                  </div>

                  {/* Doctor Bio Details */}
                  <div className="mt-5 rounded-2xl bg-slate-50/90 p-4 text-xs text-slate-600 space-y-2.5 border border-slate-100">
                    <p className="italic text-slate-600 font-normal leading-relaxed">
                      "{doc.about || "Senior consulting physician dedicated to ethical and accessible healthcare."}"
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/70 font-medium">
                      <span className="text-slate-500">OPD Clinic Hours:</span>
                      <span className="font-bold text-slate-800">10:00 AM – 02:00 PM & 05:00 PM – 09:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Live Video OPD:</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5" /> Available Now
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-4 border-t border-slate-100 space-y-2.5">
                  <Button
                    onClick={() => onCallDoctor(doc)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 rounded-xl shadow-md gap-2 transition-all hover:scale-[1.01]"
                  >
                    <Video className="h-4 w-4" />
                    <span>Video Consult Now ({formatCurrency(doc.ratePerMinute)}/min)</span>
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => onChatDoctor(doc)}
                      variant="outline"
                      className="border-slate-200 text-slate-700 hover:bg-slate-50 h-9 rounded-xl text-xs gap-1.5 font-bold"
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-slate-600" />
                      <span>Chat</span>
                    </Button>

                    <Button
                      onClick={() => onBookClinicVisit(doc)}
                      variant="outline"
                      className="border-slate-200 text-slate-700 hover:bg-slate-50 h-9 rounded-xl text-xs gap-1.5 font-bold"
                    >
                      <Calendar className="h-3.5 w-3.5 text-slate-600" />
                      <span>Clinic Visit</span>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
