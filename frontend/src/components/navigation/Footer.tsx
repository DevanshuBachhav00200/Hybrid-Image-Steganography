"use client";

import React from "react";
import Link from "next/link";
import { Shield, Github, FileText, Cpu, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={cn(
        "w-full bg-background-secondary border-t border-border mt-auto py-8 px-6 text-xs text-text-muted",
        className
      )}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand Column */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-primary/10 border border-primary/30 text-primary">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-bold text-text-primary text-sm">Hybrid Steganography System</span>
          </div>
          <p className="text-text-muted text-[11px] leading-relaxed">
            Multi-Domain Spatial & Frequency Embedding Framework utilizing Morse Code Modulation and AES Encryption.
          </p>
        </div>

        {/* Modules Column */}
        <div className="space-y-2">
          <h5 className="text-xs font-semibold text-text-primary uppercase tracking-wider">Embedding Domains</h5>
          <ul className="space-y-1.5 text-text-secondary">
            <li><Link href="/encode" className="hover:text-primary transition-colors">LSB Spatial Domain</Link></li>
            <li><Link href="/encode" className="hover:text-primary transition-colors">DCT Frequency Domain</Link></li>
            <li><Link href="/encode" className="hover:text-primary transition-colors">DWT Wavelet Domain</Link></li>
          </ul>
        </div>

        {/* System Specs Column */}
        <div className="space-y-2">
          <h5 className="text-xs font-semibold text-text-primary uppercase tracking-wider">Architecture</h5>
          <ul className="space-y-1.5 text-text-secondary font-mono">
            <li>Next.js 15 & React 19</li>
            <li>Tailwind CSS Design Tokens</li>
            <li>Framer Motion Presets</li>
          </ul>
        </div>

        {/* Status Column */}
        <div className="space-y-2">
          <h5 className="text-xs font-semibold text-text-primary uppercase tracking-wider">Security Protocol</h5>
          <div className="p-3 bg-card border border-border rounded-lg space-y-2">
            <div className="flex items-center gap-1.5 text-success">
              <Lock className="w-3.5 h-3.5" />
              <span className="font-mono text-[11px] font-semibold">AES-256 GCM Ready</span>
            </div>
            <p className="text-[10px] text-text-muted">Zero plain-text residual footprint in carrier media.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-text-muted font-mono text-[11px]">
        <div>© 2026 Hybrid Steganography Research Group. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <Link href="/design-system" className="hover:text-primary transition-colors">Design System Showcase</Link>
          <span className="text-border">|</span>
          <span className="text-primary">Phase 2A Design Tokens Active</span>
        </div>
      </div>
    </footer>
  );
};
