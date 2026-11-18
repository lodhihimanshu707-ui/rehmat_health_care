"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { useWalletStore } from "@/stores/wallet.store";
import { formatCurrency } from "@/shared/utils/format";
import {
  Home,
  Video,
  MessageSquare,
  Wallet as WalletIcon,
  Calendar,
  User,
} from "lucide-react";
import { AppointmentModal } from "@/modules/website/AppointmentModal";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { isAuthenticated, currentUser } = useAuthStore();
  const { cachedBalance } = useWalletStore();
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  const isPatient = currentUser?.role === "patient";

  // DO NOT show tabs in website! ONLY show tabs in App (/patient, /doctor, /staff, /chat, /wallet)
  const isAppRoute =
    pathname.startsWith("/patient") ||
    pathname.startsWith("/doctor") ||
    pathname.startsWith("/staff") ||
    pathname.startsWith("/chat") ||
    pathname.startsWith("/wallet");

  if (!isAppRoute) {
    return null;
  }

  const isActive = (route: string) => {
    if (route === "/patient") return pathname === "/patient";
    return pathname.startsWith(route);
  };

  return (
    <>
      <nav
        aria-label="App Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 block md:hidden bg-white/98 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-2 py-1 safe-area-bottom"
      >
        <div className="flex items-center justify-around h-14 max-w-md mx-auto">
          {/* If Doctor App */}
          {isAuthenticated && currentUser?.role === "doctor" ? (
            <>
              <Link
                href="/doctor"
                className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all ${
                  isActive("/doctor")
                    ? "text-emerald-700 font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <div className={`p-1 rounded-xl ${isActive("/doctor") ? "bg-emerald-100 text-emerald-800" : ""}`}>
                  <Video className="h-5 w-5" />
                </div>
                <span className="text-[10px] leading-tight mt-0.5 font-medium">Cockpit</span>
              </Link>

              <Link
                href="/chat"
                className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all ${
                  isActive("/chat")
                    ? "text-emerald-700 font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <div className={`p-1 rounded-xl ${isActive("/chat") ? "bg-emerald-50 text-emerald-700" : ""}`}>
                  <MessageSquare className="h-5 w-5" />
                </div>
                <span className="text-[10px] leading-tight mt-0.5 font-medium">Chat</span>
              </Link>

              <Link
                href="/teleconsult"
                className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all ${
                  isActive("/teleconsult")
                    ? "text-emerald-700 font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <div className={`p-1 rounded-xl ${isActive("/teleconsult") ? "bg-emerald-50 text-emerald-700" : ""}`}>
                  <Video className="h-5 w-5" />
                </div>
                <span className="text-[10px] leading-tight mt-0.5 font-medium">Room</span>
              </Link>

              <Link
                href="/"
                className="flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all text-slate-500 hover:text-slate-800"
              >
                <div className="p-1 rounded-xl hover:bg-slate-100">
                  <Home className="h-5 w-5" />
                </div>
                <span className="text-[10px] leading-tight mt-0.5 font-medium">Website</span>
              </Link>
            </>
          ) : isAuthenticated && currentUser?.role === "admin" ? (
            /* If Staff Desk App */
            <>
              <Link
                href="/staff"
                className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all ${
                  isActive("/staff")
                    ? "text-blue-700 font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <div className={`p-1 rounded-xl ${isActive("/staff") ? "bg-blue-100 text-blue-800" : ""}`}>
                  <User className="h-5 w-5" />
                </div>
                <span className="text-[10px] leading-tight mt-0.5 font-medium">Staff Desk</span>
              </Link>

              <Link
                href="/chat"
                className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all ${
                  isActive("/chat")
                    ? "text-emerald-700 font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <div className={`p-1 rounded-xl ${isActive("/chat") ? "bg-emerald-50 text-emerald-700" : ""}`}>
                  <MessageSquare className="h-5 w-5" />
                </div>
                <span className="text-[10px] leading-tight mt-0.5 font-medium">Chat</span>
              </Link>

              <Link
                href="/"
                className="flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all text-slate-500 hover:text-slate-800"
              >
                <div className="p-1 rounded-xl hover:bg-slate-100">
                  <Home className="h-5 w-5" />
                </div>
                <span className="text-[10px] leading-tight mt-0.5 font-medium">Website</span>
              </Link>
            </>
          ) : (
            /* Patient App Tabs */
            <>
              {/* 1. Patient Dashboard */}
              <Link
                href="/patient"
                className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all ${
                  isActive("/patient")
                    ? "text-emerald-700 font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <div className={`p-1 rounded-xl ${isActive("/patient") ? "bg-emerald-100 text-emerald-800" : ""}`}>
                  <User className="h-5 w-5" />
                </div>
                <span className="text-[10px] leading-tight mt-0.5 font-medium">Dashboard</span>
              </Link>

              {/* 2. Video OPD */}
              <Link
                href="/patient/teleconsult"
                className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all relative ${
                  isActive("/patient/teleconsult") || isActive("/teleconsult")
                    ? "text-emerald-700 font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <div
                  className={`p-1 rounded-xl relative ${
                    isActive("/patient/teleconsult") || isActive("/teleconsult")
                      ? "bg-emerald-100 text-emerald-800"
                      : ""
                  }`}
                >
                  <Video className="h-5 w-5" />
                  <span className="absolute top-0 right-0 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                </div>
                <span className="text-[10px] leading-tight mt-0.5 font-medium">Video OPD</span>
              </Link>

              {/* 3. Chat */}
              <Link
                href="/patient/chat"
                className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all ${
                  isActive("/patient/chat") || isActive("/chat")
                    ? "text-emerald-700 font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <div
                  className={`p-1 rounded-xl ${
                    isActive("/patient/chat") || isActive("/chat") ? "bg-emerald-50 text-emerald-700" : ""
                  }`}
                >
                  <MessageSquare className="h-5 w-5" />
                </div>
                <span className="text-[10px] leading-tight mt-0.5 font-medium">Chat</span>
              </Link>

              {/* 4. Wallet */}
              <Link
                href="/patient/wallet"
                className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all ${
                  isActive("/patient/wallet") || isActive("/wallet")
                    ? "text-emerald-700 font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <div
                  className={`p-1 rounded-xl ${
                    isActive("/patient/wallet") || isActive("/wallet") ? "bg-emerald-50 text-emerald-700" : ""
                  }`}
                >
                  <WalletIcon className="h-5 w-5" />
                </div>
                <span className="text-[10px] leading-tight mt-0.5 font-medium truncate max-w-[55px]">
                  {formatCurrency(cachedBalance)}
                </span>
              </Link>

              {/* 5. In-Clinic Visit */}
              <button
                type="button"
                onClick={() => setIsBookModalOpen(true)}
                className="flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all text-slate-500 hover:text-slate-800"
              >
                <div className="p-1 rounded-xl hover:bg-slate-100">
                  <Calendar className="h-5 w-5" />
                </div>
                <span className="text-[10px] leading-tight mt-0.5 font-medium">Book Visit</span>
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Appointment Modal from Mobile Bottom Nav */}
      <AppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        initialDoctorName="Dr. Raees Akhtar"
      />
    </>
  );
}
