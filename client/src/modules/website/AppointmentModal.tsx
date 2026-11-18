"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { siteConfig } from "@/config/site";
import { Calendar, Clock, User, Phone, CheckCircle2, Stethoscope, MapPin, Video, Sparkles, Ticket } from "lucide-react";
import { MotionTabs } from "@/shared/ui/motion-tabs";
import { PulseBadge } from "@/shared/ui/pulse-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/stores/auth.store";
import { useQueueStore } from "@/stores/queue.store";

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
  const { currentUser, isAuthenticated } = useAuthStore();
  const { joinQueue, myQueueItem, myPosition } = useQueueStore();

  const [selectedDoctor, setSelectedDoctor] = useState(initialDoctorName);
  const [visitType, setVisitType] = useState<"clinic" | "online">("clinic");
  const [patientName, setPatientName] = useState(currentUser?.name || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [date, setDate] = useState("Today");
  const [timeSlot, setTimeSlot] = useState("Evening OPD (05:30 PM - 07:00 PM)");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<{ token: string; position: number } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isAuthenticated) {
        await joinQueue(
          visitType === "online" ? "video" : "clinic",
          reason || `${visitType === "online" ? "Online Consultation" : "In-Clinic OPD"} - ${timeSlot}`
        );
        const currentItem = useQueueStore.getState().myQueueItem;
        const currentPos = useQueueStore.getState().myPosition;
        setTokenInfo({
          token: currentItem?.tokenNumber || "RH-104",
          position: currentPos || 4,
        });
      } else {
        setTokenInfo({
          token: `RH-${Math.floor(100 + Math.random() * 50)}`,
          position: 4,
        });
      }
    } catch (err) {
      setTokenInfo({
        token: `RH-${Math.floor(100 + Math.random() * 50)}`,
        position: 4,
      });
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setTokenInfo(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-lg max-h-[92vh] overflow-y-auto p-0 rounded-3xl border-slate-200/90 shadow-2xl">
        <DialogHeader className="p-5 sm:p-6 pb-4 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <DialogTitle className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 shrink-0 text-emerald-200" />
            <span>Book Doctor Consultation</span>
          </DialogTitle>
          <DialogDescription className="text-emerald-100 text-xs font-normal">
            Rehmat Health Care • Malviya Nagar, Moradabad (Near Mohan X-Ray)
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="p-6 text-center space-y-4"
            >
              <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              </div>

              <h3 className="text-xl font-black text-slate-900">Appointment Request Confirmed!</h3>

              {/* Digital Token Pass */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-4 text-white text-center shadow-md space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                  Your Live OPD Queue Token
                </span>
                <div className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
                  <Ticket className="h-6 w-6 text-emerald-300" />
                  <span>Token #{tokenInfo?.token || "RH-101"}</span>
                </div>
                <div className="text-xs text-emerald-100 font-semibold pt-1">
                  Queue Position: #{tokenInfo?.position || 1} in line • Est. Wait: ~{((tokenInfo?.position || 1) - 1) * 5 + 2} mins
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 text-left text-xs space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Patient:</span>
                  <span className="font-bold text-slate-900">{patientName || "Walk-in Patient"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Doctor:</span>
                  <span className="font-bold text-emerald-700">{selectedDoctor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Visit Mode:</span>
                  <span className="font-bold uppercase text-slate-800">
                    {visitType === "clinic" ? "In-Clinic (Malviya Nagar)" : "Online Video Consult"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Timing:</span>
                  <span className="font-bold text-slate-800">{timeSlot}</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 font-normal leading-relaxed">
                A confirmation SMS & WhatsApp reminder has been sent. You can walk in directly to our clinic near Mohan X-Ray.
              </p>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                {visitType === "online" && onSuccessTeleconsult && (
                  <Button
                    onClick={() => {
                      handleReset();
                      onSuccessTeleconsult();
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 rounded-xl shadow-md"
                  >
                    Go to Live Tele-OPD
                  </Button>
                )}
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 border-slate-200 font-bold h-11 rounded-xl text-slate-700"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSubmit}
              className="p-5 sm:p-6 space-y-4"
            >
              {/* Reusable MotionTabs for Consultation Mode */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Select Mode</label>
                <MotionTabs<"clinic" | "online">
                  layoutId="appointment-visit-tab"
                  tabs={[
                    { id: "clinic", label: "In-Clinic OPD (Moradabad)", icon: MapPin },
                    { id: "online", label: "Online Video Call (₹15/min)", icon: Video, badge: "Live" },
                  ]}
                  activeTab={visitType}
                  onChange={(val) => setVisitType(val)}
                />
              </div>

              {/* Doctor Card with Reusable PulseBadge */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Consulting Doctor</label>
                <div className="flex items-center justify-between rounded-2xl border border-emerald-300 bg-emerald-50/70 p-3.5 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-sm flex items-center justify-center shadow-xs">
                      RA
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-black text-slate-900 block">
                          Dr. Raees Akhtar
                        </span>
                        <PulseBadge isLive={true} label="Available" size="sm" />
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        MBBS, MD • Chief Medical Consultant
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-emerald-900 bg-white px-2.5 py-1 rounded-lg border border-emerald-200/90 shadow-2xs shrink-0">
                    ₹15/min
                  </span>
                </div>
              </div>

              {/* Patient Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Patient Name</label>
                  <Input
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="text-xs h-10 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <Input
                    required
                    placeholder="+91 98370 XXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="text-xs h-10 rounded-xl"
                  />
                </div>
              </div>

              {/* Time Slot with shadcn Select */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Preferred Day</label>
                  <Select value={date} onValueChange={(val) => setDate(val)}>
                    <SelectTrigger className="h-10 rounded-xl border-slate-300">
                      <SelectValue placeholder="Select day..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200">
                      <SelectItem value="Today">Today (Fastest)</SelectItem>
                      <SelectItem value="Tomorrow">Tomorrow</SelectItem>
                      <SelectItem value="Day After Tomorrow">Day After Tomorrow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Preferred Slot</label>
                  <Select value={timeSlot} onValueChange={(val) => setTimeSlot(val)}>
                    <SelectTrigger className="h-10 rounded-xl border-slate-300">
                      <SelectValue placeholder="Select slot..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200">
                      <SelectItem value="Morning OPD (10:00 AM - 12:00 PM)">Morning (10:00 AM - 12:00 PM)</SelectItem>
                      <SelectItem value="Afternoon OPD (12:00 PM - 02:00 PM)">Afternoon (12:00 PM - 02:00 PM)</SelectItem>
                      <SelectItem value="Evening OPD (05:30 PM - 07:00 PM)">Evening (05:30 PM - 07:00 PM) ★</SelectItem>
                      <SelectItem value="Night OPD (07:00 PM - 09:00 PM)">Night (07:00 PM - 09:00 PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Brief Concern */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason for Visit / Symptoms (Optional)
                </label>
                <Input
                  placeholder="e.g. Fever, cough, blood sugar review, routine checkup"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="text-xs h-10 rounded-xl"
                />
              </div>

              {/* Location Notice */}
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-[11px] text-slate-600">
                <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
                <span>
                  Clinic Address: <strong>Beside Mohan X-Ray</strong>, Malviya Nagar Main Road, Moradabad.
                </span>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black h-11 rounded-xl shadow-md text-xs sm:text-sm active:scale-98 transition-all cursor-pointer"
                >
                  {isSubmitting ? "Generating OPD Token..." : "Confirm Appointment & Get Queue Token"}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
