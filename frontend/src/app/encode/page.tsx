"use client";

import React from "react";
import Link from "next/link";
import { PageTemplate } from "@/components/layout/PageTemplate";
import { ContentWrapper } from "@/components/layout/ContentWrapper";
import { GridContainer } from "@/components/layout/GridContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Layers, Lock, FileCode, ArrowLeft, ArrowRight } from "lucide-react";

export default function EncodePage() {
  return (
    <PageTemplate
      title="Encode Steganography Module"
      description="Morse Modulation, AES-256 Pre-Encryption, and Multi-Domain Carrier Embedding (LSB, DCT, DWT)."
      badge={<Badge variant="accent" size="md">Phase 3 Reserved</Badge>}
      icon={<Layers className="w-8 h-8 text-primary" />}
      heroActions={
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
          <Link href="/decode">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Go to Decode
            </Button>
          </Link>
        </div>
      }
    >
      <ContentWrapper variant="glass" padding="lg" className="text-center space-y-4 py-12">
        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 text-primary flex items-center justify-center mx-auto shadow-glow-blue">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-1 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-text-primary">Encode Workflow Shell Active</h2>
          <p className="text-xs text-text-muted">
            This page represents the application route shell for Phase 3. Steganographic encoding algorithms (Morse, AES, LSB, DCT, DWT) will be connected in future phases.
          </p>
        </div>
        <div className="pt-2">
          <Badge variant="muted" size="md">Route: /encode</Badge>
        </div>
      </ContentWrapper>
    </PageTemplate>
  );
}
