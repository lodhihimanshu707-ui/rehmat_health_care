"use client";

import React, { useState } from "react";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/Footer";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import {
  Lock,
  Phone,
  User,
  Mail,
  HeartPulse,
  Sparkles,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { siteConfig } from "@/config/site";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error } = useAuthStore();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"patient" | "doctor">("patient");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({
        name,
        phone,
        email: email || undefined,
        password,
        role,
      });
      router.push("/");
    } catch {
      // Error handled by store
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25">
              <HeartPulse className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Create Patient Account
            </h1>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Includes ₹100 Welcome Health Credits</span>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Legal Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  required
                  placeholder="e.g. Mohd. Imran"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9 text-xs h-10 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Number (for WhatsApp Prescriptions)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  required
                  type="tel"
                  placeholder="+91 94120 54321"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-9 text-xs h-10 rounded-xl"
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
                  placeholder="yourname@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 text-xs h-10 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  required
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 text-xs h-10 rounded-xl"
                />
              </div>
            </div>

            {/* Role Toggle */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("patient")}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    role === "patient"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Patient
                </button>
                <button
                  type="button"
                  onClick={() => setRole("doctor")}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    role === "doctor"
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
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-11 rounded-xl shadow-md mt-2 gap-2"
            >
              {isLoading ? "Creating Account..." : "Create Account & Claim ₹100"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Login Link */}
          <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-emerald-700 font-bold hover:underline"
            >
              Sign In Here
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
