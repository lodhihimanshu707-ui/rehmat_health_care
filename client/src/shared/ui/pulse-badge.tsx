"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";

interface PulseBadgeProps {
  isLive?: boolean;
  label: string;
  variant?: "emerald" | "amber" | "rose" | "blue";
  size?: "sm" | "md";
  className?: string;
}

export function PulseBadge({
  isLive = true,
  label,
  variant = "emerald",
  size = "md",
  className,
}: PulseBadgeProps) {
  const colorMap = {
    emerald: {
      badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
      dot: "bg-emerald-500",
      ping: "bg-emerald-400",
    },
    amber: {
      badge: "bg-amber-50 text-amber-800 border-amber-200",
      dot: "bg-amber-500",
      ping: "bg-amber-400",
    },
    rose: {
      badge: "bg-rose-50 text-rose-800 border-rose-200",
      dot: "bg-rose-500",
      ping: "bg-rose-400",
    },
    blue: {
      badge: "bg-blue-50 text-blue-800 border-blue-200",
      dot: "bg-blue-500",
      ping: "bg-blue-400",
    },
  };

  const current = colorMap[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border font-black shadow-2xs",
        size === "sm" ? "px-2.5 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
        current.badge,
        className
      )}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        {isLive && (
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              current.ping
            )}
          />
        )}
        <span
          className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            isLive ? current.dot : "bg-slate-400"
          )}
        />
      </span>
      <span className="truncate">{label}</span>
    </span>
  );
}
