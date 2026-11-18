"use client";

import React from "react";
import { Check, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/shared/utils/cn";

interface CheckboxCardProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  icon?: LucideIcon;
  badge?: string;
  className?: string;
}

export function CheckboxCard({
  label,
  checked,
  onChange,
  description,
  icon: Icon,
  badge,
  className,
}: CheckboxCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onChange(!checked)}
      className={cn(
        "cursor-pointer rounded-2xl border p-3 transition-all duration-200 flex items-center justify-between gap-2.5 shadow-2xs select-none",
        checked
          ? "border-emerald-500 bg-emerald-50/70 ring-1 ring-emerald-500 shadow-xs"
          : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/60",
        className
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={cn(
            "h-5 w-5 rounded-lg border flex items-center justify-center transition-colors shrink-0",
            checked
              ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
              : "border-slate-300 bg-white"
          )}
        >
          {checked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
        </div>

        {Icon && (
          <Icon
            className={cn(
              "h-4 w-4 shrink-0",
              checked ? "text-emerald-700" : "text-slate-400"
            )}
          />
        )}

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={cn(
                "text-xs font-bold truncate",
                checked ? "text-emerald-950" : "text-slate-700"
              )}
            >
              {label}
            </span>
            {badge && (
              <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-full border border-emerald-200 shrink-0">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="text-[10px] text-slate-500 truncate mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
