"use client";

import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: React.ReactNode;
  description?: string;
  className?: string;
  id?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked = false, onChange, disabled = false, label, description, className, id }, ref) => {
    const inputId = id || React.useId();

    const handleToggle = () => {
      if (!disabled && onChange) {
        onChange(!checked);
      }
    };

    return (
      <div className="flex items-center justify-between gap-3 select-none">
        {(label || description) && (
          <label htmlFor={inputId} onClick={handleToggle} className="cursor-pointer flex flex-col">
            {label && <span className="text-sm font-medium text-text-primary">{label}</span>}
            {description && <span className="text-xs text-text-muted">{description}</span>}
          </label>
        )}
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          id={inputId}
          ref={ref}
          disabled={disabled}
          onClick={handleToggle}
          className={cn(
            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring",
            checked ? "bg-primary" : "bg-card",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          <motion.span
            animate={{ x: checked ? 20 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0"
          />
        </button>
      </div>
    );
  }
);
Switch.displayName = "Switch";
