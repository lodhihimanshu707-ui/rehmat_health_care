"use client";

import React from "react";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { DoctorsView } from "@/modules/doctors/DoctorsView";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Video, ShieldCheck, Clock, ArrowLeft, Sparkles, MapPin, Stethoscope } from "lucide-react";
import { PulseBadge } from "@/shared/ui/pulse-badge";
import { motion } from "framer-motion";

export default function TeleconsultPage() {
  const router = useRouter();

  const handleOpenChat = (doctorId: string, doctorName: string) => {
    router.push(`/chat?doctorId=${doctorId}&doctorName=${encodeURIComponent(doctorName)}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-gradient-to-tr from-emerald-100/40 via-teal-50/30 to-blue-50/20 rounded-full blur-3xl -z-0 pointer-events-none" />

      <Navbar />

      <main className="flex-1 w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-6 sm:py-8 relative z-10 max-w-7xl 2xl:max-w-[1540px] mx-auto">
        {/* Page Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5"
        >
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <PulseBadge isLive={true} label="Virtual OPD Live" size="sm" />
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                <MapPin className="h-3.5 w-3.5 text-rose-500" />
                <span>Malviya Nagar, Moradabad (Beside Mohan X-Ray)</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Live Video Teleconsultation
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed font-normal">
              Direct encrypted 1-on-1 consultations with <strong>Dr. Raees Akhtar (MBBS, MD)</strong>. Talk as long as needed with fair, second-by-second ₹15/min wallet deductions.
            </p>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-white border border-slate-200 hover:border-emerald-300 px-4 py-2.5 rounded-xl shadow-xs transition-all shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Clinic Website</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Doctors View Container */}
        <DoctorsView
          onOpenChat={handleOpenChat}
          onCallInitiated={() => {}}
        />
      </main>

      <Footer />
    </div>
  );
}
