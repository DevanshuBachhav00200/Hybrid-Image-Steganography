"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  FileX,
  Lock,
  WifiOff,
  ServerCrash,
  RefreshCw,
  Home,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface ErrorStateProps {
  type?: "invalid-image" | "file-too-large" | "wrong-password" | "operation-failed" | "network-error" | "404" | "500" | "generic";
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  className?: string;
}

const errorPresets = {
  "invalid-image": {
    title: "Invalid Carrier Image Format",
    message: "The uploaded file is corrupted or unsupported. Please upload a valid 24-bit RGB PNG or BMP digital image file.",
    icon: <FileX className="w-8 h-8 text-danger" />,
  },
  "file-too-large": {
    title: "File Payload Exceeds Carrier Capacity",
    message: "The secret message length exceeds the maximum steganographic capacity of the selected carrier image.",
    icon: <AlertTriangle className="w-8 h-8 text-warning" />,
  },
  "wrong-password": {
    title: "AES-256 Decryption Failed",
    message: "Incorrect passphrase entered or authentication tag mismatch. Payload extraction has been halted to prevent data loss.",
    icon: <Lock className="w-8 h-8 text-danger" />,
  },
  "operation-failed": {
    title: "Steganographic Processing Error",
    message: "An unexpected error occurred during binary bit insertion. Please retry or choose a different algorithm domain.",
    icon: <ShieldAlert className="w-8 h-8 text-danger" />,
  },
  "network-error": {
    title: "Gateway Connection Unavailable",
    message: "Unable to reach REST API processing gateway. Check network connection and server status.",
    icon: <WifiOff className="w-8 h-8 text-warning" />,
  },
  "404": {
    title: "404 - Page Not Found",
    message: "The requested steganography workspace page or documentation route does not exist.",
    icon: <ServerCrash className="w-8 h-8 text-secondary" />,
  },
  "500": {
    title: "500 - Internal Server Error",
    message: "An internal system error occurred. The research team has been notified.",
    icon: <ServerCrash className="w-8 h-8 text-danger" />,
  },
  generic: {
    title: "An Error Occurred",
    message: "Something went wrong while processing your request. Please try again.",
    icon: <AlertTriangle className="w-8 h-8 text-danger" />,
  },
};

export const ErrorState: React.FC<ErrorStateProps> = ({
  type = "generic",
  title,
  message,
  onRetry,
  onGoHome,
  className,
}) => {
  const preset = errorPresets[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "glass-card p-8 border border-danger/30 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 shadow-glow-danger select-none",
        className
      )}
    >
      <div className="p-3.5 rounded-2xl bg-danger/15 text-danger border border-danger/30 shadow-md">
        {preset.icon}
      </div>

      <div className="space-y-1.5 max-w-md">
        <h3 className="text-base sm:text-lg font-bold tracking-tight text-text-primary">
          {title || preset.title}
        </h3>
        <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
          {message || preset.message}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {onRetry && (
          <Button variant="danger" size="sm" onClick={onRetry} leftIcon={<RefreshCw className="w-4 h-4" />}>
            Retry Operation
          </Button>
        )}
        {onGoHome && (
          <Button variant="outline" size="sm" onClick={onGoHome} leftIcon={<Home className="w-4 h-4" />}>
            Back to Home
          </Button>
        )}
      </div>
    </motion.div>
  );
};
