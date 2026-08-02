"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  spacing?: "sm" | "md" | "lg";
}

const spacingStyles = {
  sm: "py-6 space-y-4",
  md: "py-10 space-y-6",
  lg: "py-16 space-y-8",
};

export const Section: React.FC<SectionProps> = ({
  title,
  subtitle,
  action,
  children,
  spacing = "md",
  className,
  ...props
}) => {
  return (
    <section className={cn("w-full", spacingStyles[spacing], className)} {...props}>
      {(title || subtitle || action) && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
          <div className="space-y-1">
            {title && <h2 className="text-xl font-bold tracking-tight text-text-primary">{title}</h2>}
            {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
};
