"use client";

import React from "react";
import { PageContainer } from "./PageContainer";
import { PageHeader } from "./PageHeader";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export interface PageTemplateProps {
  title: string;
  description: string;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  heroActions?: React.ReactNode;
  children?: React.ReactNode;
  containerSize?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}

export const PageTemplate: React.FC<PageTemplateProps> = ({
  title,
  description,
  badge = <Badge variant="accent" size="md">Phase Placeholder</Badge>,
  icon,
  heroActions,
  children,
  containerSize = "lg",
  className,
}) => {
  return (
    <PageContainer size={containerSize} className={cn("space-y-8", className)}>
      {/* Hero Section */}
      <div className="glass-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <PageHeader title={title} description={description} badge={badge} actions={heroActions} />

        {/* Hero Visual Card / Quick Overview */}
        {icon && (
          <div className="flex items-center gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/30 text-primary shadow-glow-blue">
              {icon}
            </div>
            <div className="text-xs text-text-muted font-mono">
              System Layer Active • Ready for Phase Modular Integration
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {children && <div className="space-y-6">{children}</div>}
    </PageContainer>
  );
};
