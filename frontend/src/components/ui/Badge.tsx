"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "accent" | "success" | "warning" | "danger" | "info" | "outline" | "muted";
  size?: "sm" | "md" | "lg";
  dot?: boolean;
  glow?: boolean;
  children: React.ReactNode;
}

const variantStyles = {
  primary: "bg-primary/15 text-primary-light border-primary/30",
  secondary: "bg-secondary/15 text-secondary-light border-secondary/30",
  accent: "bg-accent/15 text-accent-light border-accent/30",
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  danger: "bg-danger/15 text-danger border-danger/30",
  info: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  outline: "bg-transparent text-text-secondary border-border",
  muted: "bg-card-hover text-text-muted border-border/50",
};

const dotColors = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-blue-400",
  outline: "bg-text-secondary",
  muted: "bg-text-muted",
};

const sizeStyles = {
  sm: "text-[10px] px-2 py-0.5 rounded gap-1 font-medium",
  md: "text-xs px-2.5 py-1 rounded-md gap-1.5 font-medium",
  lg: "text-sm px-3 py-1.5 rounded-lg gap-2 font-semibold",
};

export const Badge: React.FC<BadgeProps> = ({
  variant = "primary",
  size = "md",
  dot = false,
  glow = false,
  children,
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center border font-mono tracking-tight transition-all duration-200 select-none",
        variantStyles[variant],
        sizeStyles[size],
        glow && "shadow-sm",
        glow && variant === "primary" && "shadow-primary/30",
        glow && variant === "success" && "shadow-success/30",
        glow && variant === "danger" && "shadow-danger/30",
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0 animate-pulse",
            dotColors[variant]
          )}
        />
      )}
      {children}
    </span>
  );
};
