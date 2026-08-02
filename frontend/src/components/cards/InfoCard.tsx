"use client";

import React from "react";
import { Info, HelpCircle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InfoCardProps {
  title: string;
  description: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "accent";
  className?: string;
}

const variantStyles = {
  primary: "border-primary/40 bg-primary/5 text-primary",
  secondary: "border-secondary/40 bg-secondary/5 text-secondary",
  accent: "border-accent/40 bg-accent/5 text-accent",
};

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  description,
  icon,
  variant = "primary",
  className,
}) => {
  return (
    <div
      className={cn(
        "glass-card border rounded-xl p-5 flex items-start gap-3.5 shadow-sm",
        variantStyles[variant],
        className
      )}
    >
      <div className="p-2 rounded-lg bg-background-secondary shrink-0">
        {icon || <Info className="w-5 h-5" />}
      </div>

      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-text-primary">{title}</h4>
        <div className="text-xs text-text-muted leading-relaxed">{description}</div>
      </div>
    </div>
  );
};
