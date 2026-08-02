"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  valueDisplay?: string | number;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, valueDisplay, min = 0, max = 100, value, disabled, ...props }, ref) => {
    const currentVal = Number(value ?? props.defaultValue ?? 0);
    const minVal = Number(min);
    const maxVal = Number(max);
    const percentage = Math.min(100, Math.max(0, ((currentVal - minVal) / (maxVal - minVal)) * 100));

    return (
      <div className="w-full space-y-2 select-none">
        {(label || valueDisplay !== undefined) && (
          <div className="flex justify-between items-center text-xs">
            {label && <span className="font-medium text-text-secondary">{label}</span>}
            {valueDisplay !== undefined && (
              <span className="font-mono text-primary font-semibold">{valueDisplay}</span>
            )}
          </div>
        )}
        <div className="relative flex items-center">
          <input
            type="range"
            ref={ref}
            min={min}
            max={max}
            value={value}
            disabled={disabled}
            className={cn(
              "w-full h-2 bg-background-secondary rounded-lg appearance-none cursor-pointer focus-ring",
              "accent-primary",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              className
            )}
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #111827 ${percentage}%, #111827 100%)`,
            }}
            {...props}
          />
        </div>
      </div>
    );
  }
);
Slider.displayName = "Slider";
