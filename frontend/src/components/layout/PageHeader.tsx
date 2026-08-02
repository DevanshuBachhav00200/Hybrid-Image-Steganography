"use client";

import React from "react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  badge,
  actions,
  className,
}) => {
  return (
    <div className={cn("space-y-3 pb-4 border-b border-border/60", className)}>
      <Breadcrumb />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
              {title}
            </h1>
            {badge && <div>{badge}</div>}
          </div>
          {description && <p className="text-xs sm:text-sm text-text-muted max-w-3xl leading-relaxed">{description}</p>}
        </div>
        {actions && <div className="shrink-0 flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
};
