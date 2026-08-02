"use client";

import React from "react";
import { Cpu, ShieldCheck, Zap, BarChart2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";

export interface AlgorithmCardProps {
  id: "lsb" | "dct" | "dwt";
  name: string;
  fullName: string;
  domain: string;
  description: string;
  capacityScore: number;
  robustnessScore: number;
  speedScore: number;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
}

export const AlgorithmCard: React.FC<AlgorithmCardProps> = ({
  name,
  fullName,
  domain,
  description,
  capacityScore,
  robustnessScore,
  speedScore,
  isSelected = false,
  onSelect,
  className,
}) => {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "glass-card border rounded-xl p-5 space-y-4 cursor-pointer transition-all duration-300 relative select-none",
        isSelected
          ? "border-primary bg-primary/10 shadow-glow-blue scale-[1.01]"
          : "border-border hover:border-primary/40 hover:bg-card-hover/80",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center font-bold font-mono text-sm border",
              isSelected
                ? "bg-primary text-white border-primary-light shadow-md"
                : "bg-background-secondary text-primary border-border"
            )}
          >
            {name}
          </div>
          <div>
            <h4 className="text-base font-semibold text-text-primary">{fullName}</h4>
            <span className="text-xs text-text-muted">{domain}</span>
          </div>
        </div>

        {isSelected && (
          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 animate-fadeIn" />
        )}
      </div>

      <p className="text-xs text-text-muted leading-relaxed line-clamp-2">{description}</p>

      <div className="space-y-2 pt-2 border-t border-border/50">
        <Progress value={capacityScore} label="Capacity Payload" size="sm" variant="accent" showValue />
        <Progress value={robustnessScore} label="Robustness & Security" size="sm" variant="secondary" showValue />
        <Progress value={speedScore} label="Execution Speed" size="sm" variant="success" showValue />
      </div>
    </div>
  );
};
