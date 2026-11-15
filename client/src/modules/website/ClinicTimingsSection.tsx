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
} from "lucide-react";
import { Button } from "@/shared/ui/button";

interface ClinicTimingsSectionProps {
  onBookAppointment: () => void;
}

export function ClinicTimingsSection({ onBookAppointment }: ClinicTimingsSectionProps) {
  return (
    <section id="timings" className="py-20 sm:py-28 bg-slate-50 border-t border-slate-200/90 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-800">
            Visit Our Clinic
          </span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Location, Timings & Contact
          </h2>
          <p className="text-base text-slate-600 sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            Located in the heart of Malviya Nagar, Moradabad, with comprehensive on-site doctor OPD and adjacent diagnostic facilities.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Timings Table & Working Schedule */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-9 shadow-sm">
              <div className="flex items-center gap-3.5 border-b border-slate-100 pb-5">
                <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">Clinic OPD Timings</h3>
                  <p className="text-xs text-slate-500 font-medium">Walk-in OPD & Doctor Consultations</p>
                </div>
              </div>

              <div className="mt-6 divide-y divide-slate-100 text-sm">
                <div className="py-3.5 flex items-center justify-between">
                  <span className="font-bold text-slate-800">Monday – Saturday (Morning)</span>
                  <span className="font-black text-emerald-700">09:00 AM – 02:00 PM</span>
                </div>
                <div className="py-3.5 flex items-center justify-between">
                  <span className="font-bold text-slate-800">Monday – Saturday (Evening)</span>
                  <span className="font-black text-emerald-700">05:00 PM – 09:00 PM</span>
                </div>
                <div className="py-3.5 flex items-center justify-between">
                  <span className="font-bold text-slate-800">Sunday (Morning OPD)</span>
                  <span className="font-semibold text-slate-600">10:00 AM – 02:00 PM</span>
                </div>
                <div className="py-4 flex items-center justify-between bg-emerald-50 px-4 rounded-2xl mt-2 border border-emerald-200/80">
                  <span className="font-black text-emerald-950">Virtual Teleconsultations</span>
                  <span className="font-black text-emerald-800">24 Hours / 7 Days Active</span>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Advance booking recommended for evening OPD.</span>
                <Button
                  onClick={onBookAppointment}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold h-9 px-4 shadow-sm"
                >
                  <CalendarCheck className="h-4 w-4 mr-1.5" />
                  Book OPD Slot
                </Button>
              </div>
            </div>

            {/* Helpline & Quick Contact Card */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm">
              <h4 className="font-black text-slate-900 text-base mb-4">Direct Contact & Helpline</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 transition-colors border border-slate-100 group"
                >
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 font-medium">Clinic Mobile</p>
                    <p className="text-xs font-bold text-slate-900">{siteConfig.phone}</p>
                  </div>
                </a>

                <a
                  href={`tel:${siteConfig.landline.replace(/\s+/g, "")}`}
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50 transition-colors border border-slate-100 group"
                >
                  <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 font-medium">Clinic Landline</p>
                    <p className="text-xs font-bold text-slate-900">{siteConfig.landline}</p>
                  </div>
                </a>

                <a
                  href={`https://wa.me/919837012345?text=Hello%20Rehmat%20Health%20Care,%20I%20would%20like%20to%20enquire%20about%20OPD%20appointment`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 transition-colors border border-slate-100 group"
                >
                  <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 font-medium">WhatsApp Helpdesk</p>
                    <p className="text-xs font-bold text-emerald-800">+91 98370 12345</p>
                  </div>
                </a>

                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 font-medium">Official Email</p>
                    <p className="text-xs font-bold text-slate-900">{siteConfig.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Address, Landmark & Directions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl border border-emerald-200 bg-white p-7 sm:p-9 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">Clinic Address & Landmark</h3>
                  <p className="text-xs font-bold text-emerald-700 mt-0.5">{siteConfig.location}</p>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-normal">
                    Landmark: <strong>Beside Mohan X-Ray & Ultrasound Centre</strong>, Malviya Nagar Main Road, Moradabad, Uttar Pradesh – 244001.
                  </p>
                </div>
              </div>

              {/* How to reach directions */}
              <div className="mt-8 rounded-2xl bg-slate-50 p-5 border border-slate-100 space-y-3.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-emerald-600" />
                  How To Reach
                </h4>

                <ul className="text-xs text-slate-600 space-y-2.5 font-normal leading-relaxed">
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
                    <span><strong>Key Landmark:</strong> Ask for Mohan X-Ray in Malviya Nagar; Rehmat Health Care is directly adjacent.</span>
                  </li>
                </ul>
              </div>

              {/* Map Illustration card */}
              <div className="mt-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 via-slate-50 to-teal-50 p-6 text-center">
                <Building className="h-10 w-10 text-emerald-700 mx-auto mb-3" />
                <h5 className="text-sm font-black text-slate-900">Rehmat Health Care Clinic Building</h5>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-normal">
                  Ground Floor: Doctor OPD Chambers & Reception<br />
                  First Floor: Patient Observation & Teleconsult Room
                </p>
                <div className="mt-4">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Mohan+X-Ray+Malviya+Nagar+Moradabad"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 hover:text-emerald-800 hover:underline"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {/* Emergency Banner */}
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900">
                <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
                <span className="font-medium">
                  For urgent ambulance or trauma assistance in Moradabad, dial government emergency at <strong>108 / 112</strong> immediately.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
