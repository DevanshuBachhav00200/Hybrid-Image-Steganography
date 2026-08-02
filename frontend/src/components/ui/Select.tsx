"use client";

import React, { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, error, placeholder, disabled, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          disabled={disabled}
          className={cn(
            "w-full bg-background-secondary border border-border rounded-lg px-3.5 py-2.5 pr-10 text-sm text-text-primary appearance-none transition-all duration-200 focus-ring cursor-pointer",
            "hover:border-border-hover focus:border-primary focus:bg-card/80",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-danger focus:border-danger",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="text-text-muted bg-background-secondary">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
              className="bg-background-secondary text-text-primary py-1"
            >
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
      </div>
    );
  }
);
Select.displayName = "Select";
