"use client";

import React from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { SkipToContent } from "@/components/navigation/SkipToContent";
import { PageTransition } from "./PageTransition";
import { cn } from "@/lib/utils";

export interface AppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  className?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  showSidebar = true,
  className,
}) => {
  return (
    <div className="flex min-h-screen bg-background text-text-primary overflow-x-hidden">
      <SkipToContent />
      {showSidebar && <Sidebar />}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main id="main-content" tabIndex={-1} className={cn("flex-1 flex flex-col w-full outline-none", className)}>
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </div>
    </div>
  );
};
