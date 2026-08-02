"use client";

import React from "react";
import { X, Eye, Maximize2, FileCheck } from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FileMetadata } from "@/types/components";

export interface PreviewCardProps {
  imageSrc: string;
  metadata?: FileMetadata;
  onRemove?: () => void;
  onPreviewClick?: () => void;
  className?: string;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({
  imageSrc,
  metadata,
  onRemove,
  onPreviewClick,
  className,
}) => {
  return (
    <div
      className={cn(
        "glass-card rounded-xl overflow-hidden border border-border p-4 space-y-3 relative group",
        className
      )}
    >
      <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-background-secondary border border-border/60">
        {/* eslint-disable-next-next/no-img-element */}
        <img
          src={imageSrc}
          alt={metadata?.name || "Uploaded Preview"}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 backdrop-blur-xs">
          {onPreviewClick && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Maximize2 className="w-4 h-4" />}
              onClick={onPreviewClick}
            >
              Zoom Preview
            </Button>
          )}
        </div>

        {onRemove && (
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-danger text-text-secondary hover:text-white border border-border transition-colors shadow-md"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {metadata && (
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="truncate max-w-[180px]">
            <p className="font-semibold text-text-primary truncate">{metadata.name}</p>
            <p className="text-text-muted font-mono">{formatBytes(metadata.size)}</p>
          </div>
          {metadata.dimensions && (
            <Badge variant="muted" size="sm">
              {metadata.dimensions.width} × {metadata.dimensions.height}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
