"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SkipToContentProps {
  contentId?: string;
  className?: string;
}

export const SkipToContent: React.FC<SkipToContentProps> = ({
  contentId = "main-content",
  className,
}) => {
  return (
    <a
      href={`#${contentId}`}
      className={cn(
        "sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50",
        "px-4 py-2 bg-primary text-white text-xs font-bold font-mono rounded-lg shadow-glow-blue border border-primary/50",
        "outline-none ring-2 ring-white ring-offset-2 ring-offset-background transition-all select-none",
        className
      )}
    >
      Skip to main content
    </a>
  );
};
