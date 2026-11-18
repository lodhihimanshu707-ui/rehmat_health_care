"use client";

import React from "react";
import Link from "next/link";
import { Video, MessageSquare, FileText, Clock, MapPin, CheckCircle2, Ticket, Volume2, Building } from "lucide-react";
import { Button } from "./button";
import { formatCurrency } from "@/shared/utils/format";
import { cn } from "@/shared/utils/cn";

export interface PatientQueueItem {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  balance: number;
  avatarUrl?: string;
  lastSeen?: string;
  symptom?: string;
  tokenNumber?: string;
  queueNumber?: number;
  status?: "waiting" | "calling" | "in_consultation" | "completed" | "cancelled" | string;
  type?: "video" | "clinic";
  estimatedWaitMinutes?: number;
  queueItemId?: string;
}

interface PatientQueueCardProps {
  patient: PatientQueueItem;
  isSelected?: boolean;
  isCalling?: boolean;
  onCall: (patient: PatientQueueItem) => void;
  onCallCabin?: (patient: PatientQueueItem) => void;
  onSelectRx: (patient: PatientQueueItem) => void;
  className?: string;
}

export function PatientQueueCard({
  patient,
  isSelected = false,
  isCalling = false,
  onCall,
  onCallCabin,
  onSelectRx,
  className,
}: PatientQueueCardProps) {
  const isCallingStatus = patient.status === "calling" || isCalling;
  const isInConsultation = patient.status === "in_consultation";
  const isCompleted = patient.status === "completed";
  const isClinic = patient.type === "clinic";

  const handleCallAction = () => {
    if (isClinic && onCallCabin) {
      onCallCabin(patient);
    } else {
      onCall(patient);
    }
  };

  return (
    <div
      className={cn(
        "p-4 rounded-3xl border transition-all duration-200 space-y-3.5",
        isSelected
          ? "border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/30 shadow-md"
          : isCallingStatus
          ? "border-emerald-400 bg-emerald-50/70 shadow-md shadow-emerald-600/10"
          : "border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs",
        className
      )}
    >
      {/* 1. Real Token & Queue Position Header Strip */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Token Badge */}
          <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-950 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-2xs">
            <Ticket className="h-3 w-3 text-emerald-700" />
            <span>Token #{patient.tokenNumber || "RH-101"}</span>
          </span>

          {/* Queue Position */}
          <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            {patient.queueNumber ? `#${patient.queueNumber} in Queue` : "Waiting"}
          </span>

          {/* Mode Badge */}
          <span className="text-[10px] font-semibold text-slate-600 inline-flex items-center gap-1">
            {patient.type === "clinic" ? (
              <>
                <MapPin className="h-3 w-3 text-rose-500" />
                <span>Walk-in OPD</span>
              </>
            ) : (
              <>
                <Video className="h-3 w-3 text-emerald-600" />
                <span>Live Video Tele-OPD</span>
              </>
            )}
          </span>
        </div>

        {/* Live Queue Status Badge */}
        <div>
          {isCallingStatus ? (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-emerald-900 bg-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-400 animate-pulse">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-ping" />
              <span>Calling Now</span>
            </span>
          ) : isInConsultation ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-200">
              <Video className="h-3 w-3 text-blue-600" />
              <span>In Consult</span>
            </span>
          ) : isCompleted ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              <CheckCircle2 className="h-3 w-3 text-slate-500" />
              <span>Completed</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-300">
              <Clock className="h-3 w-3 text-amber-700" />
              <span>In Line (~{patient.estimatedWaitMinutes || 2}m)</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. Patient Identity & Chief Concern */}
      <div className="space-y-1.5 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-slate-900 text-sm truncate">{patient.name}</h3>
            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
              Wallet: {formatCurrency(patient.balance)}
            </span>
          </div>

          <p className="text-xs text-slate-500 truncate font-mono">
            {patient.phone || "No phone"}{patient.email ? ` • ${patient.email}` : ""}
          </p>
        </div>

        <p className="text-xs text-slate-700 leading-snug line-clamp-2">
          Chief Concern: <strong className="text-slate-900">{patient.symptom || "Consultation requested"}</strong>
        </p>
      </div>

      {/* 3. Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <Button
          size="sm"
          disabled={isCalling}
          onClick={handleCallAction}
          className={cn(
            "text-white font-bold text-xs rounded-xl h-9 px-3 gap-1.5 flex-1 shadow-xs cursor-pointer transition-all",
            isClinic
              ? "bg-teal-700 hover:bg-teal-800"
              : isCallingStatus
              ? "bg-emerald-600 hover:bg-emerald-700 animate-pulse"
              : "bg-emerald-600 hover:bg-emerald-700"
          )}
        >
          {isClinic ? (
            <>
              <Volume2 className="h-3.5 w-3.5 text-teal-200" />
              <span>{isCalling ? "Calling Cabin..." : "Call to Cabin 1"}</span>
            </>
          ) : (
            <>
              <Video className="h-3.5 w-3.5" />
              <span>{isCalling ? "Ringing..." : "Call Patient"}</span>
            </>
          )}
        </Button>

        <Link
          href={`/chat?recipientId=${patient.id}&recipientName=${encodeURIComponent(patient.name)}`}
          className="flex-1"
        >
          <Button
            variant="outline"
            size="sm"
            className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 text-xs rounded-xl h-9 gap-1.5 font-bold cursor-pointer"
          >
            <MessageSquare className="h-3.5 w-3.5 text-slate-500" />
            <span>Chat</span>
          </Button>
        </Link>

        <Button
          variant={isSelected ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectRx(patient)}
          className={cn(
            "text-xs rounded-xl h-9 gap-1.5 font-bold px-3 cursor-pointer",
            isSelected
              ? "bg-slate-900 text-white hover:bg-slate-800"
              : "border-slate-200 text-slate-700 hover:bg-white"
          )}
        >
          <FileText className="h-3.5 w-3.5" />
          <span>{isSelected ? "Selected" : "Select Rx"}</span>
        </Button>
      </div>
    </div>
  );
}
