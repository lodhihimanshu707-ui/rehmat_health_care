"use client";

import React from "react";
import { RoleSwitcher } from "./RoleSwitcher";
import { useAuthStore } from "@/stores/auth.store";
import { useWalletStore } from "@/stores/wallet.store";
import { formatCurrency } from "@/shared/utils/format";
import { siteConfig } from "@/config/site";
import {
  HeartPulse,
  Wallet as WalletIcon,
  PlusCircle,
  Phone,
  MapPin,
  Clock,
  Video,
  Globe,
} from "lucide-react";
import { Button } from "@/shared/ui/button";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenAppointmentModal?: () => void;
}

export function Navbar({ activeTab, onTabChange, onOpenAppointmentModal }: NavbarProps) {
  const { currentUser } = useAuthStore();
  const { cachedBalance, openRechargeModal } = useWalletStore();
  const isPatient = currentUser.role === "patient";

  const handleNavClick = (tab: string, anchorId?: string) => {
    if (tab === "website") {
      onTabChange("website");
      if (anchorId) {
        setTimeout(() => {
          const el = document.getElementById(anchorId);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      onTabChange(tab);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
      {/* Top Clinic Info Bar */}
      <div className="bg-emerald-950 text-white text-[11px] py-1.5 px-4 hidden sm:block">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-200">
              <MapPin className="h-3 w-3 text-emerald-400" />
              Near Mohan X-Ray, Malviya Nagar, Moradabad
            </span>
            <span className="text-emerald-800">•</span>
            <span className="flex items-center gap-1.5 text-emerald-200">
              <Clock className="h-3 w-3 text-emerald-400" />
              Clinic OPD: 9:00 AM – 9:00 PM (Teleconsult 24/7)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
              className="flex items-center gap-1.5 text-emerald-300 hover:text-white font-medium transition-colors"
            >
              <Phone className="h-3 w-3" />
              <span>Helpline: {siteConfig.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => handleNavClick("website")}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <HeartPulse className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                {siteConfig.name}
              </span>
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                Moradabad
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Malviya Nagar • Near Mohan X-Ray
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => handleNavClick("website")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "website"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick("website", "about")}
            className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-all"
          >
            About Clinic
          </button>
          <button
            onClick={() => handleNavClick("website", "services")}
            className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-all"
          >
            Specialities
          </button>
          <button
            onClick={() => handleNavClick("teleconsult")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "teleconsult"
                ? "bg-white text-emerald-700 shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Video className="h-3.5 w-3.5 text-emerald-600" />
            <span>Live Tele-OPD</span>
          </button>
          <button
            onClick={() => handleNavClick("chat")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "chat"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => handleNavClick("wallet")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "wallet"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Wallet & Ledger
          </button>
          <button
            onClick={() => handleNavClick("website", "timings")}
            className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-all"
          >
            Timings & Location
          </button>
        </nav>

        {/* Right Section: Balance, Fast Consult CTA & Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Quick Teleconsult action */}
          <Button
            size="sm"
            onClick={() => onTabChange("teleconsult")}
            className="hidden sm:inline-flex bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm gap-1.5 h-9"
          >
            <Video className="h-3.5 w-3.5" />
            <span>Consult Doctor (₹15/m)</span>
          </Button>

          {/* Patient Wallet Badge */}
          {isPatient && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/90 px-3 py-1.5">
              <WalletIcon className="h-4 w-4 text-emerald-700" />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-800">
                  Wallet
                </span>
                <span className="text-xs font-bold text-emerald-950">
                  {formatCurrency(cachedBalance)}
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={openRechargeModal}
                className="h-6 w-6 p-0 text-emerald-700 hover:bg-emerald-200/60 rounded-full"
                title="Recharge Balance"
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Multi-role demo switcher */}
          <RoleSwitcher />
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="flex lg:hidden border-t border-slate-100 bg-slate-50 px-3 py-2 justify-around text-xs font-semibold">
        <button
          onClick={() => handleNavClick("website")}
          className={`py-1 px-2.5 rounded-lg ${
            activeTab === "website" ? "bg-emerald-600 text-white" : "text-slate-600"
          }`}
        >
          Website
        </button>
        <button
          onClick={() => handleNavClick("teleconsult")}
          className={`py-1 px-2.5 rounded-lg ${
            activeTab === "teleconsult" ? "bg-emerald-600 text-white" : "text-slate-600"
          }`}
        >
          Tele-OPD
        </button>
        <button
          onClick={() => handleNavClick("chat")}
          className={`py-1 px-2.5 rounded-lg ${
            activeTab === "chat" ? "bg-emerald-600 text-white" : "text-slate-600"
          }`}
        >
          Messages
        </button>
        <button
          onClick={() => handleNavClick("wallet")}
          className={`py-1 px-2.5 rounded-lg ${
            activeTab === "wallet" ? "bg-emerald-600 text-white" : "text-slate-600"
          }`}
        >
          Wallet
        </button>
      </div>
    </header>
  );
}
