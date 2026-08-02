"use client";

import React from "react";
import Link from "next/link";
import { PageTemplate } from "@/components/layout/PageTemplate";
import { ContentWrapper } from "@/components/layout/ContentWrapper";
import { GridContainer } from "@/components/layout/GridContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BookOpen, FileText, Code2, Shield, ArrowLeft } from "lucide-react";

export default function DocumentationPage() {
  return (
    <PageTemplate
      title="System Architecture & Documentation"
      description="Technical documentation guide covering Morse Code modulation, AES-256 GCM encryption, and Spatial/Frequency Domain embedding algorithms."
      badge={<Badge variant="accent" size="md">Docs v2.0</Badge>}
      icon={<BookOpen className="w-8 h-8 text-primary" />}
      heroActions={
        <Link href="/design-system">
          <Button variant="outline" size="sm" rightIcon={<Code2 className="w-4 h-4" />}>
            Design Tokens Catalog
          </Button>
        </Link>
      }
    >
      <GridContainer cols={3} gap="md">
        <ContentWrapper variant="glass" padding="md" className="space-y-2">
          <div className="p-2 rounded bg-primary/10 text-primary w-fit">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-text-primary">1. Morse Modulation Protocol</h3>
          <p className="text-xs text-text-muted">
            Details on standard dot/dash symbol conversion to binary array representations.
          </p>
        </ContentWrapper>

        <ContentWrapper variant="glass" padding="md" className="space-y-2">
          <div className="p-2 rounded bg-secondary/10 text-secondary w-fit">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-text-primary">2. AES-256 Pre-Encryption</h3>
          <p className="text-xs text-text-muted">
            Cryptographic key derivation and Galois/Counter Mode authenticated ciphertext generation.
          </p>
        </ContentWrapper>

        <ContentWrapper variant="glass" padding="md" className="space-y-2">
          <div className="p-2 rounded bg-accent/10 text-accent w-fit">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-text-primary">3. Multi-Domain Algorithms</h3>
          <p className="text-xs text-text-muted">
            Mathematical background for LSB spatial bit replacement, DCT frequency matrices, and DWT wavelets.
          </p>
        </ContentWrapper>
      </GridContainer>

      <ContentWrapper variant="solid" padding="md" className="text-center">
        <span className="text-xs text-text-muted font-mono">Route: /documentation • Built with PageTemplate</span>
      </ContentWrapper>
    </PageTemplate>
  );
}
