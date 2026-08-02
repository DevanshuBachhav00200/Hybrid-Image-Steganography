"use client";

import React from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { cn } from "@/lib/utils";

export interface SidebarLayoutProps {
  activePath?: string;
  children: React.ReactNode;
  className?: string;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  activePath,
  children,
  className,
}) => {
  return (
    <div className="flex min-h-screen bg-background text-text-primary">
      <Sidebar activePath={activePath} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar activePath={activePath} />
        <main className={cn("flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6", className)}>
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};
