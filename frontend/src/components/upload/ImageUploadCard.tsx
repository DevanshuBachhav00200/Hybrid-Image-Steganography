"use client";

import React from "react";
import { Upload, FileImage, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export interface ImageUploadCardProps {
  title?: string;
  subtitle?: string;
  onUploadClick?: () => void;
  acceptedFormats?: string[];
  maxDimensions?: string;
  className?: string;
}

export const ImageUploadCard: React.FC<ImageUploadCardProps> = ({
  title = "Select Carrier Image",
  subtitle = "Upload host image for steganographic Morse embedding",
  onUploadClick,
  acceptedFormats = ["PNG", "JPEG", "BMP"],
  maxDimensions = "4096 x 4096 px",
  className,
}) => {
  return (
    <div
      className={cn(
        "glass-card rounded-xl p-6 border border-border flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all duration-300",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-primary">
          <FileImage className="w-6 h-6" />
        </div>
        <Badge variant="accent" size="sm">Carrier Node</Badge>
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        <p className="text-xs text-text-muted">{subtitle}</p>
      </div>

      <div className="py-2 border-t border-b border-border/50 grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-text-muted block">Supported Formats:</span>
          <span className="font-mono text-text-secondary font-medium">{acceptedFormats.join(", ")}</span>
        </div>
        <div>
          <span className="text-text-muted block">Max Resolution:</span>
          <span className="font-mono text-text-secondary font-medium">{maxDimensions}</span>
        </div>
      </div>

      <Button
        variant="primary"
        className="w-full"
        leftIcon={<Upload className="w-4 h-4" />}
        onClick={onUploadClick}
      >
        Upload Image
      </Button>
    </div>
  );
};
