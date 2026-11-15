"use client";

import React from "react";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { DoctorsView } from "@/modules/doctors/DoctorsView";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Video, ShieldCheck, Clock, ArrowLeft } from "lucide-react";

export default function TeleconsultPage() {
  const router = useRouter();

  const handleOpenChat = (doctorId: string, doctorName: string) => {
    router.push(`/chat?doctorId=${doctorId}&doctorName=${encodeURIComponent(doctorName)}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 py-8">
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-black text-emerald-800 uppercase tracking-wider">
                <Video className="h-3 w-3" />
                Virtual OPD
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-500">
                Malviya Nagar, Moradabad
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Live Video Teleconsultation
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Connect directly with Dr. Raees Akhtar via encrypted WebRTC HD video. Pay strictly for the consultation minutes you talk with transparent per-minute Health Wallet deduction.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-white border border-slate-200 hover:border-emerald-300 px-4 py-2.5 rounded-xl shadow-xs transition-all shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Clinic Website</span>
          </Link>
        </div>

        <DoctorsView
          onOpenChat={handleOpenChat}
          onCallInitiated={() => {}}
        />
      </main>

      <Footer />
    </div>
  );
}

