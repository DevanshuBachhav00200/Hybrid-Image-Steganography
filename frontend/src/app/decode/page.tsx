"use client";

import React from "react";
import Link from "next/link";
import { PageTemplate } from "@/components/layout/PageTemplate";
import { ContentWrapper } from "@/components/layout/ContentWrapper";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Shield, Key, ArrowLeft, ArrowRight } from "lucide-react";

export default function DecodePage() {
  return (
    <PageTemplate
      title="Decode & Extraction Module"
      description="Extract hidden payload arrays from carrier stego images, reverse Morse code modulation, and decrypt AES-256 ciphertexts."
      badge={<Badge variant="accent" size="md">Phase 4 Reserved</Badge>}
      icon={<Shield className="w-8 h-8 text-primary" />}
      heroActions={
        <div className="flex items-center gap-3">
          <Link href="/encode">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              To Encode
            </Button>
          </Link>
          <Link href="/compare">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              To Compare
            </Button>
          </Link>
        </div>
      }
    >
      <ContentWrapper variant="glass" padding="lg" className="text-center space-y-4 py-12">
        <div className="w-16 h-16 rounded-full bg-secondary/10 border border-secondary/30 text-secondary flex items-center justify-center mx-auto shadow-glow-purple">
          <Key className="w-8 h-8" />
        </div>
        <div className="space-y-1 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-text-primary">Decode Workflow Shell Active</h2>
          <p className="text-xs text-text-muted">
            This page represents the application route shell for Phase 4. Extraction algorithms and decryption keys will be wired in upcoming phases.
          </p>
        </div>
        <div className="pt-2">
          <Badge variant="muted" size="md">Route: /decode</Badge>
        </div>
      </ContentWrapper>
    </PageTemplate>
  );
}
