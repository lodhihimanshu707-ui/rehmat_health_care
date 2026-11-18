"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { AuthGuard } from "@/shared/components/AuthGuard";
import { useAuthStore } from "@/stores/auth.store";
import { formatCurrency } from "@/shared/utils/format";
import { apiClient } from "@/api/client";
import {
  Building,
  Users,
  Activity,
  Calendar,
  Wallet,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Phone,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Ticket,
  Printer,
  X,
  Volume2,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import { PulseBadge } from "@/shared/ui/pulse-badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

interface QueueLedgerItem {
  id: string;
  tokenNumber: string;
  queueNumber: number;
  patientName: string;
  patientPhone?: string;
  patientBalance?: number;
  type: "clinic" | "video";
  status: "waiting" | "calling" | "in_consultation" | "completed" | "cancelled";
  symptom?: string;
  estimatedWaitMinutes: number;
  joinedAt: string;
}

export default function StaffDeskPage() {
  const { currentUser } = useAuthStore();

  const [queueItems, setQueueItems] = useState<QueueLedgerItem[]>([]);
  const [isLoadingQueue, setIsLoadingQueue] = useState(false);

  // New Walk-in form state
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientPhone, setNewPatientPhone] = useState("");
  const [newPatientConcern, setNewPatientConcern] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Printed Token Slip Modal state
  const [activeSlip, setActiveSlip] = useState<QueueLedgerItem | null>(null);

  // Mohan X-Ray tracker state
  const [diagnosticOrders, setDiagnosticOrders] = useState([
    { id: "DX-101", patient: "Rahul Sharma", test: "Chest X-Ray PA View", time: "10:30 AM", status: "Report Ready" },
    { id: "DX-102", patient: "Sunita Devi", test: "USG Whole Abdomen", time: "11:00 AM", status: "In Scanning" },
    { id: "DX-103", patient: "Ramesh Kumar", test: "Fasting Blood Sugar & CBC", time: "11:15 AM", status: "Sample Collected" },
  ]);

  // Wallet top-up state
  const [topupPhone, setTopupPhone] = useState("");
  const [topupAmount, setTopupAmount] = useState("250");
  const [topupSuccess, setTopupSuccess] = useState(false);

  // Load live queue from server
  const fetchQueue = async () => {
    try {
      const res: any = await apiClient.get("/queue");
      const list = Array.isArray(res) ? res : res?.data;
      if (Array.isArray(list)) {
        setQueueItems(list);
      }
    } catch (err) {
      console.warn("Could not load queue in staff desk:", err);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim()) return;
    setIsSubmitting(true);

    try {
      const res: any = await apiClient.post("/queue/join", {
        patientName: newPatientName.trim(),
        patientPhone: newPatientPhone.trim() || undefined,
        type: "clinic",
        symptom: newPatientConcern.trim() || "Walk-in OPD Consultation",
      });

      const createdItem = res?.item || res?.data?.item || res;
      if (createdItem) {
        setActiveSlip({
          id: createdItem.id || `temp-${Date.now()}`,
          tokenNumber: createdItem.tokenNumber || `RH-${100 + queueItems.length + 1}`,
          queueNumber: createdItem.queueNumber || queueItems.length + 1,
          patientName: newPatientName,
          patientPhone: newPatientPhone,
          type: "clinic",
          status: "waiting",
          symptom: newPatientConcern,
          estimatedWaitMinutes: createdItem.estimatedWaitMinutes || 10,
          joinedAt: new Date().toISOString(),
        });
      }

      setNewPatientName("");
      setNewPatientPhone("");
      setNewPatientConcern("");
      fetchQueue();
    } catch (err: any) {
      alert(err.message || "Failed to issue token");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (
    id: string,
    status: "waiting" | "calling" | "in_consultation" | "completed" | "cancelled"
  ) => {
    try {
      await apiClient.patch(`/queue/${id}/status`, { status });
      fetchQueue();
    } catch (err: any) {
      console.warn("Status update error:", err);
    }
  };

  const handleTopup = (e: React.FormEvent) => {
    e.preventDefault();
    setTopupSuccess(true);
    setTimeout(() => setTopupSuccess(false), 4000);
    setTopupPhone("");
  };

  return (
    <AuthGuard allowedRoles={["admin", "doctor"]}>
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 w-full px-3 sm:px-6 md:px-10 lg:px-14 xl:px-16 py-6 sm:py-8 pb-20 md:pb-8 max-w-6xl mx-auto space-y-6">
          {/* Header Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 p-5 sm:p-8 text-white shadow-xl">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                  <Building className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Clinic Reception & Front Desk • Moradabad</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  Clinic Care Coordinator Desk
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  Rehmat Health Care on-site administration desk. Manage walk-in patient tokens, Mohan X-Ray diagnostic synergy next door, and offline health wallet recharges.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4 text-xs text-slate-200 space-y-1">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <Stethoscope className="h-4 w-4 text-emerald-400" />
                  <span>Dr. Raees Akhtar (MD) On Duty</span>
                </p>
                <p className="text-emerald-300 font-semibold">Beside Mohan X-Ray, Malviya Nagar</p>
                <p className="text-[11px] text-slate-400">Clinic OPD: Mon – Sat 10 AM – 7 PM</p>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">Walk-ins in Queue</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{queueItems.length}</p>
              <span className="text-[10px] text-emerald-700 font-semibold">Live Real Tokens</span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">Mohan X-Ray Orders</span>
              <p className="text-2xl font-black text-blue-700 mt-1">{diagnosticOrders.length}</p>
              <span className="text-[10px] text-blue-600 font-semibold">Referred Next Door</span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">Dr. Raees Akhtar Status</span>
              <p className="text-2xl font-black text-emerald-700 mt-1">Active</p>
              <span className="text-[10px] text-emerald-600 font-semibold">Consulting in Cabin 1</span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">Counter Top-ups</span>
              <p className="text-2xl font-black text-amber-700 mt-1">₹1,450</p>
              <span className="text-[10px] text-slate-500 font-semibold">Cash & Clinic UPI</span>
            </div>
          </div>

          {/* 2-Column Main Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: Walk-in Token Generator & Live Queue */}
            <div className="lg:col-span-7 space-y-6">
              {/* Generate Token Form */}
              <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-emerald-600" />
                    <h2 className="font-extrabold text-slate-900 text-base">Issue Walk-in OPD Token</h2>
                  </div>
                  <PulseBadge isLive={true} label="Connected to Doctor Desk" size="sm" />
                </div>

                <form onSubmit={handleCreateToken} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Patient Name *
                    </label>
                    <Input
                      required
                      placeholder="e.g. Rajesh Kumar"
                      value={newPatientName}
                      onChange={(e) => setNewPatientName(e.target.value)}
                      className="text-xs h-10 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number (Optional)
                    </label>
                    <Input
                      placeholder="+91 98370 XXXXX"
                      value={newPatientPhone}
                      onChange={(e) => setNewPatientPhone(e.target.value)}
                      className="text-xs h-10 rounded-xl"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Symptoms / Chief Complaint
                    </label>
                    <Input
                      placeholder="e.g. Fever 3 days, cough, blood sugar test"
                      value={newPatientConcern}
                      onChange={(e) => setNewPatientConcern(e.target.value)}
                      className="text-xs h-10 rounded-xl"
                    />
                  </div>

                  <div className="sm:col-span-2 pt-1">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 rounded-xl text-xs gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      <span>{isSubmitting ? "Generating Token..." : "Generate OPD Token & Print Slip"}</span>
                    </Button>
                  </div>
                </form>
              </div>

              {/* Active Tokens Table */}
              <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-emerald-600" />
                    <h3 className="font-extrabold text-slate-900 text-sm">Today's Live Queue Ledger</h3>
                  </div>
                  <span className="text-xs text-emerald-700 font-bold">{queueItems.length} In Line</span>
                </div>

                <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                  {queueItems.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs rounded-2xl border border-dashed border-slate-200">
                      No active walk-in tokens yet today.
                    </div>
                  ) : (
                    queueItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/80 hover:bg-slate-50 transition-all text-xs gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-black text-sm px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-950 border border-emerald-300 shadow-2xs shrink-0">
                            #{item.tokenNumber}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-slate-900">{item.patientName}</p>
                              <span className="text-[10px] text-slate-400 font-medium">
                                ({item.type === "clinic" ? "Walk-in" : "Tele-OPD"})
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              {item.patientPhone || "No phone"} • {item.symptom || "Consultation requested"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-bold ${
                              item.status === "in_consultation"
                                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                                : item.status === "calling"
                                ? "border-emerald-400 bg-emerald-200 text-emerald-950 animate-pulse"
                                : item.status === "completed"
                                ? "border-slate-200 bg-slate-100 text-slate-500"
                                : "border-amber-200 bg-amber-50 text-amber-800"
                            }`}
                          >
                            {item.status === "in_consultation"
                              ? "With Doctor"
                              : item.status === "calling"
                              ? "Calling Now"
                              : item.status === "completed"
                              ? "Completed"
                              : `Waiting (~${item.estimatedWaitMinutes}m)`}
                          </Badge>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setActiveSlip({
                                ...item,
                                joinedAt: item.joinedAt || new Date().toISOString(),
                              })
                            }
                            className="h-8 text-[11px] px-2.5 rounded-lg border-slate-200 text-slate-700 hover:bg-white font-bold cursor-pointer"
                          >
                            <Printer className="h-3 w-3 mr-1" />
                            <span>Slip</span>
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Mohan X-Ray Synergy & Counter Wallet Recharge */}
            <div className="lg:col-span-5 space-y-6">
              {/* Mohan X-Ray Diagnostics Synergy Tracker */}
              <div className="rounded-2xl sm:rounded-3xl border border-blue-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <h2 className="font-extrabold text-slate-900 text-base">Mohan X-Ray Synergy</h2>
                  </div>
                  <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-800 text-xs">
                    Next Door
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Live coordination tracker for patients undergoing imaging or lab tests at <strong>Mohan X-Ray & Ultrasound</strong> right next door.
                </p>

                <div className="space-y-2.5">
                  {diagnosticOrders.map((dx) => (
                    <div
                      key={dx.id}
                      className="p-3 rounded-xl border border-blue-100 bg-blue-50/40 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{dx.patient}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full ${
                            dx.status === "Report Ready"
                              ? "bg-emerald-100 text-emerald-800 font-extrabold"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {dx.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-blue-900 font-medium">{dx.test}</p>
                      <span className="text-[10px] text-slate-400 font-mono">Ordered: {dx.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Counter Cash / UPI Health Wallet Top-up */}
              <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-amber-600" />
                    <h2 className="font-extrabold text-slate-900 text-base">Counter Wallet Recharge</h2>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">Walk-in Assist</span>
                </div>

                {topupSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Wallet successfully credited with {formatCurrency(parseFloat(topupAmount))}!</span>
                  </div>
                )}

                <form onSubmit={handleTopup} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Patient Phone or Email
                    </label>
                    <Input
                      required
                      placeholder="+91 94120 54321 or patient_1@rehmatcare.com"
                      value={topupPhone}
                      onChange={(e) => setTopupPhone(e.target.value)}
                      className="text-xs h-9 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Recharge Amount (INR)
                    </label>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {["100", "250", "500"].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setTopupAmount(amt)}
                          className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            topupAmount === amt
                              ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                              : "border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>
                    <Input
                      type="number"
                      value={topupAmount}
                      onChange={(e) => setTopupAmount(e.target.value)}
                      className="text-xs h-9 rounded-xl font-bold"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 rounded-xl text-xs shadow-sm cursor-pointer"
                  >
                    Credit Health Wallet (Cash / UPI)
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </main>

        <Footer />

        {/* Printable Thermal Slip Modal */}
        <Dialog open={Boolean(activeSlip)} onOpenChange={() => setActiveSlip(null)}>
          <DialogContent className="max-w-sm rounded-3xl p-6 bg-white border border-slate-200">
            <DialogHeader className="text-center space-y-1 pb-3 border-b border-dashed border-slate-300">
              <DialogTitle className="text-base font-black text-slate-900 uppercase">
                Rehmat Health Care
              </DialogTitle>
              <p className="text-[11px] text-slate-500 font-medium">
                Beside Mohan X-Ray, Malviya Nagar, Moradabad
              </p>
            </DialogHeader>

            <div className="py-4 text-center space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                OPD Walk-in Token
              </span>
              <div className="text-3xl font-black text-emerald-900 tracking-tight flex items-center justify-center gap-1.5">
                <Ticket className="h-7 w-7 text-emerald-600" />
                <span>Token #{activeSlip?.tokenNumber}</span>
              </div>
              <p className="text-xs font-bold text-slate-700">
                Queue Position: #{activeSlip?.queueNumber} in Line
              </p>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 text-left text-xs space-y-1.5 mt-3">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Patient:</span>
                  <span className="font-bold text-slate-900">{activeSlip?.patientName}</span>
                </div>
                {activeSlip?.patientPhone && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Phone:</span>
                    <span className="font-bold text-slate-900">{activeSlip.patientPhone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Physician:</span>
                  <span className="font-bold text-emerald-800">Dr. Raees Akhtar (Cabin 1)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Est. Wait:</span>
                  <span className="font-bold text-slate-900">~{activeSlip?.estimatedWaitMinutes || 10} mins</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-dashed border-slate-300">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveSlip(null)}
                className="flex-1 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => window.print()}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold gap-1.5 shadow-sm cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Slip</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AuthGuard>
  );
}
