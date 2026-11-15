"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { siteConfig } from "@/config/site";
import { Calendar, Clock, User, Phone, CheckCircle2, Stethoscope, MapPin } from "lucide-react";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDoctorName?: string;
  onSuccessTeleconsult?: () => void;
}

export function AppointmentModal({
  isOpen,
  onClose,
  initialDoctorName = "Dr. Raees Akhtar",
  onSuccessTeleconsult,
}: AppointmentModalProps) {
  const [selectedDoctor, setSelectedDoctor] = useState(initialDoctorName);
  const [visitType, setVisitType] = useState<"clinic" | "online">("clinic");
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("Today");
  const [timeSlot, setTimeSlot] = useState("Evening OPD (05:30 PM - 07:00 PM)");
  const [reason, setReason] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Book Doctor Consultation
          </DialogTitle>
          <DialogDescription className="text-emerald-100 text-xs">
            Rehmat Health Care • Malviya Nagar, Moradabad (Near Mohan X-Ray)
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="p-6 text-center space-y-4">
            <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Appointment Request Confirmed!</h3>
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Patient:</span>
                <span className="font-bold text-slate-900">{patientName || "Walk-in Patient"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Doctor:</span>
                <span className="font-bold text-emerald-700">{selectedDoctor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Visit Mode:</span>
                <span className="font-bold uppercase text-slate-800">
                  {visitType === "clinic" ? "In-Clinic (Malviya Nagar)" : "Online Video Consult"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Timing:</span>
                <span className="font-medium text-slate-800">{timeSlot}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              A confirmation SMS & WhatsApp reminder has been sent. You can walk in directly to our clinic near Mohan X-Ray.
            </p>

            <div className="flex gap-2 pt-2">
              {visitType === "online" && onSuccessTeleconsult && (
                <Button
                  onClick={() => {
                    handleReset();
                    onSuccessTeleconsult();
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Go to Live Tele-OPD
                </Button>
              )}
              <Button onClick={handleReset} variant="outline" className="flex-1">
                Close
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Visit Type Toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100">
              <button
                type="button"
                onClick={() => setVisitType("clinic")}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  visitType === "clinic"
                    ? "bg-white text-emerald-800 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                In-Clinic OPD (Moradabad)
              </button>
              <button
                type="button"
                onClick={() => setVisitType("online")}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  visitType === "online"
                    ? "bg-white text-emerald-800 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Online Video Call (₹15/min)
              </button>
            </div>

            {/* Doctor Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Consulting Doctor</label>
              <div className="flex items-center justify-between rounded-xl border border-emerald-300 bg-emerald-50/70 p-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                    RA
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block">Dr. Raees Akhtar</span>
                    <span className="text-[10px] text-slate-500 font-medium">MBBS, MD • Chief Medical Consultant</span>
                  </div>
                </div>
                <span className="text-[11px] font-black text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  ₹15/min
                </span>
              </div>
            </div>

            {/* Patient Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Patient Name</label>
                <Input
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <Input
                  required
                  placeholder="+91 98370 XXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            {/* Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Day</label>
                <select
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Today">Today</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="Day After Tomorrow">Day After Tomorrow</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Slot</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Morning OPD (10:00 AM - 12:00 PM)">Morning (10:00 AM - 12:00 PM)</option>
                  <option value="Afternoon OPD (12:00 PM - 02:00 PM)">Afternoon (12:00 PM - 02:00 PM)</option>
                  <option value="Evening OPD (05:30 PM - 07:00 PM)">Evening (05:30 PM - 07:00 PM)</option>
                  <option value="Night OPD (07:00 PM - 09:00 PM)">Night (07:00 PM - 09:00 PM)</option>
                </select>
              </div>
            </div>

            {/* Brief Concern */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for Visit / Symptoms (Optional)
              </label>
              <Input
                placeholder="e.g. Fever, cough, blood sugar review, routine checkup"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="text-xs"
              />
            </div>

            {/* Location Notice */}
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-[11px] text-slate-600">
              <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
              <span>
                Clinic Address: <strong>Beside Mohan X-Ray</strong>, Malviya Nagar Main Road, Moradabad.
              </span>
            </div>

            {/* Submit */}
            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-10 rounded-xl"
              >
                Confirm Appointment Request
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

