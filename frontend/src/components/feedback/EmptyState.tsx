"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FileImage,
  ShieldAlert,
  BarChart2,
  Cpu,
  Search,
  Download,
  Inbox,
  ArrowRight,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface EmptyStateProps {
  type?: "encode" | "decode" | "compare" | "dashboard" | "docs" | "gallery" | "downloads" | "generic";
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  primaryAction?: { label: string; onClick: () => void; icon?: React.ReactNode };
  secondaryAction?: { label: string; onClick: () => void; icon?: React.ReactNode };
  className?: string;
}

const defaultPresets = {
  encode: {
    title: "No Carrier Image Uploaded",
    description: "Drag and drop a 24-bit RGB PNG or BMP image file into the dropzone to initiate steganographic encoding.",
    icon: <FileImage className="w-8 h-8 text-primary" />,
  },
  decode: {
    title: "No Stego Carrier Selected",
    description: "Upload an encoded steganographic image file to extract hidden binary bitstreams and AES-256 decrypted payloads.",
    icon: <ShieldAlert className="w-8 h-8 text-secondary" />,
  },
  compare: {
    title: "No Algorithm Benchmarks Available",
    description: "Select algorithms and carrier files to compute Peak Signal-to-Noise Ratio (PSNR) and SSIM structural matrix comparisons.",
    icon: <BarChart2 className="w-8 h-8 text-accent" />,
  },
  dashboard: {
    title: "No Active Session Telemetry",
    description: "Run an encoding or decoding operational session to generate real-time processing latency and 256-bin histogram analytics.",
    icon: <Cpu className="w-8 h-8 text-success" />,
  },
  docs: {
    title: "No Search Results Found",
    description: "No technical documentation topics or glossary terms matched your filter query. Try searching for LSB, AES, or PSNR.",
    icon: <Search className="w-8 h-8 text-text-muted" />,
  },
  gallery: {
    title: "No Application Screenshots",
    description: "Workspace gallery preview assets are currently offline or loading.",
    icon: <FolderOpen className="w-8 h-8 text-primary" />,
  },
  downloads: {
    title: "No Downloadable Assets Ready",
    description: "Export technical reports, JSON OpenAPI specs, or user guides from the documentation center.",
    icon: <Download className="w-8 h-8 text-secondary" />,
  },
  generic: {
    title: "No Data Available",
    description: "There are currently no items or operational records to display.",
    icon: <Inbox className="w-8 h-8 text-text-muted" />,
  },
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = "generic",
  title,
  description,
  icon,
  primaryAction,
  secondaryAction,
  className,
}) => {
  const preset = defaultPresets[type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "glass-card p-8 sm:p-12 border border-border/80 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 shadow-lg relative overflow-hidden select-none",
        className
      )}
    >
      {/* Background Cyber Ambient Blur */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Icon Badge Container */}
      <div className="p-4 rounded-2xl bg-background-secondary border border-border/80 shadow-md text-primary flex items-center justify-center">
        {icon || preset.icon}
      </div>

      <div className="space-y-1.5 max-w-md">
        <h3 className="text-base sm:text-lg font-bold tracking-tight text-text-primary">
          {title || preset.title}
        </h3>
        <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
          {description || preset.description}
        </p>
      </div>

      {/* Action Buttons */}
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {primaryAction && (
            <Button
              variant="primary"
              size="sm"
              onClick={primaryAction.onClick}
              rightIcon={primaryAction.icon || <ArrowRight className="w-4 h-4" />}
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="outline"
              size="sm"
              onClick={secondaryAction.onClick}
              leftIcon={secondaryAction.icon}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
};
