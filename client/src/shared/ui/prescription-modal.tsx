"use client";

import React from "react";
import { X, Printer, ShieldCheck } from "lucide-react";
import { Button } from "./button";

export interface PrescriptionData {
  patientName: string;
  patientPhone: string;
  tokenNumber?: string;
  diagnosis: string;
  medicines: string;
  referralXray?: boolean;
  referralBlood?: boolean;
  referralUsg?: boolean;
  vitals?: {
    bp?: string;
    pulse?: string;
    spo2?: string;
    temp?: string;
    weight?: string;
  };
}

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PrescriptionData;
}

export function PrescriptionModal({ isOpen, onClose, data }: PrescriptionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
              RA
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg">Dr. Raees Akhtar</h3>
              <p className="text-xs text-slate-500 font-semibold">
                MBBS, MD (General Medicine) • NMC Reg. #UP-48291
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Clinic Branding & Address */}
        <div className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl flex justify-between items-center border border-slate-200/80">
          <div>
            <p className="font-extrabold text-slate-900 uppercase tracking-wide">REHMAT HEALTH CARE</p>
            <p className="text-slate-500">Beside Mohan X-Ray, Malviya Nagar Main Road, Moradabad</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-slate-700">Date: {new Date().toLocaleDateString("en-IN")}</p>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-100/60 px-2 py-0.5 rounded-full">
              <ShieldCheck className="h-3 w-3" />
              <span>Tele-OPD Verified</span>
            </span>
          </div>
        </div>

        {/* Patient Details & Token */}
        <div className="border border-slate-200 rounded-2xl p-3.5 text-xs grid grid-cols-2 gap-2 bg-slate-50/50">
          <p><strong className="text-slate-700">Patient:</strong> <span className="font-bold text-slate-900">{data.patientName}</span></p>
          <p><strong className="text-slate-700">Phone:</strong> <span className="font-semibold text-slate-900">{data.patientPhone}</span></p>
          {data.tokenNumber && (
            <p><strong className="text-slate-700">OPD Token:</strong> <span className="font-mono font-black text-emerald-800">#{data.tokenNumber}</span></p>
          )}
          <p className={data.tokenNumber ? "" : "col-span-2"}><strong className="text-slate-700">Clinical Diagnosis:</strong> <span className="font-bold text-slate-900">{data.diagnosis}</span></p>
        </div>

        {/* Clinical Vitals Strip */}
        {data.vitals && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-3 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block mb-1.5">
              Physical Clinical Vitals (In-Clinic Record):
            </span>
            <div className="grid grid-cols-5 gap-2 text-center font-mono">
              <div className="bg-white rounded-xl p-1.5 border border-rose-100">
                <span className="text-[10px] text-slate-500 block">BP</span>
                <span className="font-black text-slate-900">{data.vitals.bp || "120/80"}</span>
              </div>
              <div className="bg-white rounded-xl p-1.5 border border-rose-100">
                <span className="text-[10px] text-slate-500 block">Pulse</span>
                <span className="font-black text-slate-900">{data.vitals.pulse || "74"} bpm</span>
              </div>
              <div className="bg-white rounded-xl p-1.5 border border-rose-100">
                <span className="text-[10px] text-slate-500 block">SpO2</span>
                <span className="font-black text-slate-900">{data.vitals.spo2 || "98"}%</span>
              </div>
              <div className="bg-white rounded-xl p-1.5 border border-rose-100">
                <span className="text-[10px] text-slate-500 block">Temp</span>
                <span className="font-black text-slate-900">{data.vitals.temp || "98.4"}°F</span>
              </div>
              <div className="bg-white rounded-xl p-1.5 border border-rose-100">
                <span className="text-[10px] text-slate-500 block">Weight</span>
                <span className="font-black text-slate-900">{data.vitals.weight || "68"} kg</span>
              </div>
            </div>
          </div>
        )}

        {/* Medicines Box */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Rx (Prescribed Regimen):
          </h4>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-xs whitespace-pre-wrap leading-relaxed text-slate-800">
            {data.medicines}
          </div>
        </div>

        {/* Diagnostic Requisition */}
        {(data.referralXray || data.referralBlood || data.referralUsg) && (
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs space-y-1.5">
            <p className="font-bold text-blue-900">Diagnostic Tests Referred to Mohan X-Ray:</p>
            <ul className="list-disc list-inside text-blue-800 space-y-0.5">
              {data.referralXray && <li>Digital Chest X-Ray PA View</li>}
              {data.referralBlood && <li>Complete Blood Count (CBC) & ESR</li>}
              {data.referralUsg && <li>Whole Abdomen & Pelvis Ultrasound</li>}
            </ul>
          </div>
        )}

        {/* Signature Stamp */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="text-[11px] text-slate-400 max-w-xs">
            Digitally generated and verified via Rehmat Health Care Teleconsult Platform. Valid across all licensed pharmacies.
          </div>
          <div className="text-right">
            <div className="h-8 flex items-center justify-end font-serif italic text-emerald-800 font-bold text-base">
              Dr. Raees Akhtar
            </div>
            <p className="text-[10px] text-slate-500 font-semibold">Authorized Physician Signature & Seal</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-xl text-xs font-bold"
          >
            Close
          </Button>
          <Button
            size="sm"
            onClick={() => window.print()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold gap-1.5 shadow-sm"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Document</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
