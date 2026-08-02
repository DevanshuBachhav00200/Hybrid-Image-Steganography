"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface DashboardCardProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  subtitle,
  action,
  children,
  className,
  contentClassName,
}) => {
  return (
    <div
      className={cn(
        "glass-card border border-border rounded-xl flex flex-col shadow-lg overflow-hidden",
        className
      )}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/70 bg-card/40">
        <div>
          <h3 className="text-base font-semibold text-text-primary">{title}</h3>
          {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>

      <div className={cn("p-6 flex-1", contentClassName)}>{children}</div>
    </div>
  );
};
