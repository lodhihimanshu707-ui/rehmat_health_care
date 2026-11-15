import React from "react";
import { MapPin, Phone, Clock, AlertTriangle, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      {/* Clinic Details Banner */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Clinic Location</h4>
              <p className="text-xs text-slate-600">
                Near Mohan X-Ray, Malviya Nagar, Moradabad, Uttar Pradesh - 244001
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">OPD & Teleconsultation Hours</h4>
              <p className="text-xs text-slate-600">Monday – Saturday: 10:00 AM – 09:00 PM</p>
              <p className="text-xs text-slate-500">Sunday: 10:00 AM – 02:00 PM</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Prepaid Per-Minute Billing</h4>
              <p className="text-xs text-slate-600">
                Transparent live consultation rates. Unused wallet credits never expire.
              </p>
            </div>
          </div>
        </div>

        {/* Medical Emergency Disclaimer */}
        <div className="mt-8 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
          <span>
            <strong>Emergency Notice:</strong> Online video consultations are intended for routine primary care, follow-up reviews, and general health guidance. In case of acute medical emergencies, please immediately visit the nearest emergency hospital or call emergency services (112 / 108).
          </span>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-slate-100 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Rehmat Health Care, Moradabad. All rights reserved.</p>
          <p className="font-medium text-slate-600">Made for Rehmat Health Care Clinic Demonstration</p>
        </div>
      </div>
    </footer>
  );
}

