"use client";

import React from "react";
import Link from "next/link";
import { PageTemplate } from "@/components/layout/PageTemplate";
import { ContentWrapper } from "@/components/layout/ContentWrapper";
import { GridContainer } from "@/components/layout/GridContainer";
import { MetricCard } from "@/components/cards/MetricCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Cpu, Activity, ShieldCheck, Layers, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  return (
    <PageTemplate
      title="Research & System Overview Dashboard"
      description="Live operational telemetry, system node status, and steganography pipeline performance metrics."
      badge={<Badge variant="success" dot size="md">Telemetry Ready</Badge>}
      icon={<Cpu className="w-8 h-8 text-primary" />}
      heroActions={
        <div className="flex items-center gap-3">
          <Link href="/encode">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Encode Session
            </Button>
          </Link>
          <Link href="/compare">
            <Button variant="outline" size="sm">
              Metrics
            </Button>
          </Link>
        </div>
      }
    >
      <GridContainer cols={3} gap="md">
        <MetricCard title="Carrier Node Capacity" value="2.4" unit="MB" change={{ value: "Optimal", positive: true }} icon={<Layers className="w-5 h-5" />} />
        <MetricCard title="Stego Integrity Score" value="99.8" unit="%" change={{ value: "+0.2%", positive: true }} icon={<ShieldCheck className="w-5 h-5 text-success" />} />
        <MetricCard title="System Processing Speed" value="142" unit="ms" change={{ value: "Fast", positive: true }} icon={<Cpu className="w-5 h-5 text-accent" />} />
      </GridContainer>

      <ContentWrapper variant="glass" padding="lg" className="text-center space-y-4 py-8">
        <div className="space-y-1 max-w-md mx-auto">
          <h3 className="text-lg font-bold text-text-primary">Research Dashboard Shell Active</h3>
          <p className="text-xs text-text-muted">
            The application navigation shell is running Phase 2B layout standards. Backend FastAPI endpoints will feed real-time charts in later phases.
          </p>
        </div>
        <div className="pt-1">
          <Badge variant="muted" size="md">Route: /dashboard</Badge>
        </div>
      </ContentWrapper>
    </PageTemplate>
  );
}
