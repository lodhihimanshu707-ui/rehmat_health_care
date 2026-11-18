"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";

export interface CustomTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  isMono?: boolean;
}

export const CustomTextarea = React.forwardRef<
  HTMLTextAreaElement,
  CustomTextareaProps
>(({ className, label, helperText, error, isMono = false, ...props }, ref) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-700 select-none">
            {label}
          </label>
          {helperText && (
            <span className="text-[11px] font-medium text-slate-400">
              {helperText}
            </span>
          )}
        </div>
      )}

      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-2xl border bg-white p-3.5 text-xs text-slate-800 transition-all duration-200 focus:outline-none leading-relaxed",
          isMono && "font-mono",
          error
            ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
            : "border-slate-300/80 hover:border-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-2xs",
          className
        )}
        {...props}
      />

      {error && (
        <p className="text-[11px] font-medium text-rose-600">{error}</p>
      )}
    </div>
  );
});

CustomTextarea.displayName = "CustomTextarea";
