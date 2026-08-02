"use client";

import React from "react";
import Link from "next/link";
import { ServerCrash, Home, ArrowLeft } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <PageContainer size="md" className="flex items-center justify-center min-h-[600px] py-12">
      <div className="glass-card p-10 border border-border rounded-2xl text-center space-y-6 shadow-2xl relative overflow-hidden max-w-lg w-full">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="p-4 rounded-2xl bg-secondary/15 text-secondary border border-secondary/30 w-fit mx-auto shadow-glow-purple">
          <ServerCrash className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-extrabold font-mono text-secondary tracking-tight">404</span>
          <h1 className="text-2xl font-bold text-text-primary">Page Route Not Found</h1>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            The requested steganography workspace page, documentation topic, or route does not exist or has been relocated.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/">
            <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
          <Link href="/encode">
            <Button variant="outline" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Encode Workspace
            </Button>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
