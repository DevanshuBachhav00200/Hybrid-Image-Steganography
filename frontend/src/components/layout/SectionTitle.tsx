"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SectionTitleProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  action,
  className,
}) => {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4", className)}>
      <div className="space-y-1">
        <h3 className="text-lg font-bold tracking-tight text-text-primary flex items-center gap-2">
          <span className="w-1.5 h-4 bg-primary rounded-full shrink-0" />
          {title}
        </h3>
        {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
