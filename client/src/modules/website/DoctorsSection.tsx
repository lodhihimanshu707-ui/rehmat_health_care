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
  // Default fallback doctors list if query is loading or empty
  const defaultDoctors: Doctor[] = [
    {
      id: "b2000000-0000-0000-0000-000000000001",
      userId: "b1000000-0000-0000-0000-000000000001",
      specialization: "General Physician & Internal Medicine",
      qualifications: "MBBS, MD (Medicine)",
      experienceYears: 15,
      clinicName: "Rehmat Health Care",
      ratePerMinute: 15,
      isOnline: true,
      isBusy: false,
      rating: 4.9,
      about: "Chief Medical Officer with 15+ years experience in managing chronic lifestyle diseases, diabetes, and infections.",
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
      about: "Specialist in high-risk pregnancies, adolescent PCOD care, and compassionate women's health.",
      user: {
        id: "c1000000-0000-0000-0000-000000000002",
        name: "Dr. Sana Khan",
        email: "dr.sana@rehmatcare.com",
        phone: "+91 98370 54321",
      },
    },
  ];

  const displayDoctors = doctors && doctors.length > 0 ? doctors : defaultDoctors;

  return (
    <section id="doctors" className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
            Medical Faculty
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Meet Our Senior Doctors
          </h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Consult verified specialists online with transparent per-minute wallet billing, or visit them at our Malviya Nagar clinic in Moradabad.
          </p>
        </div>

        {/* Doctor Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto gap-8">
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
                className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all"
              >
                <div>
                  {/* Top Doctor Profile */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                          {initials}
                        </div>
                        <span
                          className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ring-2 ring-emerald-100 ${
                            doc.isOnline ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                          title={doc.isOnline ? "Doctor Online for Video Consult" : "Offline"}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">{doc.user.name}</h3>
                        <p className="text-xs font-semibold text-emerald-700">{doc.qualifications}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{doc.specialization}</p>
                      </div>
                    </div>
                  </div>

                  {/* Highlights badge row */}
                  <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
                    <span className="flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 font-bold text-amber-800 border border-amber-200/60">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      {doc.rating || 4.9} Rating
                    </span>
                    <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
                      <Award className="h-3.5 w-3.5 text-slate-600" />
                      {doc.experienceYears}+ Yrs Exp
                    </span>
                    <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 font-bold text-emerald-800 border border-emerald-200/60">
                      {formatCurrency(doc.ratePerMinute)} / min
                    </span>
                  </div>

                  {/* Doctor Bio Details */}
                  <div className="mt-4 rounded-xl bg-slate-50 p-3.5 text-xs text-slate-600 space-y-2 border border-slate-100">
                    <p className="italic text-slate-600">
                      "{doc.about || "Senior consulting physician dedicated to ethical and accessible healthcare."}"
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                      <span className="text-slate-500">OPD Clinic Hours:</span>
                      <span className="font-medium text-slate-800">10:00 AM – 02:00 PM & 05:00 PM – 09:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Live Video OPD:</span>
                      <span className="font-semibold text-emerald-600 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> Available Now
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                  <Button
                    onClick={() => onCallDoctor(doc)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-11 rounded-xl shadow-md gap-2"
                  >
                    <Video className="h-4 w-4" />
                    <span>Video Consult Now ({formatCurrency(doc.ratePerMinute)}/min)</span>
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => onChatDoctor(doc)}
                      variant="outline"
                      className="border-slate-200 text-slate-700 hover:bg-slate-50 h-9 rounded-xl text-xs gap-1.5 font-medium"
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-slate-600" />
                      <span>Chat</span>
                    </Button>

                    <Button
                      onClick={() => onBookClinicVisit(doc)}
                      variant="outline"
                      className="border-slate-200 text-slate-700 hover:bg-slate-50 h-9 rounded-xl text-xs gap-1.5 font-medium"
                    >
                      <Calendar className="h-3.5 w-3.5 text-slate-600" />
                      <span>Book Clinic Visit</span>
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
