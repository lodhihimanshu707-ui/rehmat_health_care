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
} from "lucide-react";
import { Button } from "@/shared/ui/button";

interface ClinicTimingsSectionProps {
  onBookAppointment: () => void;
}

export function ClinicTimingsSection({ onBookAppointment }: ClinicTimingsSectionProps) {
  return (
    <section id="timings" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
            Visit Our Clinic
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Location, Timings & Contact
          </h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Located in the heart of Malviya Nagar, Moradabad, with comprehensive on-site doctor OPD and adjacent diagnostic facilities.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Timings Table & Working Schedule */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Clinic OPD Timings</h3>
                  <p className="text-xs text-slate-500">Walk-in OPD & Doctor Consultations</p>
                </div>
              </div>

              <div className="mt-5 divide-y divide-slate-100 text-sm">
                <div className="py-3 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Monday – Saturday (Morning)</span>
                  <span className="font-medium text-emerald-700">09:00 AM – 02:00 PM</span>
                </div>
                <div className="py-3 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Monday – Saturday (Evening)</span>
                  <span className="font-medium text-emerald-700">05:00 PM – 09:00 PM</span>
                </div>
                <div className="py-3 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Sunday (Morning OPD)</span>
                  <span className="font-medium text-slate-600">10:00 AM – 02:00 PM</span>
                </div>
                <div className="py-3 flex items-center justify-between bg-emerald-50/60 px-3 rounded-lg">
                  <span className="font-bold text-emerald-900">Virtual Teleconsultations</span>
                  <span className="font-bold text-emerald-800">24 Hours / 7 Days Active</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Prior appointment recommended for evening rush.</span>
                <Button
                  onClick={onBookAppointment}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs"
                >
                  <CalendarCheck className="h-3.5 w-3.5 mr-1.5" />
                  Book OPD Slot
                </Button>
              </div>
            </div>

            {/* Helpline & Quick Contact Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h4 className="font-bold text-slate-900 text-sm mb-4">Direct Contact & Helpline</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 transition-colors border border-slate-100"
                >
                  <div className="h-9 w-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 font-medium">Clinic Mobile</p>
                    <p className="text-xs font-bold text-slate-900">{siteConfig.phone}</p>
                  </div>
                </a>

                <a
                  href={`tel:${siteConfig.landline.replace(/\s+/g, "")}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 transition-colors border border-slate-100"
                >
                  <div className="h-9 w-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4" />
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
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 transition-colors border border-slate-100"
                >
                  <div className="h-9 w-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 font-medium">WhatsApp Helpdesk</p>
                    <p className="text-xs font-bold text-emerald-800">+91 98370 12345</p>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="h-9 w-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4" />
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
            <div className="rounded-2xl border border-emerald-200 bg-white p-6 sm:p-7 shadow-sm">
              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Clinic Address & Landmark</h3>
                  <p className="text-xs font-semibold text-emerald-700 mt-0.5">{siteConfig.location}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Landmark: <strong>Beside Mohan X-Ray & Ultrasound Centre</strong>, Malviya Nagar Main Road, Moradabad, Uttar Pradesh – 244001.
                  </p>
                </div>
              </div>

              {/* How to reach directions */}
              <div className="mt-6 rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Navigation className="h-3.5 w-3.5 text-emerald-600" />
                  How To Reach
                </h4>

                <ul className="text-xs text-slate-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-emerald-700 shrink-0">•</span>
                    <span><strong>From Moradabad Railway Station:</strong> Approximately 3.2 km (10-12 mins by e-rickshaw or auto towards Malviya Nagar).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-emerald-700 shrink-0">•</span>
                    <span><strong>From Roadways Bus Stand:</strong> Approx 2.8 km via Imperial Tiraha / Gandhi Nagar route.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-emerald-700 shrink-0">•</span>
                    <span><strong>Key Landmark:</strong> Ask for Mohan X-Ray in Malviya Nagar; Rehmat Health Care is directly adjacent.</span>
                  </li>
                </ul>
              </div>

              {/* Map Illustration card */}
              <div className="mt-5 rounded-xl border border-slate-200 bg-gradient-to-br from-emerald-50 via-slate-50 to-teal-50 p-5 text-center">
                <Building className="h-8 w-8 text-emerald-700 mx-auto mb-2" />
                <h5 className="text-xs font-bold text-slate-900">Rehmat Health Care Clinic Building</h5>
                <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                  Ground Floor: Doctor OPD Chambers & Reception<br />
                  First Floor: Patient Observation & Teleconsult Room
                </p>
                <div className="mt-3">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Mohan+X-Ray+Malviya+Nagar+Moradabad"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                  >
                    <span>Open in Google Maps</span>
                    <Navigation className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Emergency Banner */}
              <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                <span>
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
