"use client";

import React, { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type?: "success" | "danger" | "warning" | "info";
  duration?: number;
}

interface ToastContextType {
  toast: (options: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const icons = {
  success: CheckCircle2,
  danger: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const borderStyles = {
  success: "border-success/40 bg-card/90 text-success shadow-glow-emerald",
  danger: "border-danger/40 bg-card/90 text-danger shadow-glow-danger",
  warning: "border-warning/40 bg-card/90 text-warning",
  info: "border-primary/40 bg-card/90 text-primary shadow-glow-blue",
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = ({ title, message, type = "info", duration = 4000 }: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastItem = { id, title, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = icons[t.type || "info"];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className={cn(
                  "pointer-events-auto border rounded-xl p-4 flex items-start justify-between gap-3 shadow-xl backdrop-blur-md",
                  borderStyles[t.type || "info"]
                )}
              >
                <div className="flex items-start gap-2.5">
                  <Icon className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <h5 className="text-sm font-semibold text-text-primary">{t.title}</h5>
                    {t.message && <p className="text-xs text-text-muted">{t.message}</p>}
                  </div>
                </div>

                <button
                  onClick={() => removeToast(t.id)}
                  className="text-text-muted hover:text-text-primary transition-colors p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
