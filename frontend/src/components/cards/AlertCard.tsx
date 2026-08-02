"use client";

import React from "react";
import { AlertTriangle, ShieldAlert, CheckCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AlertCardProps {
  title: string;
  message: React.ReactNode;
  type?: "warning" | "danger" | "success" | "info";
  action?: React.ReactNode;
  className?: string;
}

const typeStyles = {
  warning: "border-warning/40 bg-warning/10 text-warning",
  danger: "border-danger/40 bg-danger/10 text-danger",
  success: "border-success/40 bg-success/10 text-success",
  info: "border-primary/40 bg-primary/10 text-primary",
};

const icons = {
  warning: AlertTriangle,
  danger: ShieldAlert,
  success: CheckCircle,
  info: Info,
};

export const AlertCard: React.FC<AlertCardProps> = ({
  title,
  message,
  type = "warning",
  action,
  className,
}) => {
  const Icon = icons[type];

  return (
    <div
      className={cn(
        "border rounded-xl p-4 flex items-start justify-between gap-3 shadow-md",
        typeStyles[type],
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h5 className="text-sm font-semibold text-text-primary">{title}</h5>
          <div className="text-xs text-text-secondary leading-relaxed">{message}</div>
        </div>
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
