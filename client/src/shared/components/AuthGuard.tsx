"use client";

import React from "react";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/shared/ui/button";
import {
  ShieldAlert,
  Lock,
  LogIn,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "patient" | "doctor";
  title?: string;
  description?: string;
}

export function AuthGuard({
  children,
  requiredRole,
  title = "Authentication Required",
  description = "To protect patient medical confidentiality and comply with National Telemedicine Guidelines, you must sign in to access consultations, digital prescriptions, and the health wallet.",
}: AuthGuardProps) {
  const { isAuthenticated, isInitialized, currentUser, openAuthModal } =
    useAuthStore();

  // If checking token from localStorage, show brief clean skeleton
  if (!isInitialized) {
    return (
      <div className="flex min-h-[500px] items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-emerald-600 border-t-transparent" />
          <span className="text-xs font-semibold text-slate-500">
            Verifying medical session security...
          </span>
        </div>
      </div>
    );
  }

  // If unauthenticated: Block access and show modern gate
  if (!isAuthenticated) {
    return (
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 py-12 lg:py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xl text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-inner">
            <Lock className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Confidential Healthcare Access</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              {description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <Button
              onClick={() => openAuthModal("login")}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 rounded-xl shadow-md gap-2"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In to Your Account</span>
              <ArrowRight className="h-4 w-4 opacity-75" />
            </Button>

            <Link href="/register" className="block w-full">
              <Button
                variant="outline"
                className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 h-11 rounded-xl text-xs font-bold"
              >
                Create New Patient Account (Get ₹100 Free Credits)
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If role mismatch (e.g. Doctor trying to access Patient Wallet)
  if (requiredRole && currentUser.role !== requiredRole) {
    return (
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 py-12">
        <div className="mx-auto max-w-lg rounded-3xl border border-amber-200 bg-amber-50/70 p-8 text-center space-y-4">
          <ShieldAlert className="h-10 w-10 text-amber-600 mx-auto" />
          <h3 className="text-lg font-bold text-amber-900">Role Restriction</h3>
          <p className="text-xs text-amber-800 leading-relaxed">
            This module is reserved for <strong>{requiredRole}s</strong>. You are currently logged in
            as <strong>{currentUser.name}</strong> ({currentUser.role} mode).
          </p>
          <p className="text-xs text-amber-700">
            Please switch to {requiredRole} mode using the top-right header switcher to test this screen.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

