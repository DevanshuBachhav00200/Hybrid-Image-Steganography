"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: { value: string; positive: boolean };
  icon?: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  change,
  icon,
  subtitle,
  className,
}) => {
  return (
    <div
      className={cn(
        "glass-card border border-border rounded-xl p-5 space-y-3 shadow-md hover:border-border-hover transition-colors",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">{title}</span>
        {icon && <div className="p-2 rounded-lg bg-background-secondary text-primary">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold font-mono text-text-primary tracking-tight">{value}</span>
        {unit && <span className="text-xs text-text-muted font-mono">{unit}</span>}
      </div>

      <div className="flex items-center justify-between pt-1">
        {change && (
          <Badge
            variant={change.positive ? "success" : "danger"}
            size="sm"
            className="gap-1 font-mono"
          >
            {change.positive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {change.value}
          </Badge>
        )}
        {subtitle && <span className="text-[11px] text-text-muted">{subtitle}</span>}
      </div>
    </div>
  );
};
