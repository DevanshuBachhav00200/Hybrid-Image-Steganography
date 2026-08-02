"use client";

import React, { forwardRef } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, disabled, id, checked, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className="flex items-start gap-2.5 select-none">
        <div className="relative flex items-center pt-0.5">
          <input
            type="checkbox"
            id={inputId}
            ref={ref}
            disabled={disabled}
            checked={checked}
            className={cn(
              "peer appearance-none w-5 h-5 rounded border border-border bg-background-secondary transition-all cursor-pointer",
              "checked:bg-primary checked:border-primary hover:border-border-hover focus-ring",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              className
            )}
            {...props}
          />
          <Check className="absolute left-0.5 top-1 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-150 stroke-[2.5]" />
        </div>
        {(label || description) && (
          <label htmlFor={inputId} className="cursor-pointer flex flex-col">
            {label && <span className="text-sm font-medium text-text-primary">{label}</span>}
            {description && <span className="text-xs text-text-muted">{description}</span>}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";
