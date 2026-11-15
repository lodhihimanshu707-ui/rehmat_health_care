"use client";

import React from "react";
import { siteConfig } from "@/config/site";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  HeartPulse,
  ShieldCheck,
  AlertTriangle,
  Heart,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Clinic Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
                <HeartPulse className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">{siteConfig.name}</h3>
                <p className="text-xs text-emerald-400 font-medium">{siteConfig.urduName}</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {siteConfig.description}
            </p>

            <div className="text-xs text-slate-400 space-y-1.5 pt-1">
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{siteConfig.landmark}, Malviya Nagar, Moradabad - 244001</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>{siteConfig.phone} / {siteConfig.landline}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>{siteConfig.email}</span>
              </p>
            </div>
          </div>

          {/* Col 2: Specialities */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Medical Specialities
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#services" className="hover:text-emerald-400 transition-colors">
                  General Medicine (Dr. Rehmat Ali)
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-emerald-400 transition-colors">
                  Gynecology & Obstetrics (Dr. Sana Khan)
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-emerald-400 transition-colors">
                  Pediatrics & Child Care
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-emerald-400 transition-colors">
                  Diabetes & Blood Pressure OPD
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-emerald-400 transition-colors">
                  Mohan X-Ray & Sonography Coordination
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-emerald-400 transition-colors">
                  24/7 Video Teleconsultation
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Patient Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#about" className="hover:text-emerald-400 transition-colors">
                  About Dr. Rehmat Ali & Clinic
                </a>
              </li>
              <li>
                <a href="#doctors" className="hover:text-emerald-400 transition-colors">
                  Our Senior Doctors Roster
                </a>
              </li>
              <li>
                <a href="#timings" className="hover:text-emerald-400 transition-colors">
                  Clinic Timings & Directions
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-emerald-400 transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <span className="text-emerald-400 font-semibold">
                  Prepaid Health Wallet: Pay ₹15/min
                </span>
              </li>
              <li>
                <a
                  href={`https://wa.me/919837012345`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline"
                >
                  WhatsApp Consultation Desk
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Timings & Mohan X-Ray */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Clinic Working Hours
            </h4>
            <div className="rounded-xl bg-slate-800/80 p-3.5 border border-slate-700/60 text-xs space-y-2">
              <div>
                <p className="font-semibold text-white">Mon – Sat (Morning):</p>
                <p className="text-emerald-400">09:00 AM – 02:00 PM</p>
              </div>
              <div>
                <p className="font-semibold text-white">Mon – Sat (Evening):</p>
                <p className="text-emerald-400">05:00 PM – 09:00 PM</p>
              </div>
              <div>
                <p className="font-semibold text-white">Sunday OPD:</p>
                <p className="text-slate-300">10:00 AM – 02:00 PM</p>
              </div>
              <div className="pt-1 border-t border-slate-700">
                <p className="font-bold text-emerald-300">Virtual Video OPD: 24/7</p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Notice Banner */}
        <div className="mt-10 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-950/40 p-4 text-xs text-amber-200">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-amber-300">Medical Notice:</strong> Teleconsultations and online per-minute video calls are intended for non-emergency medical consultation, routine checkups, and diagnostic review. In case of acute chest pain, trauma, unconsciousness, severe breathing distress, or life-threatening emergencies, please immediately visit the nearest emergency medical facility or call <strong>108 / 112</strong>.
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} {siteConfig.name}, Moradabad. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Built with care for Rehmat Health Care, Malviya Nagar, Moradabad</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
