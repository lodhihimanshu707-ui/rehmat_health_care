import React from "react";
import { RoleSwitcher } from "@/features/auth/components/role-switcher";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import { useWalletStore } from "@/features/wallet/store/use-wallet-store";
import { formatCurrency } from "@/lib/utils";
import { HeartPulse, Wallet as WalletIcon, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const { currentUser } = useAuthStore();
  const { cachedBalance, openRechargeModal } = useWalletStore();
  const isPatient = currentUser.role === "patient";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange("doctors")}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-500/20">
            <HeartPulse className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-slate-900">Rehmat Health Care</span>
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                Moradabad
              </span>
            </div>
            <p className="text-xs text-slate-500">Teleconsultation & Primary Health Care</p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop & Mobile) */}
        <nav className="hidden md:flex items-center gap-1 rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => onTabChange("doctors")}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "doctors"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Doctors
          </button>
          <button
            onClick={() => onTabChange("chat")}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "chat"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => onTabChange("wallet")}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "wallet"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Wallet & Ledger
          </button>
        </nav>

        {/* Right Section: Balance & Role Switcher */}
        <div className="flex items-center gap-3">
          {isPatient && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 px-3 py-1.5">
              <WalletIcon className="h-4 w-4 text-emerald-700" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800">Wallet</span>
                <span className="text-xs font-bold text-emerald-950">{formatCurrency(cachedBalance)}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={openRechargeModal}
                className="h-7 w-7 p-0 text-emerald-700 hover:bg-emerald-200/60 rounded-full"
                title="Recharge Balance"
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          )}

          <RoleSwitcher />
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="flex md:hidden border-t border-slate-100 bg-slate-50 px-4 py-2 justify-around">
        <button
          onClick={() => onTabChange("doctors")}
          className={`text-xs font-semibold py-1 px-3 rounded-lg ${
            activeTab === "doctors" ? "bg-emerald-600 text-white" : "text-slate-600"
          }`}
        >
          Doctors
        </button>
        <button
          onClick={() => onTabChange("chat")}
          className={`text-xs font-semibold py-1 px-3 rounded-lg ${
            activeTab === "chat" ? "bg-emerald-600 text-white" : "text-slate-600"
          }`}
        >
          Messages
        </button>
        <button
          onClick={() => onTabChange("wallet")}
          className={`text-xs font-semibold py-1 px-3 rounded-lg ${
            activeTab === "wallet" ? "bg-emerald-600 text-white" : "text-slate-600"
          }`}
        >
          Wallet
        </button>
      </div>
    </header>
  );
}

