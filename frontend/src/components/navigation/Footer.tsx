"use client";

import React from "react";
import Link from "next/link";
import { Shield, Github, BookOpen, ExternalLink, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={cn(
        "w-full bg-background-secondary border-t border-border mt-auto py-8 px-4 sm:px-6 text-xs text-text-muted select-none",
        className
      )}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        {/* Brand Column */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-primary/10 border border-primary/30 text-primary">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-bold text-text-primary text-sm">Hybrid Steganography System</span>
          </div>
          <p className="text-text-muted text-[11px] leading-relaxed">
            Multi-Domain Spatial & Frequency Embedding Framework utilizing Morse Code Modulation and AES-256 Encryption.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <Badge variant="accent" size="sm">v2.0.0-PROD</Badge>
            <Badge variant="outline" size="sm">Phase 2B Shell</Badge>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="space-y-2">
          <h5 className="text-xs font-semibold text-text-primary uppercase tracking-wider">Application Routes</h5>
          <ul className="space-y-1.5 text-text-secondary">
            <li><Link href="/" className="hover:text-primary transition-colors">Home Page</Link></li>
            <li><Link href="/encode" className="hover:text-primary transition-colors">Encode Stego</Link></li>
            <li><Link href="/decode" className="hover:text-primary transition-colors">Decode Stego</Link></li>
            <li><Link href="/compare" className="hover:text-primary transition-colors">Comparison & Metrics</Link></li>
            <li><Link href="/dashboard" className="hover:text-primary transition-colors">Research Dashboard</Link></li>
          </ul>
        </div>

        {/* Resources & Docs Column */}
        <div className="space-y-2">
          <h5 className="text-xs font-semibold text-text-primary uppercase tracking-wider">System Resources</h5>
          <ul className="space-y-1.5 text-text-secondary">
            <li><Link href="/documentation" className="hover:text-primary transition-colors">Documentation</Link></li>
            <li><Link href="/design-system" className="hover:text-primary transition-colors">Design System Showcase</Link></li>
            <li><Link href="/about" className="hover:text-primary transition-colors">About Project</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Support</Link></li>
          </ul>
        </div>

        {/* Tech Stack & Action Buttons */}
        <div className="space-y-3">
          <h5 className="text-xs font-semibold text-text-primary uppercase tracking-wider">Technology Stack</h5>
          <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
            <span className="px-2 py-0.5 rounded bg-card border border-border text-text-secondary">Next.js 15</span>
            <span className="px-2 py-0.5 rounded bg-card border border-border text-text-secondary">React 19</span>
            <span className="px-2 py-0.5 rounded bg-card border border-border text-text-secondary">TypeScript</span>
            <span className="px-2 py-0.5 rounded bg-card border border-border text-text-secondary">Tailwind CSS</span>
            <span className="px-2 py-0.5 rounded bg-card border border-border text-text-secondary">Framer Motion</span>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-full">
              <Button variant="outline" size="sm" className="w-full justify-start gap-2" leftIcon={<Github className="w-4 h-4" />}>
                Repository Source
              </Button>
            </Link>
            <Link href="/documentation" className="w-full">
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2" leftIcon={<BookOpen className="w-4 h-4" />}>
                System Architecture Docs
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-text-muted font-mono text-[11px]">
        <div>© 2026 Hybrid Steganography Research Group. Senior UI/UX Frontend Architecture.</div>
        <div className="flex items-center gap-3">
          <Link href="/design-system" className="hover:text-primary transition-colors">Design System</Link>
          <span className="text-border">|</span>
          <span className="text-primary font-semibold">Phase 2B Complete</span>
        </div>
      </div>
    </footer>
  );
};
