"use client";

import React from "react";
import { siteConfig } from "@/config/site";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Navigation,
  Building,
  AlertCircle,
  CalendarCheck,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { motion } from "framer-motion";

interface ClinicTimingsSectionProps {
  onBookAppointment: () => void;
}

export function ClinicTimingsSection({ onBookAppointment }: ClinicTimingsSectionProps) {
  // Check if clinic is open right now
  const now = new Date();
  const day = now.getDay(); // 0 is Sunday
  const hour = now.getHours();
  const isSunday = day === 0;
  const isClinicOpen = !isSunday && hour >= 10 && hour < 19;

  return (
    <section id="timings" className="py-24 sm:py-32 bg-slate-50 border-t border-slate-200/90 relative overflow-hidden">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center space-y-4"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-800 border border-emerald-200">
            <Clock className="h-3.5 w-3.5 text-emerald-700" />
            <span>Visit Our Clinic</span>
          </span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Location, Timings & Contact
          </h2>
          <p className="text-base text-slate-600 sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            Centrally situated on Malviya Nagar Main Road, Moradabad, right beside Mohan X-Ray & Ultrasound Centre for instant diagnostics and prescription fulfillment.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          {/* Left Column: Timings Table & Working Schedule */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-9 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3.5">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-lg">Clinic OPD Timings</h3>
                    <p className="text-xs text-slate-500 font-medium">Walk-in OPD & Doctor Chamber</p>
                  </div>
                </div>

                {/* Live Open / Closed indicator with Motion.dev Pulsing Radar */}
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black border ${
                    isClinicOpen
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200 shadow-2xs"
                      : "bg-amber-50 text-amber-800 border-amber-200 shadow-2xs"
                  }`}
                >
                  <span className="relative flex h-2.5 w-2.5">
                    {isClinicOpen && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    )}
                    <span
                      className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                        isClinicOpen ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                  </span>
                  <span>{isClinicOpen ? "OPD Open Now" : "OPD Closed (Teleconsult Active)"}</span>
                </span>
              </div>

              <div className="mt-6 divide-y divide-slate-100 text-sm">
                <div className="py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="font-bold text-slate-800">Monday – Saturday</span>
                  </div>
                  <span className="font-black text-emerald-700">10:00 AM – 07:00 PM</span>
                </div>

                <div className="py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-rose-400" />
                    <span className="font-bold text-slate-800">Sunday</span>
                  </div>
                  <span className="font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded text-xs">
                    Walk-in OPD Closed
                  </span>
                </div>

                {/* 24/7 Teleconsult highlight */}
                <div className="py-4 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50 px-4 rounded-2xl mt-3 border border-emerald-200">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-black text-emerald-950 block text-xs sm:text-sm">
                        Online Video OPD
                      </span>
                      <span className="text-[11px] text-emerald-700">
                        Doctor on-call from your smartphone
                      </span>
                    </div>
                  </div>
                  <span className="font-black text-emerald-800 text-xs sm:text-sm">
                    24/7 Active
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs text-slate-500 font-medium">
                  Advance booking recommended to skip OPD queue.
                </span>
                <Button
                  onClick={onBookAppointment}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black h-10 px-5 shadow-sm w-full sm:w-auto gap-1.5"
                >
                  <CalendarCheck className="h-4 w-4" />
                  <span>Book OPD Slot</span>
                </Button>
              </div>
            </div>

            {/* Direct Contact & Helpline Grid */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm">
              <h4 className="font-black text-slate-900 text-base mb-4">Direct Contact & Helpline</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/80 transition-colors border border-slate-100 group"
                >
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 font-medium">Clinic Mobile</p>
                    <p className="text-xs font-black text-slate-900">{siteConfig.phone}</p>
                  </div>
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={`tel:${siteConfig.landline.replace(/\s+/g, "")}`}
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/80 transition-colors border border-slate-100 group"
                >
                  <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 font-medium">Reception Landline</p>
                    <p className="text-xs font-black text-slate-900">{siteConfig.landline}</p>
                  </div>
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="https://wa.me/919837012345?text=Hello%20Rehmat%20Health%20Care,%20I%20would%20like%20to%20enquire%20about%20OPD%20appointment"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/80 transition-colors border border-slate-100 group"
                >
                  <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 font-medium">WhatsApp Helpdesk</p>
                    <p className="text-xs font-black text-emerald-800">+91 98370 12345</p>
                  </div>
                </motion.a>

                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 font-medium">Official Email</p>
                    <p className="text-xs font-bold text-slate-900 truncate max-w-[140px]">{siteConfig.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Address, Landmark & Directions */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="rounded-3xl border border-emerald-200 bg-white p-7 sm:p-9 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">Clinic Address & Landmark</h3>
                  <p className="text-xs font-black text-emerald-700 mt-0.5">{siteConfig.location}</p>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-normal">
                    Key Landmark: <strong>Directly Beside Mohan X-Ray & Ultrasound Centre</strong>, Malviya Nagar Main Road, Moradabad, Uttar Pradesh – 244001.
                  </p>
                </div>
              </div>

              {/* Transit Directions */}
              <div className="mt-8 rounded-2xl bg-slate-50 p-5 border border-slate-100 space-y-3.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-emerald-600" />
                  How To Reach
                </h4>

                <ul className="text-xs text-slate-600 space-y-3 font-normal leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="font-black text-emerald-700 shrink-0">•</span>
                    <span><strong>From Moradabad Railway Station:</strong> Approximately 3.2 km (10-12 mins by e-rickshaw or auto towards Malviya Nagar).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-black text-emerald-700 shrink-0">•</span>
                    <span><strong>From Roadways Bus Stand:</strong> Approx 2.8 km via Imperial Tiraha / Gandhi Nagar route.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-black text-emerald-700 shrink-0">•</span>
                    <span><strong>Local Landmark:</strong> Tell the driver "Mohan X-Ray, Malviya Nagar" — Rehmat Health Care is adjacent.</span>
                  </li>
                </ul>
              </div>

              {/* Location Card with Google Maps link */}
              <div className="mt-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 via-slate-50 to-teal-50 p-6 text-center">
                <Building className="h-10 w-10 text-emerald-700 mx-auto mb-3" />
                <h5 className="text-sm font-black text-slate-900">Rehmat Health Care Facility</h5>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-normal">
                  Ground Floor: Doctor OPD Chambers & Reception<br />
                  First Floor: Patient Observation & Teleconsult Room
                </p>
                <div className="mt-4">
                  <motion.a
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    href="https://www.google.com/maps/search/?api=1&query=Mohan+X-Ray+Malviya+Nagar+Moradabad"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl shadow-xs transition-colors"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </motion.a>
                </div>
              </div>

              {/* Emergency Banner */}
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900">
                <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
                <span className="font-medium">
                  For critical trauma, cardiac emergencies or ambulance in Moradabad, call government emergency at <strong>108 / 112</strong> immediately.
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
