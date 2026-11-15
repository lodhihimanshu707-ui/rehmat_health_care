"use client";

import React from "react";
import { useAuthStore } from "@/stores/auth.store";
import { syncSocketUser } from "@/lib/socket";
import { UserCheck, Stethoscope, ArrowLeftRight } from "lucide-react";
import { Button } from "@/shared/ui/button";

export function RoleSwitcher() {
  const { currentUser, toggleRole } = useAuthStore();

  const handleToggle = () => {
    toggleRole();
    const newUser = useAuthStore.getState().currentUser;
    syncSocketUser(newUser.id);
  };

  const isPatient = currentUser.role === "patient";

  return (
    <div className="flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white/95 p-1 shadow-xs backdrop-blur-sm shrink-0">
      <div className="flex items-center gap-1.5 px-2 py-0.5">
        {isPatient ? (
          <UserCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
        ) : (
          <Stethoscope className="h-3.5 w-3.5 text-blue-600 shrink-0" />
        )}
        <div className="flex flex-col text-left leading-none">
          <span className="text-xs font-bold text-slate-900 truncate max-w-[85px]">
            {isPatient ? "Mohd. Imran" : "Dr. Rehmat"}
          </span>
          <span className="text-[9px] text-slate-500 capitalize">{currentUser.role}</span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        className="h-7 gap-1 rounded-lg bg-slate-100 px-2 text-[11px] font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
        title="Switch between Patient and Doctor view for demo testing"
      >
        <ArrowLeftRight className="h-3 w-3" />
        <span>Switch</span>
      </Button>
    </div>
  );
}
