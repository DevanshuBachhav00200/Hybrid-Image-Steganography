"use client";

import React, { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonTactileVariants } from "@/styles/animations";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success" | "accent";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const variantStyles = {
  primary:
    "bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/20 hover:shadow-glow-blue border border-primary/40",
  secondary:
    "bg-secondary hover:bg-secondary-hover text-white shadow-md shadow-secondary/20 hover:shadow-glow-purple border border-secondary/40",
  accent:
    "bg-accent hover:bg-accent-hover text-slate-950 font-semibold shadow-md shadow-accent/20 hover:shadow-glow-cyan border border-accent/40",
  outline:
    "bg-transparent hover:bg-card-hover text-text-primary border border-border hover:border-border-hover",
  ghost:
    "bg-transparent hover:bg-card-hover text-text-secondary hover:text-text-primary border border-transparent",
  danger:
    "bg-danger hover:bg-danger-hover text-white shadow-md shadow-danger/20 hover:shadow-glow-danger border border-danger/40",
  success:
    "bg-success hover:bg-success-hover text-white shadow-md shadow-success/20 hover:shadow-glow-emerald border border-success/40",
};

const sizeStyles = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-md",
  md: "h-10 px-4 text-sm gap-2 rounded-lg",
  lg: "h-12 px-6 text-base gap-2.5 rounded-xl font-semibold",
  icon: "h-10 w-10 p-0 rounded-lg justify-center items-center",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const isButtonDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        whileHover={isButtonDisabled ? undefined : buttonTactileVariants.whileHover}
        whileTap={isButtonDisabled ? undefined : buttonTactileVariants.whileTap}
        disabled={isButtonDisabled}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 focus-ring cursor-pointer select-none",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
