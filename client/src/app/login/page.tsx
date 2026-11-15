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
  HeartPulse,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { siteConfig } from "@/config/site";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(identifier, password);
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
          {/* Brand header */}
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25">
              <HeartPulse className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Sign In to Your Account
            </h1>
            <p className="text-xs text-slate-500">
              {siteConfig.name} • Malviya Nagar, Moradabad
            </p>
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
                Phone Number or Email
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  required
                  type="text"
                  placeholder="e.g. +91 94120 54321 or email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 text-xs h-10 rounded-xl"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-11 rounded-xl shadow-md gap-2"
            >
              {isLoading ? "Signing in..." : "Sign In to Account"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Register Prompt */}
          <div className="pt-4 text-center text-xs text-slate-500 border-t border-slate-100">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-emerald-700 font-bold hover:underline"
            >
              Register Here & Claim ₹100
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

