"use client";

import React from "react";
import Link from "next/link";
import { PageTemplate } from "@/components/layout/PageTemplate";
import { ContentWrapper } from "@/components/layout/ContentWrapper";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Mail, Github, FileText, ArrowLeft } from "lucide-react";

export default function ContactPage() {
  return (
    <PageTemplate
      title="Contact & Research Team Support"
      description="Connect with the research and architecture team for project inquiries, technical specifications, and repository contributions."
      badge={<Badge variant="accent" size="md">Support Ready</Badge>}
      icon={<Mail className="w-8 h-8 text-primary" />}
      heroActions={
        <Link href="/">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Home
          </Button>
        </Link>
      }
    >
      <ContentWrapper variant="glass" padding="lg" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-text-primary">Research Contacts</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              For questions regarding the Hybrid Steganography System architecture, reach out via official project channels.
            </p>
            <div className="p-4 bg-background-secondary rounded-xl border border-border space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span className="font-mono text-text-primary">research@stegocYber.org</span>
              </div>
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4 text-secondary" />
                <span className="font-mono text-text-primary">github.com/Hybrid-Steganography</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-text-primary">Repository Resources</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Explore system documentation or inspect the Phase 2A design tokens showcase.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/documentation">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2" leftIcon={<FileText className="w-4 h-4" />}>
                  System Documentation
                </Button>
              </Link>
              <Link href="/design-system">
                <Button variant="primary" size="sm" className="w-full justify-start gap-2" leftIcon={<Github className="w-4 h-4" />}>
                  Design System Catalog
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-2 text-center border-t border-border/50">
          <Badge variant="muted" size="md">Route: /contact</Badge>
        </div>
      </ContentWrapper>
    </PageTemplate>
  );
}
