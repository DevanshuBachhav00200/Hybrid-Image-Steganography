"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AlertProps {
  title?: string;
  children: React.ReactNode;
  variant?: "success" | "danger" | "warning" | "info";
  dismissible?: boolean;
  className?: string;
}

const variantStyles = {
  success: "border-success/30 bg-success/10 text-success",
  danger: "border-danger/30 bg-danger/10 text-danger",
  warning: "border-warning/30 bg-warning/10 text-warning",
  info: "border-primary/30 bg-primary/10 text-primary",
};

const icons = {
  success: CheckCircle2,
  danger: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

export const Alert: React.FC<AlertProps> = ({
  title,
  children,
  variant = "info",
  dismissible = false,
  className,
}) => {
  const [dismissed, setDismissed] = useState(false);
  const Icon = icons[variant];

  if (dismissed) return null;

  return (
    <div
      className={cn(
        "border rounded-lg p-3.5 flex items-start justify-between gap-3 text-xs leading-relaxed",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start gap-2.5">
        <Icon className="w-4 h-4 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          {title && <h5 className="font-semibold text-text-primary text-sm">{title}</h5>}
          <div className="text-text-secondary">{children}</div>
        </div>
      </div>

      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          className="text-text-muted hover:text-text-primary transition-colors p-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
