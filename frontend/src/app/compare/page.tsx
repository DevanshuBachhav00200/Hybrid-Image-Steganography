"use client";

import React from "react";
import Link from "next/link";
import { PageTemplate } from "@/components/layout/PageTemplate";
import { ContentWrapper } from "@/components/layout/ContentWrapper";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BarChart2, Activity, ArrowLeft } from "lucide-react";

export default function ComparePage() {
  return (
    <PageTemplate
      title="Algorithm Comparison & Performance Metrics"
      description="Benchmark Peak Signal-to-Noise Ratio (PSNR), Structural Similarity Index (SSIM), Mean Squared Error (MSE), and execution latency across LSB, DCT, and DWT algorithms."
      badge={<Badge variant="accent" size="md">Phase 5 Reserved</Badge>}
      icon={<BarChart2 className="w-8 h-8 text-primary" />}
      heroActions={
        <Link href="/dashboard">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Dashboard
          </Button>
        </Link>
      }
    >
      <ContentWrapper variant="glass" padding="lg" className="text-center space-y-4 py-12">
        <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/30 text-accent flex items-center justify-center mx-auto shadow-glow-cyan">
          <Activity className="w-8 h-8" />
        </div>
        <div className="space-y-1 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-text-primary">Comparison Metrics Shell Active</h2>
          <p className="text-xs text-text-muted">
            This page represents the application route shell for Phase 5. Recharts analytics and algorithm benchmark comparisons will be integrated in future phases.
          </p>
        </div>
        <div className="pt-2">
          <Badge variant="muted" size="md">Route: /compare</Badge>
        </div>
      </ContentWrapper>
    </PageTemplate>
  );
}
