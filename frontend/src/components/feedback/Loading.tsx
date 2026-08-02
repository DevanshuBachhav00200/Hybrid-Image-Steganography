"use client";

import React from "react";
import { motion } from "framer-motion";
import { Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

// Spinner Props
export interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "accent" | "white";
  className?: string;
}

const spinnerSizes = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-3",
  xl: "w-12 h-12 border-4",
};

const spinnerColors = {
  primary: "border-primary/20 border-t-primary",
  secondary: "border-secondary/20 border-t-secondary",
  accent: "border-accent/20 border-t-accent",
  white: "border-white/20 border-t-white",
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  variant = "primary",
  className,
}) => {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "rounded-full animate-spin shrink-0",
        spinnerSizes[size],
        spinnerColors[variant],
        className
      )}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Pulse Loader
export const PulseLoader: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2.5 h-2.5 rounded-full bg-primary"
          animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.18,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Dots Bouncing Loader
export const DotsLoader: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-secondary"
          animate={{ y: ["0%", "-100%", "0%"] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

// Linear Progress Bar
export interface LinearProgressProps {
  value?: number; // 0 - 100 or undefined for indeterminate
  variant?: "primary" | "secondary" | "success" | "accent";
  height?: number;
  className?: string;
  showPercentage?: boolean;
}

export const LinearProgress: React.FC<LinearProgressProps> = ({
  value,
  variant = "primary",
  height = 6,
  className,
  showPercentage = false,
}) => {
  const isIndeterminate = value === undefined;

  const bgVariants = {
    primary: "bg-primary shadow-glow-blue",
    secondary: "bg-secondary shadow-glow-purple",
    success: "bg-success shadow-glow-emerald",
    accent: "bg-accent shadow-glow-cyan",
  };

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {showPercentage && value !== undefined && (
        <div className="flex justify-between text-xs font-mono font-medium text-text-muted">
          <span>Processing Progress</span>
          <span>{Math.round(value)}%</span>
        </div>
      )}
      <div
        className="w-full bg-background-secondary rounded-full overflow-hidden border border-border/50 relative"
        style={{ height }}
      >
        {isIndeterminate ? (
          <motion.div
            className={cn("h-full rounded-full w-1/3", bgVariants[variant])}
            animate={{ x: ["-100%", "300%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : (
          <motion.div
            className={cn("h-full rounded-full transition-all duration-300", bgVariants[variant])}
            style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          />
        )}
      </div>
    </div>
  );
};

// Full Page Loader Overlay
export interface PageLoaderProps {
  message?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ message = "Loading Steganography Workspace..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md space-y-4">
      <div className="p-4 rounded-2xl bg-card border border-border shadow-2xl flex flex-col items-center space-y-3">
        <Spinner size="xl" variant="primary" />
        <p className="text-xs font-mono text-text-primary font-bold tracking-wider uppercase animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};

// Card / Section Loading Overlay
export interface SectionLoaderProps {
  message?: string;
  className?: string;
}

export const SectionLoader: React.FC<SectionLoaderProps> = ({
  message = "Processing request...",
  className,
}) => {
  return (
    <div
      className={cn(
        "absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/70 backdrop-blur-xs rounded-xl space-y-3 p-4",
        className
      )}
    >
      <Spinner size="lg" variant="primary" />
      <span className="text-xs font-mono text-text-secondary font-medium">{message}</span>
    </div>
  );
};
