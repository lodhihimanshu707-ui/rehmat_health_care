"use client";

import React from "react";
import { useAuthStore, DEMO_PATIENT, DEMO_DOCTOR } from "@/stores/auth.store";
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
  MessageSquare,
  LogIn,
  LogOut,
  UserCheck,
  Stethoscope,
  ArrowLeftRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/shared/ui/button";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenAppointmentModal?: () => void;
}

export function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const {
    currentUser,
    isAuthenticated,
    openAuthModal,
    logout,
    toggleRole,
    quickLogin,
  } = useAuthStore();
  const { cachedBalance, openRechargeModal } = useWalletStore();
  const isPatient = currentUser.role === "patient";

  const handleNavClick = (tab: string, anchorId?: string) => {
    if (tab === "website") {
      onTabChange("website");
      if (anchorId) {
        setTimeout(() => {
          const el = document.getElementById(anchorId);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 80);
      }
    } else {
      onTabChange(tab);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Clinic Info Strip */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden md:block">
        <div className="w-full px-2 sm:px-6 md:px-10 lg:px-14 xl:px-16 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Near Mohan Xray, Malviya Nagar, Moradabad (244001)</span>
            </span>
            <span className="text-slate-700">•</span>
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Clock className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Clinic OPD: Mon – Sat 10 AM – 7 PM | Tele-OPD: 24/7</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Call Clinic: {siteConfig.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <div
            className="flex items-center gap-3 cursor-pointer shrink-0 group"
            onClick={() => handleNavClick("website")}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-200">
              <HeartPulse className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {siteConfig.name}
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800 tracking-wide uppercase">
                  Moradabad
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Malviya Nagar • Beside Mohan X-Ray
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1 rounded-2xl bg-slate-100/80 p-1 border border-slate-200/60">
            <button
              onClick={() => handleNavClick("website")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeTab === "website"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick("website", "about")}
              className="rounded-xl px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 transition-all"
            >
              About
            </button>
            <button
              onClick={() => handleNavClick("website", "services")}
              className="rounded-xl px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 transition-all"
            >
              Specialities
            </button>
            <button
              onClick={() => handleNavClick("website", "doctors")}
              className="rounded-xl px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 transition-all"
            >
              Doctors
            </button>
            <button
              onClick={() => handleNavClick("teleconsult")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "teleconsult"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-emerald-700 hover:bg-emerald-100/60"
              }`}
            >
              <Video className="h-3.5 w-3.5" />
              <span>Live Tele-OPD</span>
            </button>
            <button
              onClick={() => handleNavClick("chat")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "chat"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Chat</span>
            </button>
            {isAuthenticated && isPatient && (
              <button
                onClick={() => handleNavClick("wallet")}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "wallet"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <WalletIcon className="h-3.5 w-3.5" />
                <span>Wallet</span>
              </button>
            )}
            <button
              onClick={() => handleNavClick("website", "timings")}
              className="rounded-xl px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 transition-all"
            >
              Timings
            </button>
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Quick Live Teleconsult button */}
            <Button
              size="sm"
              onClick={() => onTabChange("teleconsult")}
              className="hidden sm:inline-flex bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 gap-1.5 h-9 px-3.5 transition-all hover:scale-[1.02]"
            >
              <Video className="h-3.5 w-3.5" />
              <span>Consult (₹15/m)</span>
            </Button>

            {/* If Authenticated: Show Wallet & Profile */}
            {isAuthenticated ? (
              <>
                {/* Patient Wallet Badge */}
                {isPatient && (
                  <div className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-1.5 shadow-2xs">
                    <WalletIcon className="h-4 w-4 text-emerald-700 shrink-0" />
                    <span className="text-xs font-extrabold text-emerald-950">
                      {formatCurrency(cachedBalance)}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={openRechargeModal}
                      className="h-5 w-5 p-0 text-emerald-700 hover:bg-emerald-200/60 rounded-full"
                      title="Add balance to Health Wallet"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}

                {/* Logged-In User Profile */}
                <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
                  <div className="flex items-center gap-1.5 px-2 py-0.5">
                    {isPatient ? (
                      <UserCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Stethoscope className="h-4 w-4 text-blue-600 shrink-0" />
                    )}
                    <div className="flex flex-col text-left leading-none">
                      <span className="text-xs font-extrabold text-slate-900 truncate max-w-[95px]">
                        {currentUser.name}
                      </span>
                      <span className="text-[9px] text-slate-500 font-semibold capitalize">
                        {currentUser.role} Mode
                      </span>
                    </div>
                  </div>

                  {/* Switch Demo Role */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleRole}
                    className="h-7 gap-1 rounded-lg bg-slate-100 px-2 text-[11px] font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    title="Switch between Patient and Doctor for demo testing"
                  >
                    <ArrowLeftRight className="h-3 w-3" />
                    <span>Switch</span>
                  </Button>

                  {/* Sign Out */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={logout}
                    className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg ml-0.5"
                    title="Sign Out"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </>
            ) : (
              /* If NOT Authenticated: Show Clean Sign In & 1-Click Demo Login */
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => openAuthModal("login")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs gap-1.5 h-9 px-3.5"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Sign In</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => quickLogin(DEMO_PATIENT.id)}
                  className="bg-white border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-2xs gap-1.5 h-9 px-3"
                  title="One-click demo login as Mohd. Imran"
                >
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Demo Login</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="flex xl:hidden border-t border-slate-100 bg-slate-50/95 px-3 py-2 justify-around text-xs font-semibold backdrop-blur-sm">
        <button
          onClick={() => handleNavClick("website")}
          className={`py-1.5 px-3 rounded-xl transition-all ${
            activeTab === "website" ? "bg-emerald-600 text-white font-bold shadow-xs" : "text-slate-600"
          }`}
        >
          Website
        </button>
        <button
          onClick={() => handleNavClick("teleconsult")}
          className={`py-1.5 px-3 rounded-xl flex items-center gap-1 transition-all ${
            activeTab === "teleconsult" ? "bg-emerald-600 text-white font-bold shadow-xs" : "text-slate-600"
          }`}
        >
          <Video className="h-3.5 w-3.5" />
          <span>Tele-OPD</span>
        </button>
        <button
          onClick={() => handleNavClick("chat")}
          className={`py-1.5 px-3 rounded-xl transition-all ${
            activeTab === "chat" ? "bg-emerald-600 text-white font-bold shadow-xs" : "text-slate-600"
          }`}
        >
          Chat
        </button>
        {isAuthenticated && isPatient && (
          <button
            onClick={() => handleNavClick("wallet")}
            className={`py-1.5 px-3 rounded-xl transition-all ${
              activeTab === "wallet" ? "bg-emerald-600 text-white font-bold shadow-xs" : "text-slate-600"
            }`}
          >
            Wallet
          </button>
        )}
      </div>
    </header>
  );
}
