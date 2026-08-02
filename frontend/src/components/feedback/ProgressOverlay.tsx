"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Cpu, Lock, Radio, Binary, FileImage } from "lucide-react";
import { cn } from "@/lib/utils";
import { LinearProgress } from "./Loading";

export interface ProgressOverlayProps {
  isVisible: boolean;
  stage?: number; // 1 to 5
  progress?: number; // 0 to 100
  title?: string;
  className?: string;
}

const pipelineStages = [
  { step: 1, title: "Plaintext Pre-Modulation", icon: Radio, desc: "Converting text characters to Morse Code signals" },
  { step: 2, title: "AES-256 GCM Encryption", icon: Lock, desc: "Applying 256-bit symmetric cipher & GCM tag" },
  { step: 3, title: "Binary Serialization", icon: Binary, desc: "Formatting encrypted payload into 8-bit stream" },
  { step: 4, title: "Multi-Domain Insertion", icon: Cpu, desc: "Embedding bits into LSB / DCT / DWT matrix" },
  { step: 5, title: "Carrier Finalization", icon: FileImage, desc: "Verifying SHA-256 hash & rendering stego carrier" },
];

export const ProgressOverlay: React.FC<ProgressOverlayProps> = ({
  isVisible,
  stage = 3,
  progress = 65,
  title = "Steganographic Encoding Pipeline Active",
  className,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md select-none",
            className
          )}
        >
          <motion.div
            initial={{ scale: 0.92, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 12 }}
            className="w-full max-w-lg glass-card p-6 rounded-2xl border border-primary/40 space-y-6 shadow-glow-blue relative overflow-hidden"
          >
            {/* Header */}
            <div className="space-y-1 text-center">
              <h3 className="text-base font-bold text-text-primary flex items-center justify-center gap-2">
                <Cpu className="w-5 h-5 text-primary animate-pulse" />
                {title}
              </h3>
              <p className="text-xs text-text-muted font-mono">Stage {stage} of 5 • {progress}% Completed</p>
            </div>

            {/* Progress Bar */}
            <LinearProgress value={progress} variant="primary" height={8} showPercentage={false} />

            {/* Stage Timeline Checklist */}
            <div className="space-y-2.5 pt-2">
              {pipelineStages.map((stg) => {
                const Icon = stg.icon;
                const isComplete = stg.step < stage;
                const isCurrent = stg.step === stage;

                return (
                  <div
                    key={stg.step}
                    className={cn(
                      "p-3 rounded-xl border text-xs flex items-center justify-between transition-all duration-200",
                      isCurrent
                        ? "bg-primary/10 border-primary/40 text-text-primary shadow-sm"
                        : isComplete
                        ? "bg-background-secondary/60 border-border/50 text-text-muted"
                        : "bg-background-secondary/30 border-border/30 opacity-40"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "p-1.5 rounded-lg border",
                          isCurrent
                            ? "bg-primary text-white border-primary/50 shadow-glow-blue"
                            : isComplete
                            ? "bg-success/15 text-success border-success/30"
                            : "bg-card text-text-muted border-border"
                        )}
                      >
                        {isComplete ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="font-bold block text-xs">{stg.title}</span>
                        <span className="text-[10px] text-text-muted">{stg.desc}</span>
                      </div>
                    </div>

                    {isCurrent && (
                      <span className="font-mono text-[10px] text-primary font-bold animate-pulse">ACTIVE</span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
