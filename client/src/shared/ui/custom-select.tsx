"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/utils/cn";

export interface CustomSelectOption<T = string> {
  value: T;
  label: string;
  sublabel?: string;
  badge?: string;
  badgeColor?: "emerald" | "blue" | "amber" | "slate";
  avatar?: string;
  icon?: LucideIcon;
}

interface CustomSelectProps<T = string> {
  label?: string;
  options: CustomSelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string;
}

export function CustomSelect<T extends string = string>({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  className,
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const badgeColors = {
    emerald: "bg-emerald-50 text-emerald-800 border-emerald-200",
    blue: "bg-blue-50 text-blue-800 border-blue-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <div className={cn("relative space-y-1.5", className)} ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold text-slate-700 select-none">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full rounded-2xl border bg-white p-3 text-left transition-all duration-200 flex items-center justify-between gap-3 shadow-2xs cursor-pointer",
          isOpen
            ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
            : "border-slate-300/80 hover:border-slate-400 hover:bg-slate-50/50"
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {selectedOption?.icon && (
            <selectedOption.icon className="h-4 w-4 text-emerald-600 shrink-0" />
          )}

          {selectedOption ? (
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-bold text-slate-900 truncate">
                {selectedOption.label}
              </span>
              {selectedOption.sublabel && (
                <span className="text-[11px] font-medium text-slate-500 truncate">
                  ({selectedOption.sublabel})
                </span>
              )}
              {selectedOption.badge && (
                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0",
                    badgeColors[selectedOption.badgeColor || "emerald"]
                  )}
                >
                  {selectedOption.badge}
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs text-slate-400 font-medium">{placeholder}</span>
          )}
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-slate-400"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>

      {/* Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-xl backdrop-blur-md space-y-0.5"
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              const Icon = opt.icon;

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full rounded-xl px-3 py-2.5 text-left text-xs transition-colors flex items-center justify-between gap-2.5 cursor-pointer",
                    isSelected
                      ? "bg-emerald-50 text-emerald-950 font-bold"
                      : "text-slate-700 hover:bg-slate-100/80 font-medium"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {Icon && (
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          isSelected ? "text-emerald-600" : "text-slate-400"
                        )}
                      />
                    )}
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="truncate">{opt.label}</span>
                      {opt.sublabel && (
                        <span className="text-[11px] text-slate-400 font-normal truncate">
                          {opt.sublabel}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {opt.badge && (
                      <span
                        className={cn(
                          "text-[9px] font-bold px-2 py-0.5 rounded-full border",
                          badgeColors[opt.badgeColor || "emerald"]
                        )}
                      >
                        {opt.badge}
                      </span>
                    )}
                    {isSelected && (
                      <Check className="h-4 w-4 text-emerald-600 stroke-[2.5]" />
                    )}
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
