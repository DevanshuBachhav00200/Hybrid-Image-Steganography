"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  HelpCircle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: "confirmation" | "success" | "error" | "warning" | "info";
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  isLoading?: boolean;
}

const modalTypeIcons = {
  confirmation: <HelpCircle className="w-6 h-6 text-primary" />,
  success: <CheckCircle2 className="w-6 h-6 text-success" />,
  error: <XCircle className="w-6 h-6 text-danger" />,
  warning: <AlertTriangle className="w-6 h-6 text-warning" />,
  info: <Info className="w-6 h-6 text-secondary" />,
};

const modalTypeBorders = {
  confirmation: "border-primary/40 shadow-glow-blue",
  success: "border-success/40 shadow-glow-emerald",
  error: "border-danger/40 shadow-glow-danger",
  warning: "border-warning/40 shadow-glow-amber",
  info: "border-secondary/40 shadow-glow-purple",
};

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  type = "info",
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  isLoading = false,
}) => {
  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={cn(
              "relative z-10 w-full max-w-md glass-card p-6 rounded-2xl border space-y-4 shadow-2xl overflow-hidden",
              modalTypeBorders[type]
            )}
          >
            {/* Close Icon Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-card-hover transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-start gap-3.5 pr-6">
              <div className="p-2.5 rounded-xl bg-background-secondary border border-border shrink-0">
                {modalTypeIcons[type]}
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-text-primary">{title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{description}</p>
              </div>
            </div>

            {/* Action Toolbar */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
              {type === "confirmation" && (
                <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                  {cancelText}
                </Button>
              )}
              <Button
                variant={type === "error" ? "danger" : type === "warning" ? "accent" : "primary"}
                size="sm"
                onClick={() => {
                  if (onConfirm) onConfirm();
                  else onClose();
                }}
                isLoading={isLoading}
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
