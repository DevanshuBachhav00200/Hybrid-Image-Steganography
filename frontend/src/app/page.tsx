"use client";

import React from "react";
import Link from "next/link";
import { PageTemplate } from "@/components/layout/PageTemplate";
import { GridContainer } from "@/components/layout/GridContainer";
import { ContentWrapper } from "@/components/layout/ContentWrapper";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Shield,
  Layers,
  Cpu,
  BarChart2,
  Lock,
  ArrowRight,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  return (
    <PageTemplate
      title="Hybrid Image Steganography System"
      description="Multi-Layer Steganographic Security Platform combining Morse Code Encoding, AES-256 GCM Encryption, and Multi-Domain Data Embedding (LSB, DCT, DWT)."
      badge={<Badge variant="success" dot size="md">Phase 2B Shell Online</Badge>}
      icon={<Shield className="w-8 h-8 text-primary" />}
      heroActions={
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/encode">
            <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Explore Encode Module
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="md">
              View Dashboard
            </Button>
          </Link>
        </div>
      }
    >
      {/* Quick Overview Section */}
      <div className="space-y-4">
        <SectionTitle
          title="System Capabilities & Architecture"
          subtitle="Explore modular steganography techniques across spatial and frequency domains"
        />

        <GridContainer cols={3} gap="md">
          <FeatureCard
            icon={<Layers className="w-6 h-6" />}
            title="Spatial LSB Embedding"
            description="High-capacity Least Significant Bit pixel array insertion with imperceptible spatial modifications."
            tag="Phase 3 Target"
          />
          <FeatureCard
            icon={<Cpu className="w-6 h-6" />}
            title="Frequency DCT Embedding"
            description="Discrete Cosine Transform frequency coefficient modification resistant to lossy JPEG compression."
            tag="Phase 3 Target"
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6" />}
            title="Wavelet DWT Embedding"
            description="Multi-resolution Discrete Wavelet Transform sub-band decomposition yielding structural security."
            tag="Phase 3 Target"
          />
        </GridContainer>
      </div>

      {/* Module Navigation Grid */}
      <ContentWrapper variant="glass" padding="lg" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/70 pb-4">
          <div>
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <Lock className="w-5 h-5 text-accent" />
              Navigation Shell & Module Roadmap
            </h3>
            <p className="text-xs text-text-muted">
              Select an application route below to inspect module layout structures
            </p>
          </div>
          <Badge variant="accent" size="sm">Next.js App Router Active</Badge>
        </div>

        <GridContainer cols={4} gap="sm">
          <Link href="/encode" className="block">
            <ContentWrapper variant="solid" padding="sm" className="hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-text-primary">Encode Stego</span>
                <Badge variant="muted" size="sm">/encode</Badge>
              </div>
              <p className="text-[11px] text-text-muted">Payload Morse & AES embedding workflow UI</p>
            </ContentWrapper>
          </Link>

          <Link href="/decode" className="block">
            <ContentWrapper variant="solid" padding="sm" className="hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-text-primary">Decode Stego</span>
                <Badge variant="muted" size="sm">/decode</Badge>
              </div>
              <p className="text-[11px] text-text-muted">Payload extraction & decryption workflow UI</p>
            </ContentWrapper>
          </Link>

          <Link href="/compare" className="block">
            <ContentWrapper variant="solid" padding="sm" className="hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-text-primary">Comparison</span>
                <Badge variant="muted" size="sm">/compare</Badge>
              </div>
              <p className="text-[11px] text-text-muted">PSNR, SSIM, and MSE benchmarking dashboard</p>
            </ContentWrapper>
          </Link>

          <Link href="/design-system" className="block">
            <ContentWrapper variant="solid" padding="sm" className="hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-text-primary">Design System</span>
                <Badge variant="muted" size="sm">Catalog</Badge>
              </div>
              <p className="text-[11px] text-text-muted">Phase 2A tokens & component library catalog</p>
            </ContentWrapper>
          </Link>
        </GridContainer>
      </ContentWrapper>
    </PageTemplate>
  );
}
