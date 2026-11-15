import React from "react";
import { useAuthStore } from "../store/use-auth-store";
import { syncSocketUser } from "@/lib/socket";
import { UserCheck, Stethoscope, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function RoleSwitcher() {
  const { currentUser, toggleRole } = useAuthStore();

  const handleToggle = () => {
    toggleRole();
    const newUser = useAuthStore.getState().currentUser;
    syncSocketUser(newUser.id);
  };

  const isPatient = currentUser.role === "patient";

  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 p-1.5 shadow-sm backdrop-blur-md">
      <div className="flex items-center gap-2 px-2.5 py-1">
        {isPatient ? (
          <UserCheck className="h-4 w-4 text-emerald-600" />
        ) : (
          <Stethoscope className="h-4 w-4 text-blue-600" />
        )}
        <div className="flex flex-col text-left">
          <span className="text-xs font-semibold leading-tight text-slate-900">{currentUser.name}</span>
          <span className="text-[10px] text-slate-500 capitalize">{currentUser.role} Mode</span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        className="h-8 gap-1.5 rounded-full bg-slate-100 px-3 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
        title="Switch between Patient and Doctor view for demo testing"
      >
        <ArrowLeftRight className="h-3.5 w-3.5" />
        <span>Switch to {isPatient ? "Dr. Rehmat" : "Patient"}</span>
      </Button>
    </div>
  );
}

