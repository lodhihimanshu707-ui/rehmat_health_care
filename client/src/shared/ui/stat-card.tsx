"use client";

import React from "react";
import { SpotlightCard } from "./spotlight-card";
import { AnimatedCounter } from "./animated-counter";
import { LucideIcon } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  subtext?: string;
  icon?: LucideIcon;
  iconColor?: string;
  badgeText?: string;
  badgeVariant?: "emerald" | "blue" | "amber" | "slate";
  className?: string;
}

export function StatCard({
  label,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  subtext,
  icon: Icon,
  iconColor = "text-emerald-600",
  badgeText,
  badgeVariant = "emerald",
  className,
}: StatCardProps) {
  const badgeColors = {
    emerald: "bg-emerald-50 text-emerald-800 border-emerald-200",
    blue: "bg-blue-50 text-blue-800 border-blue-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <SpotlightCard className={cn("p-4 sm:p-5 rounded-2xl border-slate-200/90", className)}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs text-slate-500 font-semibold block">{label}</span>
        {badgeText && (
          <span
            className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0",
              badgeColors[badgeVariant]
            )}
          >
            {badgeText}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-1 mt-1.5">
        <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          <AnimatedCounter
            value={value}
            prefix={prefix}
            suffix={suffix}
            decimals={decimals}
          />
        </p>
      </div>

      {subtext && (
        <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
          {Icon && <Icon className={cn("h-3.5 w-3.5 shrink-0", iconColor)} />}
          <span className="truncate">{subtext}</span>
        </div>
      )}
    </SpotlightCard>
  );
}
