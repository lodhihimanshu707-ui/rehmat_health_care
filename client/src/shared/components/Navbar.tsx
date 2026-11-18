"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  UserCheck,
  Stethoscope,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/shared/ui/button";

interface NavbarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const {
    currentUser,
    isAuthenticated,
    openAuthModal,
    logout,
  } = useAuthStore();
  const { cachedBalance, openRechargeModal } = useWalletStore();
  const isPatient = currentUser?.role === "patient";

  const isCurrent = (path: string) => {
    if (activeTab) return activeTab === path;
    if (path === "/" || path === "website") return pathname === "/";
    return pathname.startsWith(path);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Clinic Info Strip (hidden on mobile, visible on tablet+) */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden md:block">
        <div className="w-full px-2 sm:px-6 md:px-10 lg:px-14 xl:px-16 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-5 flex-wrap">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium truncate">
              <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Near Mohan Xray, Malviya Nagar, Moradabad (244001)</span>
            </span>
            <span className="text-slate-700 hidden lg:inline">•</span>
            <span className="hidden lg:flex items-center gap-1.5 text-slate-300 font-medium">
              <Clock className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Clinic OPD: Mon – Sat 10 AM – 7 PM | Tele-OPD: 24/7</span>
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
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
      <div className="w-full px-3 sm:px-6 md:px-10 lg:px-14 xl:px-16">
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo & Name */}
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-2 sm:gap-3 shrink-0 group min-w-0"
          >
            <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-200 shrink-0">
              <HeartPulse className="h-4 w-4 sm:h-6 sm:w-6" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-base md:text-lg font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors whitespace-nowrap">
                  {siteConfig.name}
                </span>
                <span className="hidden sm:inline-flex rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-extrabold text-emerald-800 tracking-wide uppercase">
                  Moradabad
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate hidden xs:block">
                Malviya Nagar • Beside Mohan X-Ray
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links (xl screens) with Motion.dev Sliding Active Pill */}
          <nav
            onMouseLeave={() => setHoveredNav(null)}
            className="hidden xl:flex items-center gap-1 rounded-2xl bg-slate-100/80 p-1 border border-slate-200/60"
          >
            {[
              { href: "/", label: "Home" },
              ...(isAuthenticated && currentUser?.role === "patient"
                ? [{ href: "/patient", label: "Patient Portal" }]
                : []),
              ...(isAuthenticated && currentUser?.role === "doctor"
                ? [{ href: "/doctor", label: "Doctor Cockpit", special: "doctor" }]
                : []),
              ...(isAuthenticated && currentUser?.role === "admin"
                ? [{ href: "/staff", label: "Staff Desk", special: "admin" }]
                : []),
              { href: "/#about", label: "About" },
              { href: "/#services", label: "Specialities" },
              { href: "/#doctors", label: "Doctor" },
              { href: "/teleconsult", label: "Live Tele-OPD", icon: Video, highlight: true },
              { href: "/chat", label: "Chat", icon: MessageSquare },
              ...(isAuthenticated && isPatient
                ? [{ href: "/wallet", label: "Wallet", icon: WalletIcon }]
                : []),
              { href: "/#timings", label: "Timings" },
            ].map((item) => {
              const active = isCurrent(item.href);
              const isHovered = hoveredNav === item.href;
              const Icon = item.icon;

              return (
                <div
                  key={item.href}
                  onMouseEnter={() => setHoveredNav(item.href)}
                  className="relative"
                >
                  <Link
                    href={item.href}
                    className={`relative z-10 flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
                      active
                        ? item.highlight || item.special
                          ? "text-white"
                          : "text-emerald-800 font-extrabold"
                        : item.highlight
                        ? "text-emerald-700"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
                    <span>{item.label}</span>
                  </Link>

                  {/* Active sliding pill */}
                  {active && (
                    <motion.span
                      layoutId="navbar-active-pill"
                      className={`absolute inset-0 z-0 rounded-xl shadow-xs ${
                        item.special === "doctor"
                          ? "bg-emerald-600"
                          : item.special === "admin"
                          ? "bg-blue-600"
                          : item.highlight
                          ? "bg-emerald-600"
                          : "bg-white border border-emerald-100/80 shadow-sm"
                      }`}
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}

                  {/* Hover floating pill */}
                  {isHovered && !active && (
                    <motion.span
                      layoutId="navbar-hover-pill"
                      className="absolute inset-0 z-0 rounded-xl bg-slate-200/60"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Quick Live Teleconsult button (desktop & tablet) */}
            <Link href="/teleconsult" className="hidden md:inline-flex">
              <Button
                size="sm"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 gap-1.5 h-9 px-3 transition-all hover:scale-[1.02]"
              >
                <Video className="h-3.5 w-3.5" />
                <span>Consult (₹15/m)</span>
              </Button>
            </Link>

            {/* If Authenticated */}
            {isAuthenticated && currentUser ? (
              <>
                {/* Mobile Mini Wallet Pill (< sm) */}
                {isPatient && (
                  <Link
                    href="/wallet"
                    className="flex sm:hidden items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-900 shadow-2xs hover:bg-emerald-100 transition-colors"
                  >
                    <WalletIcon className="h-3 w-3 text-emerald-700 shrink-0" />
                    <span>₹{Math.floor(cachedBalance)}</span>
                  </Link>
                )}

                {/* Desktop Full Wallet Badge (sm+) */}
                {isPatient && (
                  <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-1.5 shadow-2xs">
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

                {/* Mobile Avatar Circle (< sm) */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="flex sm:hidden h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white text-xs font-black shadow-xs"
                  title={currentUser.name}
                >
                  {currentUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </button>

                {/* Desktop Full Logged-In User Profile (sm+) */}
                <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
                  <div className="flex items-center gap-1.5 px-2 py-0.5">
                    {isPatient ? (
                      <UserCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Stethoscope className="h-4 w-4 text-blue-600 shrink-0" />
                    )}
                    <div className="flex flex-col text-left leading-none max-w-[100px]">
                      <span className="text-xs font-extrabold text-slate-900 truncate">
                        {currentUser.name}
                      </span>
                      <span className="text-[9px] text-slate-500 font-semibold capitalize">
                        {currentUser.role}
                      </span>
                    </div>
                  </div>

                  {/* Sign Out */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={logout}
                    className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                    title="Sign Out"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </>
            ) : (
              /* If NOT Authenticated */
              <Button
                size="sm"
                onClick={() => openAuthModal("login")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3.5"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </Button>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden inline-flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white/98 backdrop-blur-xl px-4 py-4 space-y-3.5 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          {/* User Profile Card inside Drawer if Logged In */}
          {isAuthenticated && currentUser && (
            <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50/50 p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-10 w-10 rounded-full bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs shrink-0">
                  {currentUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-slate-900 truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-emerald-800 font-semibold capitalize flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                    <span>{currentUser.role} Account</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {isPatient && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      closeMobileMenu();
                      openRechargeModal();
                    }}
                    className="h-7 text-[11px] font-bold border-emerald-300 text-emerald-800 bg-white hover:bg-emerald-50 px-2 rounded-lg"
                  >
                    + Add ₹
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    closeMobileMenu();
                    logout();
                  }}
                  className="h-7 w-7 p-0 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                  title="Sign Out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* Quick Portal Switch Link if Doctor/Staff/Patient */}
          {isAuthenticated && currentUser?.role === "doctor" && (
            <Link
              href="/doctor"
              onClick={closeMobileMenu}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs"
            >
              <Stethoscope className="h-4 w-4" />
              <span>Open Doctor OPD Cockpit</span>
            </Link>
          )}

          {isAuthenticated && currentUser?.role === "admin" && (
            <Link
              href="/staff"
              onClick={closeMobileMenu}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs"
            >
              <UserCheck className="h-4 w-4" />
              <span>Open Staff Desk</span>
            </Link>
          )}

          {isAuthenticated && currentUser?.role === "patient" && (
            <Link
              href="/patient"
              onClick={closeMobileMenu}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-xs"
            >
              <UserCheck className="h-4 w-4" />
              <span>Go to Patient Dashboard</span>
            </Link>
          )}

          {/* Core Navigation Grid */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className={`p-2.5 rounded-xl text-xs font-bold text-center transition-all ${
                isCurrent("/") ? "bg-emerald-600 text-white" : "bg-slate-100/90 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Home
            </Link>
            <Link
              href="/teleconsult"
              onClick={closeMobileMenu}
              className={`p-2.5 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all ${
                isCurrent("/teleconsult")
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
            >
              <Video className="h-3.5 w-3.5" />
              <span>Live Tele-OPD</span>
            </Link>
            <Link
              href="/chat"
              onClick={closeMobileMenu}
              className={`p-2.5 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all ${
                isCurrent("/chat") ? "bg-emerald-600 text-white" : "bg-slate-100/90 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Chat</span>
            </Link>
            {isAuthenticated && isPatient ? (
              <Link
                href="/wallet"
                onClick={closeMobileMenu}
                className={`p-2.5 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all ${
                  isCurrent("/wallet") ? "bg-emerald-600 text-white" : "bg-slate-100/90 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <WalletIcon className="h-3.5 w-3.5" />
                <span>Wallet ({formatCurrency(cachedBalance)})</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  openAuthModal("login");
                }}
                className="p-2.5 rounded-xl text-xs font-bold text-center bg-slate-100/90 text-slate-700 hover:bg-slate-200 flex items-center justify-center gap-1.5"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-1 text-xs font-semibold text-slate-600">
            <Link
              href="/#about"
              onClick={closeMobileMenu}
              className="block px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700"
            >
              About Clinic & Heritage
            </Link>
            <Link
              href="/#services"
              onClick={closeMobileMenu}
              className="block px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700"
            >
              Clinical Specialities
            </Link>
            <Link
              href="/#doctors"
              onClick={closeMobileMenu}
              className="block px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700"
            >
              Meet Dr. Raees Akhtar (MD)
            </Link>
            <Link
              href="/#timings"
              onClick={closeMobileMenu}
              className="block px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700"
            >
              Clinic Timings & Directions
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
            <a
              href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold hover:bg-emerald-100 transition-colors"
            >
              <Phone className="h-4 w-4 text-emerald-600" />
              <span>Call Clinic: {siteConfig.phone}</span>
            </a>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 justify-center">
              <MapPin className="h-3 w-3 text-rose-500" />
              <span>Beside Mohan X-Ray, Malviya Nagar, Moradabad</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
