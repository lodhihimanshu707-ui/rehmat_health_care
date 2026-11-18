"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { AuthGuard } from "@/shared/components/AuthGuard";
import { useAuthStore, DEMO_PATIENT_1, DEMO_PATIENT_2 } from "@/stores/auth.store";
import { useCallStore } from "@/stores/call.store";
import { apiClient } from "@/api/client";
import { getSocket } from "@/lib/socket";
import { formatCurrency } from "@/shared/utils/format";
import {
  Stethoscope,
  Video,
  MessageSquare,
  Users,
  Activity,
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  Phone,
  Send,
  Plus,
  ShieldCheck,
  TrendingUp,
  Printer,
  Share2,
  Search,
  AlertCircle,
  X,
  ExternalLink,
  MapPin,
  ClipboardList,
  Ticket,
  HeartPulse,
  Volume2,
  Building,
} from "lucide-react";
import { useQueueStore } from "@/stores/queue.store";
import { MotionTabs } from "@/shared/ui/motion-tabs";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Checkbox } from "@/shared/ui/checkbox";
import { Badge } from "@/shared/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { PulseBadge } from "@/shared/ui/pulse-badge";
import { StatCard } from "@/shared/ui/stat-card";
import { PatientQueueCard, PatientQueueItem } from "@/shared/ui/patient-queue-card";
import { PrescriptionModal } from "@/shared/ui/prescription-modal";

const PRESCRIPTION_PRESETS = [
  {
    name: "Viral Fever & Throat Infection",
    diagnosis: "Acute Viral Pyrexia with Upper Respiratory Tract Infection",
    medicines:
      "1. Tab. Paracetamol 650mg — 1 tab TDS after meals (3 days)\n2. Tab. Levocetirizine 5mg — 1 tab HS at bedtime (3 days)\n3. Cough Syrup Honitus — 10ml TDS with lukewarm water\n4. Steam inhalation twice daily & warm saline gargles",
    xray: false,
    blood: true,
    usg: false,
  },
  {
    name: "Chest Congestion / Cough",
    diagnosis: "Acute Bronchitis with Productive Cough",
    medicines:
      "1. Cap. Amoxicillin+Clav 625mg — 1 tab BD after food (5 days)\n2. Tab. Montelukast+Levocetirizine — 1 tab HS (5 days)\n3. Syrup Ambroxol+Terbutaline — 10ml TDS (5 days)\n4. Plenty of warm fluids & avoid cold drinks",
    xray: true,
    blood: true,
    usg: false,
  },
  {
    name: "Diabetes & BP Routine Review",
    diagnosis: "Type 2 Diabetes Mellitus & Primary Hypertension Follow-up",
    medicines:
      "1. Tab. Metformin 500mg — 1 tab BD with meals (30 days)\n2. Tab. Telmisartan 40mg — 1 tab OD morning (30 days)\n3. Daily 30 mins brisk walk & low salt, low carb diet\n4. Re-check Fasting & PP Blood Sugar in 15 days",
    xray: false,
    blood: true,
    usg: false,
  },
];

function playClinicChime() {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.22); // A5

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.75);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.75);
  } catch (e) {
    console.log("Audio chime note:", e);
  }
}

export default function DoctorCockpitPage() {
  const { currentUser } = useAuthStore();
  const { startOutgoingCall } = useCallStore();
  const { callNext, updateQueueStatus, isCallingNext } = useQueueStore();

  const [opdStatus, setOpdStatus] = useState<"online" | "busy" | "offline">("online");
  const [callingPatientId, setCallingPatientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [queueFilter, setQueueFilter] = useState<"all" | "clinic" | "video">("all");

  // Prescription Form State
  const [selectedPatientId, setSelectedPatientId] = useState<string>(DEMO_PATIENT_1.id);
  const [selectedPatientName, setSelectedPatientName] = useState(DEMO_PATIENT_1.name);
  const [selectedPatientPhone, setSelectedPatientPhone] = useState(DEMO_PATIENT_1.phone || "+91 98370 12345");
  const [selectedTokenNumber, setSelectedTokenNumber] = useState<string | undefined>("RH-101");
  const [diagnosis, setDiagnosis] = useState("Seasonal Viral Fever & Acute Upper Respiratory Infection");
  const [medicines, setMedicines] = useState(
    "1. Tab. Paracetamol 650mg — 1 tab TDS after food (3 days)\n2. Tab. Levocetirizine 5mg — 1 tab HS at bedtime (3 days)\n3. Cough Syrup Honitus — 10ml TDS with lukewarm water"
  );
  const [referralXray, setReferralXray] = useState(true);
  const [referralBlood, setReferralBlood] = useState(true);
  const [referralUsg, setReferralUsg] = useState(false);
  const [prescriptionSent, setPrescriptionSent] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // In-Clinic Patient Vitals Recording State
  const [bp, setBp] = useState("120/80");
  const [pulse, setPulse] = useState("74");
  const [spo2, setSpo2] = useState("98");
  const [temp, setTemp] = useState("98.4");
  const [weight, setWeight] = useState("68");

  // Dynamic Patient Queue
  const [patients, setPatients] = useState<PatientQueueItem[]>([
    {
      id: DEMO_PATIENT_1.id,
      name: DEMO_PATIENT_1.name,
      email: DEMO_PATIENT_1.email,
      phone: DEMO_PATIENT_1.phone,
      balance: 150,
      avatarUrl: DEMO_PATIENT_1.avatarUrl,
      lastSeen: "Online Now",
      symptom: "Fever, acute throat irritation (Day 2)",
      tokenNumber: "RH-101",
    },
    {
      id: DEMO_PATIENT_2.id,
      name: DEMO_PATIENT_2.name,
      email: DEMO_PATIENT_2.email,
      phone: DEMO_PATIENT_2.phone,
      balance: 200,
      avatarUrl: DEMO_PATIENT_2.avatarUrl,
      lastSeen: "20 mins ago",
      symptom: "Fasting blood sugar follow-up & BP check",
      tokenNumber: "RH-102",
    },
  ]);

  // Load live patient queue from API
  useEffect(() => {
    async function loadQueue() {
      try {
        const res: any = await apiClient.get("/queue");
        const list = Array.isArray(res) ? res : res?.data;
        if (Array.isArray(list) && list.length > 0) {
          const mapped = list.map((item: any) => ({
            id: item.patientId || item.id,
            queueItemId: item.id,
            tokenNumber: item.tokenNumber,
            queueNumber: item.queueNumber,
            type: item.type || "clinic",
            name: item.patientName || item.name,
            phone: item.patientPhone || item.phone,
            balance: item.patientBalance !== undefined ? Number(item.patientBalance) : 0,
            avatarUrl: item.patientAvatar || item.avatarUrl,
            lastSeen: item.status ? `Token #${item.tokenNumber} • ${item.status}` : "In Queue",
            symptom: item.symptom || "Consultation requested",
            status: item.status || "waiting",
            estimatedWaitMinutes: item.estimatedWaitMinutes || 5,
          }));
          setPatients(mapped);
        } else {
          // Fallback to registered patients queue
          const fallbackRes: any = await apiClient.get("/doctors/patients/queue");
          const fbList = Array.isArray(fallbackRes) ? fallbackRes : fallbackRes?.data;
          if (Array.isArray(fbList) && fbList.length > 0) {
            setPatients(fbList);
          }
        }
      } catch (err) {
        console.warn("Could not load dynamic patients queue:", err);
      }
    }
    loadQueue();
    const interval = setInterval(loadQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  // Update status on backend and socket
  const handleStatusChange = async (status: "online" | "busy" | "offline") => {
    setOpdStatus(status);
    if (!currentUser) return;
    try {
      await apiClient.patch(`/doctors/${currentUser.id}/status`, {
        isOnline: status === "online",
        isBusy: status === "busy",
      });
    } catch (err) {
      console.warn("Status patch info:", err);
    }
  };

  // Select a patient into the prescription pad
  const handleSelectPatientForRx = (pat: PatientQueueItem) => {
    setSelectedPatientId(pat.id);
    setSelectedPatientName(pat.name);
    setSelectedPatientPhone(pat.phone || "+91 98370 12345");
    setSelectedTokenNumber(pat.tokenNumber);
  };

  // Call In-Clinic patient to Cabin 1 / Consultation Room with sound chime
  const handleCallCabin = async (pat: PatientQueueItem) => {
    playClinicChime();
    setCallingPatientId(pat.id);
    setSelectedPatientId(pat.id);
    setSelectedPatientName(pat.name);
    setSelectedPatientPhone(pat.phone || "+91 98370 12345");
    setSelectedTokenNumber(pat.tokenNumber);

    if (pat.queueItemId) {
      await updateQueueStatus(pat.queueItemId, "calling");
    }

    setTimeout(() => {
      setCallingPatientId(null);
      if (pat.queueItemId) {
        updateQueueStatus(pat.queueItemId, "in_consultation");
      }
    }, 1800);
  };

  // Apply prescription preset
  const handleApplyPreset = (preset: typeof PRESCRIPTION_PRESETS[0]) => {
    setDiagnosis(preset.diagnosis);
    setMedicines(preset.medicines);
    setReferralXray(preset.xray);
    setReferralBlood(preset.blood);
    setReferralUsg(preset.usg);
  };

  // Call patient via real-time WebRTC and Socket
  const handleCallPatient = async (patient: PatientQueueItem) => {
    if (!currentUser) return;
    setCallingPatientId(patient.id);

    try {
      // 1. Create or initiate consultation session in backend
      const res: any = await apiClient.post("/consultations/initiate", {
        doctorId: currentUser.id,
        patientId: patient.id,
        type: "video",
      });
      const consultation = res?.consultation || res;
      const consultationId = consultation?.id || `consult-doc-${Date.now()}`;

      // 2. Set client state in call store
      startOutgoingCall({
        id: consultationId,
        patientId: patient.id,
        patientName: patient.name,
        patientAvatar: patient.avatarUrl,
        doctorId: currentUser.id,
        doctorName: currentUser.name || "Dr. Raees Akhtar",
        doctorAvatar: currentUser.avatarUrl,
        doctorSpecialization: "General Physician & Family Medicine",
        ratePerMinute: 15,
        callerRole: "doctor",
      });

      // 3. Emit real-time WebRTC ring event to patient socket room
      const socket = getSocket();
      socket.emit("call-user", {
        consultationId,
        patientId: patient.id,
        patientName: patient.name,
        patientAvatar: patient.avatarUrl,
        doctorId: currentUser.id,
        doctorUserId: currentUser.id,
        ratePerMinute: 15,
        callerRole: "doctor",
      });

      socket.emit("join-consultation", consultationId);
    } catch (err: any) {
      console.warn("Initiate consultation fallback to direct call:", err);
      const fallbackId = `consult-doc-${Date.now()}`;
      startOutgoingCall({
        id: fallbackId,
        patientId: patient.id,
        patientName: patient.name,
        patientAvatar: patient.avatarUrl,
        doctorId: currentUser.id,
        doctorName: currentUser.name || "Dr. Raees Akhtar",
        doctorAvatar: currentUser.avatarUrl,
        doctorSpecialization: "General Physician & Family Medicine",
        ratePerMinute: 15,
        callerRole: "doctor",
      });

      const socket = getSocket();
      socket.emit("call-user", {
        consultationId: fallbackId,
        patientId: patient.id,
        patientName: patient.name,
        patientAvatar: patient.avatarUrl,
        doctorId: currentUser.id,
        doctorUserId: currentUser.id,
        ratePerMinute: 15,
        callerRole: "doctor",
      });
      socket.emit("join-consultation", fallbackId);
    } finally {
      setCallingPatientId(null);
    }
  };

  // Call Next Patient in queue
  const handleCallNextPatient = async () => {
    try {
      const nextPat = await callNext();
      if (nextPat) {
        handleCallPatient({
          id: nextPat.patientId,
          name: nextPat.patientName,
          phone: nextPat.patientPhone,
          balance: nextPat.patientBalance !== undefined ? Number(nextPat.patientBalance) : 0,
          avatarUrl: nextPat.patientAvatar,
          symptom: nextPat.symptom,
          tokenNumber: nextPat.tokenNumber,
        });
      }
    } catch (err: any) {
      alert(err.message || "No patient waiting in queue");
    }
  };

  // Issue digital prescription
  const handleIssuePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    setPrescriptionSent(true);
    const match = patients.find((p) => p.id === selectedPatientId);
    if ((match as any)?.queueItemId) {
      updateQueueStatus((match as any).queueItemId, "completed");
    }
    setTimeout(() => setPrescriptionSent(false), 6000);
  };

  // WhatsApp share link generator
  const getWhatsAppShareUrl = () => {
    const text = encodeURIComponent(
      `*REHMAT HEALTH CARE - DIGITAL E-PRESCRIPTION*\n` +
      `*Doctor:* Dr. Raees Akhtar (MBBS, MD - General Medicine)\n` +
      `*Clinic:* Beside Mohan X-Ray, Malviya Nagar, Moradabad\n\n` +
      `*Patient:* ${selectedPatientName}\n` +
      `*Diagnosis:* ${diagnosis}\n\n` +
      `*Rx & Medicines:*\n${medicines}\n\n` +
      `*Diagnostics Referral (Mohan X-Ray):*\n` +
      (referralXray ? `• Digital Chest X-Ray PA\n` : "") +
      (referralBlood ? `• Complete Blood CBC & ESR\n` : "") +
      (referralUsg ? `• Abdomen & Pelvis Ultrasound\n` : "") +
      `\n*Emergency Contact:* +91 98370 12345\n*Take medicines strictly as prescribed.*`
    );
    const cleanedPhone = selectedPatientPhone.replace(/[^0-9]/g, "");
    return `https://wa.me/${cleanedPhone || "919837012345"}?text=${text}`;
  };

  const clinicCount = patients.filter((p) => p.type === "clinic").length;
  const videoCount = patients.filter((p) => p.type === "video").length;

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.phone && p.phone.includes(searchQuery)) ||
      (p.symptom && p.symptom.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;
    if (queueFilter === "clinic") return p.type === "clinic";
    if (queueFilter === "video") return p.type === "video";
    return true;
  });

  return (
    <AuthGuard allowedRoles={["doctor", "admin"]}>
      <div className="flex min-h-screen flex-col bg-slate-50/60">
        <Navbar />

        {/* Widescreen Fluid Responsive Container */}
        <main className="flex-1 w-full max-w-[1720px] 2xl:max-w-[1880px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 pb-20 md:pb-8 space-y-6">
          {/* Doctor Header Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 p-6 sm:p-8 text-white shadow-xl border border-white/10">
            <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative shrink-0">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg border-2 border-white/20">
                    RA
                  </div>
                  <span
                    className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-slate-900 ${
                      opdStatus === "online"
                        ? "bg-emerald-400 animate-pulse"
                        : opdStatus === "busy"
                        ? "bg-amber-400"
                        : "bg-slate-500"
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      Dr. Raees Akhtar
                    </h1>
                    <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-black text-emerald-300 border border-emerald-400/30">
                      Chief Physician Desk
                    </span>
                    <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-400/30">
                      NMC Registered
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-300">
                    MBBS, MD (General Medicine) • 10+ Years Dedicated Clinical Practice
                  </p>
                  <p className="text-xs text-slate-300 flex items-center gap-1.5 flex-wrap">
                    <span>Rehmat Health Care</span>
                    <span>•</span>
                    <span className="text-emerald-200">Beside Mohan X-Ray, Malviya Nagar, Moradabad</span>
                  </p>
                </div>
              </div>

              {/* Status Switcher & Billing Meter */}
              <div className="flex flex-col sm:items-end gap-3 shrink-0">
                <div className="flex items-center gap-1 rounded-2xl bg-white/10 p-1 border border-white/15 backdrop-blur-md">
                  <button
                    onClick={() => handleStatusChange("online")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      opdStatus === "online"
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
                    <span>Live Video OPD</span>
                  </button>
                  <button
                    onClick={() => handleStatusChange("busy")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      opdStatus === "busy"
                        ? "bg-amber-600 text-white shadow-md shadow-amber-900/40"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-amber-200" />
                    <span>In-Clinic OPD</span>
                  </button>
                  <button
                    onClick={() => handleStatusChange("offline")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      opdStatus === "offline"
                        ? "bg-slate-700 text-white shadow-md"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                    <span>Offline</span>
                  </button>
                </div>

                <div className="text-xs text-emerald-200 font-semibold flex items-center gap-2">
                  <span>Billing Rate: <strong className="text-white">₹15/min</strong></span>
                  <span>•</span>
                  <span>4.5 ★ Justdial Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Daily OPD Metrics Row using reusable StatCard component */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Patients Treated (Today)"
              value={16}
              subtext="12 In-Clinic + 4 Video OPD"
              icon={Users}
              badgeText="Active OPD"
              badgeVariant="emerald"
            />
            <StatCard
              label="Video OPD Minutes"
              value={74}
              suffix=" mins"
              subtext="Avg. 5.2 mins per consultation"
              icon={Clock}
              iconColor="text-emerald-600"
              badgeText="Live Sync"
            />
            <StatCard
              label="Tele-OPD Revenue"
              value={1110}
              prefix="₹"
              subtext="Fair wallet auto-deductions"
              icon={TrendingUp}
              iconColor="text-emerald-700"
              badgeText="Wallet Sync"
            />
            <StatCard
              label="Mohan X-Ray Orders"
              value={7}
              suffix=" Tests"
              subtext="4 X-Ray, 2 USG, 1 CBC"
              icon={Activity}
              iconColor="text-blue-600"
              badgeVariant="blue"
              badgeText="Next Door"
            />
          </div>

          {/* Widescreen 3-Column Ergonomic Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Column 1 (4 cols): Patient OPD Queue */}
            <div className="lg:col-span-4 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-600" />
                  <h2 className="font-extrabold text-slate-900 text-base">Patient OPD Queue</h2>
                </div>
                <PulseBadge
                  isLive={opdStatus === "online"}
                  label={`${patients.length} In Queue`}
                  variant="emerald"
                  size="sm"
                />
              </div>

              {/* Call Next Action Button */}
              <Button
                size="sm"
                disabled={isCallingNext || patients.length === 0}
                onClick={handleCallNextPatient}
                className="w-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs rounded-2xl h-11 shadow-md shadow-emerald-900/10 gap-2 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <Ticket className="h-4 w-4 text-emerald-200" />
                <span>{isCallingNext ? "Connecting Next Patient..." : "Call Next Patient in Line"}</span>
              </Button>

              {/* In-Clinic / Video Queue Filter Tabs using reusable MotionTabs */}
              <MotionTabs<"all" | "clinic" | "video">
                layoutId="doctor-queue-filter-tab"
                tabs={[
                  { id: "all", label: `All (${patients.length})` },
                  { id: "clinic", label: `In-Clinic (${clinicCount})`, icon: Building },
                  { id: "video", label: `Tele-OPD (${videoCount})`, icon: Video },
                ]}
                activeTab={queueFilter}
                onChange={(val) => setQueueFilter(val)}
              />

              {/* Quick Search using shadcn Input */}
              <div className="relative">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, phone or symptoms..."
                  className="pl-9 text-xs h-10 rounded-2xl border-slate-200"
                />
              </div>

              {/* Patient Cards List using reusable PatientQueueCard */}
              <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1">
                {filteredPatients.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs rounded-2xl border border-dashed border-slate-200">
                    No patients match your search query.
                  </div>
                ) : (
                  filteredPatients.map((pat) => (
                    <PatientQueueCard
                      key={pat.id}
                      patient={pat}
                      isSelected={selectedPatientId === pat.id}
                      isCalling={callingPatientId === pat.id}
                      onCall={handleCallPatient}
                      onCallCabin={handleCallCabin}
                      onSelectRx={handleSelectPatientForRx}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Column 2 (5 cols): E-Prescription & Diagnostics Desk with shadcn Components */}
            <div className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-600" />
                  <h2 className="font-extrabold text-slate-900 text-base">
                    E-Prescription & Diagnostics Pad
                  </h2>
                </div>
                <Badge variant="outline" className="text-slate-600 bg-slate-100 border-slate-200 text-[10px] font-bold">
                  Digital Rx
                </Badge>
              </div>

              {prescriptionSent && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-bold flex items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>E-Prescription signed & issued for {selectedPatientName}!</span>
                  </div>
                  <button
                    onClick={() => setPrescriptionSent(false)}
                    className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Quick Presets Strip */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Quick Presets:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESCRIPTION_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 text-[11px] font-bold text-slate-700 hover:text-emerald-800 border border-slate-200 transition-all text-left cursor-pointer"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleIssuePrescription} className="space-y-4">
                {/* Official shadcn Select Component */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Consulting Patient
                  </label>
                  <Select
                    value={selectedPatientId}
                    onValueChange={(id) => {
                      const pat = patients.find((p) => p.id === id);
                      if (pat) handleSelectPatientForRx(pat);
                    }}
                  >
                    <SelectTrigger className="h-11 rounded-2xl border-slate-300">
                      <SelectValue placeholder="Select consulting patient..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-200 shadow-xl">
                      <SelectGroup>
                        <SelectLabel className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                          OPD Queue Patients ({patients.length})
                        </SelectLabel>
                        {patients.map((pat) => (
                          <SelectItem
                            key={pat.id}
                            value={pat.id}
                            className="rounded-xl py-2 cursor-pointer text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{pat.name}</span>
                              <span className="text-[11px] text-slate-500">
                                ({pat.phone || pat.email || "Patient"})
                              </span>
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full ml-auto">
                                Wallet: {formatCurrency(pat.balance)}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* In-Clinic Patient Clinical Vitals Strip */}
                <div className="rounded-2xl border border-rose-200/80 bg-rose-50/50 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-950">
                      <HeartPulse className="h-4 w-4 text-rose-600" />
                      <span>Physical Clinical Vitals (In-Clinic OPD)</span>
                    </div>
                    <span className="text-[10px] text-rose-700 font-semibold bg-rose-100/80 px-2 py-0.5 rounded-full">
                      Moradabad Clinic
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-600 block mb-0.5">BP (mmHg)</span>
                      <Input
                        value={bp}
                        onChange={(e) => setBp(e.target.value)}
                        className="h-8 text-xs font-mono font-bold bg-white rounded-xl"
                        placeholder="120/80"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-600 block mb-0.5">Pulse (bpm)</span>
                      <Input
                        value={pulse}
                        onChange={(e) => setPulse(e.target.value)}
                        className="h-8 text-xs font-mono font-bold bg-white rounded-xl"
                        placeholder="74"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-600 block mb-0.5">SpO2 (%)</span>
                      <Input
                        value={spo2}
                        onChange={(e) => setSpo2(e.target.value)}
                        className="h-8 text-xs font-mono font-bold bg-white rounded-xl"
                        placeholder="98%"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-600 block mb-0.5">Temp (°F)</span>
                      <Input
                        value={temp}
                        onChange={(e) => setTemp(e.target.value)}
                        className="h-8 text-xs font-mono font-bold bg-white rounded-xl"
                        placeholder="98.4°F"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-600 block mb-0.5">Weight (kg)</span>
                      <Input
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="h-8 text-xs font-mono font-bold bg-white rounded-xl"
                        placeholder="68 kg"
                      />
                    </div>
                  </div>
                </div>

                {/* Clinical Diagnosis with shadcn Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Clinical Diagnosis
                  </label>
                  <Input
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="text-xs h-11 rounded-2xl border-slate-300 font-semibold"
                    placeholder="e.g. Acute Viral Bronchitis, Type 2 Diabetes"
                  />
                </div>

                {/* Prescribed Medicines with official shadcn Textarea */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700">
                      Prescribed Medicines & Dosage Regimen
                    </label>
                    <span className="text-[11px] font-medium text-slate-400">
                      Rx Format • TDS / BD / OD
                    </span>
                  </div>
                  <Textarea
                    rows={5}
                    value={medicines}
                    onChange={(e) => setMedicines(e.target.value)}
                    className="font-mono text-xs rounded-2xl border-slate-300 min-h-[110px]"
                    placeholder="1. Tab. Paracetamol 650mg — 1 tab TDS..."
                  />
                </div>

                {/* Mohan X-Ray Diagnostics Synergy Selection with official shadcn Checkbox */}
                <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                      <Activity className="h-4 w-4 text-blue-700" />
                      <span>Mohan X-Ray & Ultrasound Referral Next Door</span>
                    </div>
                    <Badge variant="outline" className="border-blue-200 bg-blue-100 text-blue-800 text-[10px] font-bold">
                      Malviya Nagar
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <label
                      htmlFor="xray-check"
                      className={`flex items-start gap-2.5 p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                        referralXray
                          ? "border-emerald-500 bg-emerald-50/70 ring-1 ring-emerald-500 shadow-2xs"
                          : "border-slate-200/90 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <Checkbox
                        id="xray-check"
                        checked={referralXray}
                        onCheckedChange={(checked) => setReferralXray(Boolean(checked))}
                        className="mt-0.5"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Digital Chest X-Ray</span>
                        <span className="text-[10px] text-slate-500">PA View • ~15 mins</span>
                      </div>
                    </label>

                    <label
                      htmlFor="blood-check"
                      className={`flex items-start gap-2.5 p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                        referralBlood
                          ? "border-emerald-500 bg-emerald-50/70 ring-1 ring-emerald-500 shadow-2xs"
                          : "border-slate-200/90 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <Checkbox
                        id="blood-check"
                        checked={referralBlood}
                        onCheckedChange={(checked) => setReferralBlood(Boolean(checked))}
                        className="mt-0.5"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">CBC & Blood Profile</span>
                        <span className="text-[10px] text-slate-500">Count & ESR • ~45m</span>
                      </div>
                    </label>

                    <label
                      htmlFor="usg-check"
                      className={`flex items-start gap-2.5 p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                        referralUsg
                          ? "border-emerald-500 bg-emerald-50/70 ring-1 ring-emerald-500 shadow-2xs"
                          : "border-slate-200/90 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <Checkbox
                        id="usg-check"
                        checked={referralUsg}
                        onCheckedChange={(checked) => setReferralUsg(Boolean(checked))}
                        className="mt-0.5"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Ultrasound USG</span>
                        <span className="text-[10px] text-slate-500">Abdomen / Pelvis</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Actions: Sign & Issue, WhatsApp, Print */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <Button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 rounded-2xl text-xs gap-1.5 shadow-sm"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Sign & Issue Rx</span>
                  </Button>

                  <a
                    href={getWhatsAppShareUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-emerald-300 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-800 font-bold h-11 rounded-2xl text-xs gap-1.5"
                    >
                      <Share2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>WhatsApp Rx</span>
                    </Button>
                  </a>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPrintModal(true)}
                    className="border-slate-300 text-slate-700 hover:bg-slate-100 font-bold h-11 rounded-2xl text-xs gap-1.5"
                  >
                    <Printer className="h-3.5 w-3.5 text-slate-600" />
                    <span>Print Slip</span>
                  </Button>
                </div>
              </form>
            </div>

            {/* Column 3 (3 cols): Mohan X-Ray Diagnostics Integration & Operations Desk */}
            <div className="lg:col-span-3 space-y-5">
              {/* Mohan X-Ray Diagnostic Hub */}
              <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50/80 via-white to-slate-50 p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">Mohan X-Ray Synergy</h3>
                    <p className="text-[11px] text-slate-500 font-semibold">Beside Clinic • Malviya Nagar</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Patients referred by Dr. Raees receive digital X-Ray and Ultrasound reports directly synchronized for live teleconsult review.
                </p>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-blue-100">
                    <span className="font-semibold text-slate-800">Digital Chest X-Ray</span>
                    <span className="font-bold text-emerald-700">~15 mins</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-blue-100">
                    <span className="font-semibold text-slate-800">3D/4D Ultrasound (USG)</span>
                    <span className="font-bold text-emerald-700">Same Day</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-blue-100">
                    <span className="font-semibold text-slate-800">Complete Blood (CBC/ESR)</span>
                    <span className="font-bold text-emerald-700">~45 mins</span>
                  </div>
                </div>
              </div>

              {/* Clinic Timings & Location Card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wide">
                    OPD Consultation Hours
                  </h4>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span className="font-medium">In-Clinic Morning</span>
                    <span className="font-bold text-slate-900">10:00 AM – 01:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span className="font-medium">In-Clinic Evening</span>
                    <span className="font-bold text-slate-900">05:30 PM – 08:30 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Live Tele-OPD Video</span>
                    <span className="font-bold text-emerald-700">24/7 On-Call</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600">
                  <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                  <span className="truncate">Malviya Nagar, Moradabad (244001)</span>
                </div>
              </div>

              {/* Fair Wallet Tele-Billing Rules */}
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                  <ShieldCheck className="h-4 w-4 text-emerald-700" />
                  <span>Fair Patient Billing Rules</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Patients are billed second-by-second at ₹15/min. If a call drops in under 15 seconds, no wallet deduction occurs.
                </p>
              </div>
            </div>
          </div>
        </main>

        <Footer />

        {/* Reusable Printable Prescription Modal */}
        <PrescriptionModal
          isOpen={showPrintModal}
          onClose={() => setShowPrintModal(false)}
          data={{
            patientName: selectedPatientName,
            patientPhone: selectedPatientPhone,
            tokenNumber: selectedTokenNumber,
            diagnosis,
            medicines,
            referralXray,
            referralBlood,
            referralUsg,
            vitals: {
              bp,
              pulse,
              spo2,
              temp,
              weight,
            },
          }}
        />
      </div>
    </AuthGuard>
  );
}
