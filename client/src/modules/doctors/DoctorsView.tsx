"use client";

import React, { useState } from "react";
import { useDoctors } from "./useDoctors";
import { DoctorCard } from "./DoctorCard";
import { Search, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

interface DoctorsViewProps {
  onOpenChat: (doctorId: string, doctorName: string) => void;
  onCallInitiated: () => void;
}

export function DoctorsView({ onOpenChat, onCallInitiated }: DoctorsViewProps) {
  const { data: doctors, isLoading, isError, refetch } = useDoctors();
  const [search, setSearch] = useState("");

  const filteredDoctors = (doctors || []).filter(
    (doc) =>
      doc.user.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(search.toLowerCase()) ||
      doc.qualifications.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto  px-4 py-6 sm:px-6 space-y-6">
      {/* Clinic Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-100 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
            <span>Malviya Nagar, Moradabad Practice</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Consult Verified Doctors with Per-Minute Billing
          </h1>
          <p className="text-sm text-emerald-100/90 leading-relaxed">
            Rehmat Health Care brings primary medical care directly to your phone or computer. Recharge your wallet, pick a doctor, and pay strictly for the minutes you consult.
          </p>
        </div>

        {/* Decorative backdrop glow */}
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by doctor name or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white rounded-xl border-slate-200"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredDoctors.length} {filteredDoctors.length === 1 ? "Doctor" : "Doctors"}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-8 gap-1 rounded-lg text-xs"
            title="Refresh availability"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Loading & Error States */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-slate-100 animate-pulse border border-slate-200" />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-800 space-y-3">
          <AlertCircle className="h-8 w-8 text-rose-600" />
          <div>
            <h4 className="font-bold text-sm">Failed to connect to backend server</h4>
            <p className="text-xs text-rose-600 mt-1">Please make sure the server is running on port 5000.</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => refetch()} className="text-xs bg-white">
            Try Again
          </Button>
        </div>
      )}

      {/* Doctors Grid */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onOpenChat={onOpenChat}
              onCallInitiated={onCallInitiated}
            />
          ))}
        </div>
      )}
    </div>
  );
}

