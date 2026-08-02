"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  description?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, description, disabled, id, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className="flex items-start gap-2.5 select-none">
        <div className="relative flex items-center pt-0.5">
          <input
            type="radio"
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={cn(
              "peer appearance-none w-5 h-5 rounded-full border border-border bg-background-secondary transition-all cursor-pointer",
              "checked:border-primary hover:border-border-hover focus-ring",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              className
            )}
            {...props}
          />
          <div className="absolute left-1.5 top-2 w-2 h-2 rounded-full bg-primary opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-150" />
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
Radio.displayName = "Radio";

export interface RadioGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const RadioGroup = ({ children, className }: RadioGroupProps) => {
  return <div className={cn("space-y-2", className)}>{children}</div>;
};
