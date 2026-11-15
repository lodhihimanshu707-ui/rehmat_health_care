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
  MessageSquare,
  LogIn,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/shared/ui/button";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenAppointmentModal?: () => void;
}

export function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const { currentUser, isAuthenticated, openAuthModal, logout } = useAuthStore();
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
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
      {/* Top Clinic Info Bar */}
      <div className="bg-emerald-950 text-white text-[11px] py-1 px-4 hidden md:block">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-200">
              <MapPin className="h-3 w-3 text-emerald-400 shrink-0" />
              Near Mohan X-Ray, Malviya Nagar, Moradabad
            </span>
            <span className="text-emerald-800">•</span>
            <span className="flex items-center gap-1.5 text-emerald-200">
              <Clock className="h-3 w-3 text-emerald-400 shrink-0" />
              OPD: 9:00 AM – 9:00 PM (Teleconsult 24/7)
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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 gap-3">
        {/* Brand */}
        <div
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
          onClick={() => handleNavClick("website")}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20 shrink-0">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                {siteConfig.name}
              </span>
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                Moradabad
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium whitespace-nowrap">
              Near Mohan X-Ray, Malviya Nagar
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 rounded-xl bg-slate-100/90 p-1 shrink-0">
          <button
            onClick={() => handleNavClick("website")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "website"
                ? "bg-white text-emerald-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick("website", "about")}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-all"
          >
            About
          </button>
          <button
            onClick={() => handleNavClick("website", "services")}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-all"
          >
            Specialities
          </button>
          <button
            onClick={() => handleNavClick("website", "doctors")}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-all"
          >
            Doctors
          </button>
          <button
            onClick={() => handleNavClick("teleconsult")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "teleconsult"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-emerald-700 hover:bg-emerald-50"
            }`}
          >
            <Video className="h-3.5 w-3.5" />
            <span>Live Tele-OPD</span>
          </button>
          <button
            onClick={() => handleNavClick("chat")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "chat"
                ? "bg-white text-emerald-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Chat</span>
          </button>
          <button
            onClick={() => handleNavClick("wallet")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "wallet"
                ? "bg-white text-emerald-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <WalletIcon className="h-3.5 w-3.5" />
            <span>Wallet</span>
          </button>
          <button
            onClick={() => handleNavClick("website", "timings")}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-all"
          >
            Timings
          </button>
        </nav>

        {/* Right Section: Auth Button, Wallet & Demo Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Patient Wallet Pill (if patient) */}
          {isPatient && (
            <div className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/90 px-2.5 py-1">
              <WalletIcon className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
              <span className="text-xs font-bold text-emerald-950">
                {formatCurrency(cachedBalance)}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={openRechargeModal}
                className="h-5 w-5 p-0 text-emerald-700 hover:bg-emerald-200/60 rounded-full"
                title="Recharge Balance"
              >
                <PlusCircle className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}

          {/* Real Authentication Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-xs">
                <User className="h-3.5 w-3.5 text-emerald-600" />
                <span className="font-semibold text-slate-800 max-w-[80px] truncate">
                  {currentUser.name}
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={logout}
                className="h-7 w-7 p-0 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                title="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() => openAuthModal("login")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs gap-1.5 h-8 px-3"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </Button>
          )}

          {/* Demo Role Switcher */}
          <RoleSwitcher />
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="flex lg:hidden border-t border-slate-100 bg-slate-50 px-2 py-1.5 justify-around text-xs font-semibold">
        <button
          onClick={() => handleNavClick("website")}
          className={`py-1 px-3 rounded-lg ${
            activeTab === "website" ? "bg-emerald-600 text-white font-bold" : "text-slate-600"
          }`}
        >
          Website
        </button>
        <button
          onClick={() => handleNavClick("teleconsult")}
          className={`py-1 px-3 rounded-lg flex items-center gap-1 ${
            activeTab === "teleconsult" ? "bg-emerald-600 text-white font-bold" : "text-slate-600"
          }`}
        >
          <Video className="h-3 w-3" />
          <span>Tele-OPD</span>
        </button>
        <button
          onClick={() => handleNavClick("chat")}
          className={`py-1 px-3 rounded-lg ${
            activeTab === "chat" ? "bg-emerald-600 text-white font-bold" : "text-slate-600"
          }`}
        >
          Chat
        </button>
        <button
          onClick={() => handleNavClick("wallet")}
          className={`py-1 px-3 rounded-lg ${
            activeTab === "wallet" ? "bg-emerald-600 text-white font-bold" : "text-slate-600"
          }`}
        >
          Wallet
        </button>
      </div>
    </header>
  );
}
