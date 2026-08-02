"use client";

import React from "react";
import { AlertCircle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/Tooltip";

export interface FormFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  tooltip?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helperText,
  tooltip,
  required = false,
  children,
  className,
  id,
}) => {
  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="text-sm font-medium text-text-primary flex items-center gap-1.5">
            {label}
            {required && <span className="text-danger">*</span>}
            {tooltip && (
              <Tooltip content={tooltip} position="top">
                <HelpCircle className="w-3.5 h-3.5 text-text-muted hover:text-text-secondary cursor-help transition-colors" />
              </Tooltip>
            )}
          </label>
        </div>
      )}
      {children}
      {error ? (
        <p className="text-xs text-danger flex items-center gap-1 font-medium animate-fadeIn">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-xs text-text-muted">{helperText}</p>
      ) : null}
    </div>
  );
};
