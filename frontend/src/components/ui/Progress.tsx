"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 - 100
  max?: number;
  variant?: "primary" | "secondary" | "accent" | "success" | "danger";
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  label?: string;
}

const variantStyles = {
  primary: "bg-primary shadow-glow-blue",
  secondary: "bg-secondary shadow-glow-purple",
  accent: "bg-accent shadow-glow-cyan",
  success: "bg-success shadow-glow-emerald",
  danger: "bg-danger shadow-glow-danger",
};

const sizeStyles = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  variant = "primary",
  size = "md",
  showValue = false,
  label,
  className,
  ...props
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("w-full space-y-1.5", className)} {...props}>
      {(label || showValue) && (
        <div className="flex justify-between items-center text-xs font-medium">
          {label && <span className="text-text-secondary">{label}</span>}
          {showValue && <span className="text-text-primary font-mono">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={cn("w-full bg-background-secondary rounded-full overflow-hidden border border-border/40 p-0.5", sizeStyles[size])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn("h-full rounded-full transition-all duration-300", variantStyles[variant])}
        />
      </div>
    </div>
  );
};
