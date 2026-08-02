"use client";

import React from "react";
import { Container } from "./Container";
import { cn } from "@/lib/utils";

export interface DashboardLayoutProps {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  header,
  sidebar,
  children,
  className,
}) => {
  return (
    <Container size="xl" className={cn("py-6 space-y-6", className)}>
      {header && <div className="w-full">{header}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {sidebar && <aside className="lg:col-span-4 space-y-6">{sidebar}</aside>}
        <div className={cn(sidebar ? "lg:col-span-8" : "lg:col-span-12", "space-y-6")}>
          {children}
        </div>
      </div>
    </Container>
  );
};
