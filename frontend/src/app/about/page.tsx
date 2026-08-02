"use client";

import React from "react";
import Link from "next/link";
import { PageTemplate } from "@/components/layout/PageTemplate";
import { ContentWrapper } from "@/components/layout/ContentWrapper";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Info, Shield, Layers, ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <PageTemplate
      title="About the Steganography Project"
      description="Hybrid Image Steganography System Using Morse Code Encoding and Multi-Domain Data Embedding Techniques."
      badge={<Badge variant="primary" size="md">Research Architecture</Badge>}
      icon={<Info className="w-8 h-8 text-primary" />}
      heroActions={
        <Link href="/">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Home
          </Button>
        </Link>
      }
    >
      <ContentWrapper variant="glass" padding="lg" className="space-y-4">
        <h3 className="text-base font-bold text-text-primary">Project Mission & Objectives</h3>
        <p className="text-xs text-text-secondary leading-relaxed">
          The goal of this research project is to pioneer a multi-layer secure data hiding framework. By combining Morse Code modulation with AES-256 GCM encryption and multi-domain steganography (LSB, DCT, DWT), the system achieves high payload capacity, zero perceptual distortion, and strong resilience against steganalysis.
        </p>

        <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-background-secondary rounded-lg border border-border">
            <span className="font-semibold text-text-primary block mb-1">Frontend Stack</span>
            <span className="text-text-muted font-mono">Next.js 15 • React 19 • Tailwind CSS • Framer Motion</span>
          </div>
          <div className="p-3 bg-background-secondary rounded-lg border border-border">
            <span className="font-semibold text-text-primary block mb-1">Design System</span>
            <span className="text-text-muted font-mono">Phase 2A Design Tokens • Dark Professional Theme</span>
          </div>
          <div className="p-3 bg-background-secondary rounded-lg border border-border">
            <span className="font-semibold text-text-primary block mb-1">Application Shell</span>
            <span className="text-text-muted font-mono">Phase 2B App Router Shell & Mobile Drawer Navigation</span>
          </div>
        </div>

        <div className="pt-2 text-center">
          <Badge variant="muted" size="md">Route: /about</Badge>
        </div>
      </ContentWrapper>
    </PageTemplate>
  );
}
