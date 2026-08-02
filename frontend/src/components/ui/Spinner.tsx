"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "accent" | "white";
  label?: string;
}

const sizeStyles = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

const variantStyles = {
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
  white: "text-white",
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  variant = "primary",
  label,
  className,
  ...props
}) => {
  return (
    <div className={cn("inline-flex flex-col items-center justify-center gap-2", className)} {...props}>
      <Loader2
        className={cn(
          "animate-spin",
          sizeStyles[size],
          variantStyles[variant]
        )}
      />
      {label && <span className="text-xs text-text-muted font-medium">{label}</span>}
    </div>
  );
};
