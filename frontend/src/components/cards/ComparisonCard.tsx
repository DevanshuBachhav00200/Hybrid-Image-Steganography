"use client";

import React from "react";
import { ArrowRight, Layers, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export interface ComparisonCardProps {
  originalImage: { src: string; label: string; psnr?: string };
  stegoImage: { src: string; label: string; psnr?: string };
  metrics?: { psnr: string; ssim: string; mse: string };
  className?: string;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({
  originalImage,
  stegoImage,
  metrics = { psnr: "48.52 dB", ssim: "0.9984", mse: "0.0012" },
  className,
}) => {
  return (
    <div
      className={cn(
        "glass-card border border-border rounded-xl p-5 space-y-4 shadow-lg",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          Carrier Image vs. Stego Image Visual Comparison
        </h4>
        <Badge variant="success" size="sm">Imperceptible Delta</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original */}
        <div className="space-y-2">
          <div className="relative aspect-video rounded-lg overflow-hidden border border-border bg-background-secondary">
            {/* eslint-disable-next-next/no-img-element */}
            <img src={originalImage.src} alt={originalImage.label} className="w-full h-full object-cover" />
            <span className="absolute bottom-2 left-2 text-xs bg-background/80 px-2 py-0.5 rounded font-mono text-text-primary border border-border">
              {originalImage.label}
            </span>
          </div>
        </div>

        {/* Stego Image */}
        <div className="space-y-2">
          <div className="relative aspect-video rounded-lg overflow-hidden border border-primary/40 bg-background-secondary shadow-glow-blue">
            {/* eslint-disable-next-next/no-img-element */}
            <img src={stegoImage.src} alt={stegoImage.label} className="w-full h-full object-cover" />
            <span className="absolute bottom-2 left-2 text-xs bg-primary/80 px-2 py-0.5 rounded font-mono text-white border border-primary-light">
              {stegoImage.label}
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Footer */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-background-secondary/80 rounded-lg border border-border/50 text-center font-mono text-xs">
        <div>
          <span className="text-[10px] text-text-muted block uppercase">PSNR</span>
          <span className="text-primary font-bold">{metrics.psnr}</span>
        </div>
        <div>
          <span className="text-[10px] text-text-muted block uppercase">SSIM</span>
          <span className="text-success font-bold">{metrics.ssim}</span>
        </div>
        <div>
          <span className="text-[10px] text-text-muted block uppercase">MSE</span>
          <span className="text-accent font-bold">{metrics.mse}</span>
        </div>
      </div>
    </div>
  );
};
