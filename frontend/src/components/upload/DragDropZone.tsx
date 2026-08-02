"use client";

import React, { useState } from "react";
import { UploadCloud, Image as ImageIcon, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface DragDropZoneProps {
  onFileSelect?: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  disabled?: boolean;
  className?: string;
}

export const DragDropZone: React.FC<DragDropZoneProps> = ({
  onFileSelect,
  accept = "image/png, image/jpeg, image/bmp",
  maxSizeMB = 10,
  disabled = false,
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (onFileSelect) onFileSelect(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (onFileSelect) onFileSelect(file);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all duration-200 text-center select-none cursor-pointer",
        isDragging
          ? "border-primary bg-primary/10 shadow-glow-blue scale-[1.01]"
          : "border-border hover:border-primary/50 bg-background-secondary/50 hover:bg-card/60",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleInputChange}
        disabled={disabled}
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
      />
      <div className="p-3 bg-primary/15 rounded-full text-primary mb-3 shadow-inner">
        <UploadCloud className="w-8 h-8 animate-bounce" />
      </div>
      <h4 className="text-base font-semibold text-text-primary mb-1">
        Drag & Drop Carrier Image Here
      </h4>
      <p className="text-xs text-text-muted max-w-xs mb-4">
        Supports PNG, JPEG, and BMP formats up to {maxSizeMB}MB
      </p>

      <Button type="button" variant="outline" size="sm" leftIcon={<ImageIcon className="w-4 h-4" />}>
        Browse Files
      </Button>
    </div>
  );
};
