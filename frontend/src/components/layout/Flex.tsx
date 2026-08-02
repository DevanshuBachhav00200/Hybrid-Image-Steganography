"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "col";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around";
  wrap?: boolean;
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

const directionStyles = {
  row: "flex-row",
  col: "flex-col",
};

const alignStyles = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const justifyStyles = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
};

const gapStyles = {
  none: "gap-0",
  xs: "gap-1.5",
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

export const Flex: React.FC<FlexProps> = ({
  direction = "row",
  align = "center",
  justify = "start",
  wrap = false,
  gap = "md",
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex",
        directionStyles[direction],
        alignStyles[align],
        justifyStyles[justify],
        wrap && "flex-wrap",
        gapStyles[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
