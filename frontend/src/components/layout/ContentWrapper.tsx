"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ContentWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "glass" | "card" | "solid";
  padding?: "sm" | "md" | "lg" | "none";
}

const variantStyles = {
  glass: "glass-card border border-border shadow-lg",
  card: "bg-card border border-border shadow-md",
  solid: "bg-background-secondary border border-border/80",
};

const paddingStyles = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const ContentWrapper: React.FC<ContentWrapperProps> = ({
  children,
  variant = "glass",
  padding = "md",
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden transition-all duration-300",
        variantStyles[variant],
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
