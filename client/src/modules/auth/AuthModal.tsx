"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { siteConfig } from "@/config/site";
import {
  Lock,
  Phone,
  User,
  Mail,
  HeartPulse,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Stethoscope,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    openAuthModal,
    login,
    register,
    isLoading,
    error,
  } = useAuthStore();

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState<"patient" | "doctor">("patient");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginIdentifier, loginPassword);
    } catch {
      // Error handled by store
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({
        name: regName,
        phone: regPhone,
        email: regEmail || undefined,
        password: regPassword,
        role: regRole,
      });
    } catch {
      // Error handled by store
    }
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={closeAuthModal}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-slate-200">
        {/* Header */}
        <DialogHeader className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 p-6 text-white text-left">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-sm">
              <HeartPulse className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
              {siteConfig.name}
            </span>
          </div>
          <DialogTitle className="text-xl font-extrabold text-white">
            {authModalTab === "login" ? "Welcome Back" : "Join Rehmat Health Care"}
          </DialogTitle>
          <DialogDescription className="text-emerald-100 text-xs mt-1">
            {authModalTab === "login"
              ? "Access your digital health wallet, consultation history, and live OPD."
              : "Register to consult verified specialists in Moradabad with live per-minute wallet billing."}
          </DialogDescription>
        </DialogHeader>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3">
          <button
            onClick={() => openAuthModal("login")}
            className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 ${
              authModalTab === "login"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => openAuthModal("register")}
            className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 ${
              authModalTab === "register"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab 1: Login */}
        {authModalTab === "login" && (
          <div className="p-6 space-y-4">
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number or Email
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    required
                    type="text"
                    placeholder="e.g. +91 94120 54321 or email"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="pl-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    required
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="pl-9 text-xs"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 rounded-xl shadow-sm"
              >
                {isLoading ? "Signing in..." : "Sign In to Account"}
              </Button>
            </form>
          </div>
        )}

        {/* Tab 2: Register */}
        {authModalTab === "register" && (
          <div className="p-6 space-y-4">
            {/* Promo banner */}
            <div className="flex items-center gap-2.5 rounded-xl border border-emerald-300 bg-emerald-50/90 p-3 text-xs text-emerald-900">
              <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Welcome Offer:</strong> New registrations receive <strong>₹100</strong> initial consultation credit in their health wallet!
              </span>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    required
                    placeholder="e.g. Danish Rizvi"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="pl-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number (for OTP & Prescriptions)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    required
                    placeholder="+91 98370 XXXXX"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="pl-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="pl-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Create Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    required
                    type="password"
                    placeholder="At least 6 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="pl-9 text-xs"
                  />
                </div>
              </div>

              {/* Role Toggle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Account Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole("patient")}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      regRole === "patient"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole("doctor")}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      regRole === "doctor"
                        ? "border-blue-500 bg-blue-50 text-blue-800 shadow-xs"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Doctor / Consultant
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 rounded-xl shadow-sm mt-2"
              >
                {isLoading ? "Creating Account..." : "Create Account & Claim ₹100"}
              </Button>
            </form>
          </div>
        )}

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            256-Bit SSL Encrypted
          </span>
          <span>Malviya Nagar, Moradabad</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

