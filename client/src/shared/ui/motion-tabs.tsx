"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/utils/cn";

export interface TabOption<T extends string = string> {
  id: T;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface MotionTabsProps<T extends string = string> {
  tabs: TabOption<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  layoutId?: string;
  className?: string;
  tabClassName?: string;
  activeClassName?: string;
  fullWidth?: boolean;
}

export function MotionTabs<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  layoutId = "motion-tab-active",
  className,
  tabClassName,
  activeClassName = "bg-white text-emerald-800 shadow-sm",
  fullWidth = true,
}: MotionTabsProps<T>) {
  return (
    <div
      className={cn(
        "p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 flex items-center gap-1",
        fullWidth && "w-full grid",
        fullWidth && `grid-cols-${tabs.length}`,
        className
      )}
      style={fullWidth ? { gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` } : undefined}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer select-none",
              isActive ? "text-emerald-950 font-black" : "text-slate-600 hover:text-slate-900",
              tabClassName
            )}
          >
            {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
            <span className="relative z-10 truncate">{tab.label}</span>
            {tab.badge && (
              <span className="relative z-10 text-[9px] font-black px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 ml-1">
                {tab.badge}
              </span>
            )}

            {isActive && (
              <motion.span
                layoutId={layoutId}
                className={cn("absolute inset-0 z-0 rounded-xl", activeClassName)}
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
