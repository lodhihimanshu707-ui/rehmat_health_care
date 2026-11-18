"use client";

import React from "react";
import { motion } from "framer-motion";
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
  Star,
} from "lucide-react";

export function AboutSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="about" className="py-20 sm:py-28 bg-white relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-1/2 left-0 -z-10 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />

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
            About Our Clinic
          </span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Providing Ethical, Compassionate Care in Moradabad
          </h2>
          <p className="text-base text-slate-600 sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            Established in 2016, <strong>Rehmat Health Care</strong> has been a trusted healthcare pillar in Malviya Nagar, Moradabad. Located conveniently beside Mohan X-Ray with a <strong>4.5-star Justdial rating (10+ Years in Healthcare)</strong>, we provide general physician consultations, comprehensive patient care, and 24/7 video OPD.
          </p>
        </motion.div>

        {/* 2-Column Content */}
        <div className="mt-14 sm:mt-18 grid grid-cols-1 items-stretch gap-8 lg:gap-12 lg:grid-cols-12">
          {/* Left Column: Clinic Highlights */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 flex flex-col justify-between rounded-3xl bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 border border-slate-200/90 p-6 sm:p-10 shadow-lg shadow-slate-100"
          >
            <div>
              <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-100/90 px-3 py-1 text-xs font-bold text-emerald-800 mb-4">
                <Building className="h-4 w-4" />
                <span>Malviya Nagar Main Road, Moradabad</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                Primary Care & Diagnostic Excellence Under One Roof
              </h3>
              <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Located on Malviya Nagar Main Road, right beside the renowned <strong>Mohan X-Ray & Ultrasound Centre</strong>, our clinic provides seamless patient care. Patients visiting us can receive immediate doctor consultation and undergo necessary diagnostic imaging or laboratory tests in minutes.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
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
                  <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Fair Per-Minute Tele-OPD (₹15/min)</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Transparent live billing without expensive hospital registration fees. Perfect for follow-ups and report reviews.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Direct Prescription Delivery</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Legally valid digital prescriptions delivered straight to your WhatsApp and patient dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <ShieldCheck className="h-4 w-4" />
                Licensed Clinical OPD
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-rose-500" />
                UP 244001
              </span>
            </div>
          </motion.div>

          {/* Right Column: 4 Stat/Pillar Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {/* Card 1 */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.02 }}
              className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-md shadow-emerald-950/5 flex flex-col justify-between"
            >
              <div className="h-12 w-12 rounded-2xl bg-emerald-100/90 text-emerald-700 flex items-center justify-center mb-4 shadow-inner">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900">Senior Medical Leadership</h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Led by <strong>Dr. Raees Akhtar (MBBS, MD)</strong> with over a decade of clinical excellence in family medicine and chronic care.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-emerald-700">
                10+ Years Trust &rarr;
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.02 }}
              className="rounded-3xl border border-blue-100 bg-white p-6 shadow-md shadow-blue-950/5 flex flex-col justify-between"
            >
              <div className="h-12 w-12 rounded-2xl bg-blue-100/90 text-blue-700 flex items-center justify-center mb-4 shadow-inner">
                <Microscope className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900">Mohan X-Ray Linkage</h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Right beside Mohan X-Ray centre for instant digital imaging, ultrasound sonography, and pathology blood work.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-blue-700">
                Diagnostic Partner &rarr;
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.02 }}
              className="rounded-3xl border border-amber-100 bg-white p-6 shadow-md shadow-amber-950/5 flex flex-col justify-between"
            >
              <div className="h-12 w-12 rounded-2xl bg-amber-100/90 text-amber-700 flex items-center justify-center mb-4 shadow-inner">
                <Star className="h-6 w-6 fill-amber-500" />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900">4.5 ★ Justdial Rating</h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Consistently rated among the top primary healthcare clinics in Moradabad for ethical, patient-first care.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-amber-700">
                Top Rated in Moradabad &rarr;
              </div>
            </motion.div>

            {/* Card 4 */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.02 }}
              className="rounded-3xl border border-teal-100 bg-white p-6 shadow-md shadow-teal-950/5 flex flex-col justify-between"
            >
              <div className="h-12 w-12 rounded-2xl bg-teal-100/90 text-teal-700 flex items-center justify-center mb-4 shadow-inner">
                <FileCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900">WhatsApp & Digital OPD</h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  24/7 video OPD access with WhatsApp prescription delivery, tokenless visits, and digital health history records.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-teal-700">
                24/7 Connected &rarr;
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
