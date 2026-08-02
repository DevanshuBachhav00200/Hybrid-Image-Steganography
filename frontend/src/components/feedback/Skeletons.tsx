"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = "rectangular",
  width,
  height,
}) => {
  const variantStyles = {
    text: "h-4 w-full rounded",
    circular: "rounded-full shrink-0",
    rectangular: "rounded-xl w-full",
  };

  return (
    <div
      style={{ width, height }}
      className={cn(
        "bg-card/70 border border-border/40 relative overflow-hidden animate-pulse",
        variantStyles[variant],
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
    </div>
  );
};

// Preset Skeleton Loaders
export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("glass-card p-5 border border-border rounded-xl space-y-4 shadow-md", className)}>
    <div className="flex items-center justify-between">
      <Skeleton variant="text" className="w-1/3 h-4" />
      <Skeleton variant="circular" className="w-8 h-8" />
    </div>
    <Skeleton variant="rectangular" className="h-16" />
    <div className="flex justify-between items-center pt-2">
      <Skeleton variant="text" className="w-1/4 h-3" />
      <Skeleton variant="text" className="w-1/4 h-3" />
    </div>
  </div>
);

export const SkeletonMetric: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("glass-card p-5 border border-border rounded-xl space-y-3 shadow-md", className)}>
    <div className="flex justify-between items-center">
      <Skeleton variant="text" className="w-24 h-3" />
      <Skeleton variant="circular" className="w-7 h-7" />
    </div>
    <Skeleton variant="text" className="w-32 h-7" />
    <div className="flex justify-between items-center pt-1">
      <Skeleton variant="text" className="w-16 h-3" />
      <Skeleton variant="text" className="w-20 h-3" />
    </div>
  </div>
);

export const SkeletonChart: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("glass-card p-6 border border-border rounded-xl space-y-6 shadow-md", className)}>
    <div className="flex justify-between items-center">
      <Skeleton variant="text" className="w-48 h-5" />
      <Skeleton variant="text" className="w-24 h-4" />
    </div>
    <Skeleton variant="rectangular" className="h-64 rounded-xl" />
    <div className="flex justify-center gap-4">
      <Skeleton variant="text" className="w-20 h-3" />
      <Skeleton variant="text" className="w-20 h-3" />
      <Skeleton variant="text" className="w-20 h-3" />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; className?: string }> = ({
  rows = 5,
  className,
}) => (
  <div className={cn("glass-card p-4 border border-border rounded-xl space-y-3 shadow-md", className)}>
    <div className="flex justify-between pb-2 border-b border-border/70">
      <Skeleton variant="text" className="w-1/4 h-4" />
      <Skeleton variant="text" className="w-1/4 h-4" />
      <Skeleton variant="text" className="w-1/4 h-4" />
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex justify-between items-center py-2 border-b border-border/40">
        <Skeleton variant="text" className="w-1/5 h-3" />
        <Skeleton variant="text" className="w-1/4 h-3" />
        <Skeleton variant="text" className="w-1/6 h-3" />
      </div>
    ))}
  </div>
);

export const SkeletonUpload: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("glass-card p-8 border-2 border-dashed border-border rounded-xl space-y-4 flex flex-col items-center justify-center text-center", className)}>
    <Skeleton variant="circular" className="w-14 h-14" />
    <Skeleton variant="text" className="w-48 h-4" />
    <Skeleton variant="text" className="w-32 h-3" />
  </div>
);

export const SkeletonHero: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("glass-card p-10 border border-border rounded-2xl space-y-6 shadow-xl", className)}>
    <Skeleton variant="text" className="w-32 h-4" />
    <Skeleton variant="text" className="w-3/4 h-10" />
    <Skeleton variant="text" className="w-1/2 h-5" />
    <div className="flex gap-4 pt-4">
      <Skeleton variant="rectangular" className="w-36 h-10 rounded-lg" />
      <Skeleton variant="rectangular" className="w-36 h-10 rounded-lg" />
    </div>
  </div>
);
