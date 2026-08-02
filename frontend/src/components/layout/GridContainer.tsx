"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface GridContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const colStyles = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

const gapStyles = {
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
};

export const GridContainer: React.FC<GridContainerProps> = ({
  cols = 3,
  gap = "md",
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn("grid", colStyles[cols], gapStyles[gap], className)} {...props}>
      {children}
    </div>
  );
};
