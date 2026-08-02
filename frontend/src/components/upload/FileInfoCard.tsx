"use client";

import React from "react";
import { FileText, HardDrive, Hash, Grid } from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";

export interface FileInfoCardProps {
  fileName: string;
  fileSize: number;
  fileType: string;
  resolution?: string;
  colorDepth?: string;
  capacityEst?: string;
  className?: string;
}

export const FileInfoCard: React.FC<FileInfoCardProps> = ({
  fileName,
  fileSize,
  fileType,
  resolution = "1920 × 1080 px",
  colorDepth = "24-bit RGB",
  capacityEst = "245.7 KB Payload",
  className,
}) => {
  const details = [
    { label: "File Format", value: fileType.toUpperCase(), icon: FileText },
    { label: "File Size", value: formatBytes(fileSize), icon: HardDrive },
    { label: "Resolution", value: resolution, icon: Grid },
    { label: "Color Depth", value: colorDepth, icon: Hash },
  ];

  return (
    <div
      className={cn(
        "glass-card border border-border rounded-xl p-4 space-y-3",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <h4 className="text-sm font-semibold text-text-primary truncate">{fileName}</h4>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
          Est. Capacity: {capacityEst}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        {details.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <div className="p-1.5 rounded bg-background-secondary text-text-muted">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-text-muted block text-[10px] uppercase">{item.label}</span>
                <span className="font-mono text-text-primary font-medium">{item.value}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
