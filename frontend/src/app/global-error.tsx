"use client";

import React from "react";
import { ShieldAlert, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="flex flex-col min-h-screen items-center justify-center bg-background text-text-primary p-6">
        <div className="glass-card p-8 border border-danger/40 rounded-2xl max-w-md w-full text-center space-y-4 shadow-glow-danger">
          <div className="p-3.5 rounded-2xl bg-danger/15 text-danger border border-danger/30 w-fit mx-auto shadow-md">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-lg font-bold text-text-primary">Critical Root System Error</h1>
            <p className="text-xs text-text-muted leading-relaxed">
              A critical application error occurred. Click below to reload the root session.
            </p>
          </div>

          <Button variant="danger" size="md" onClick={() => reset()} leftIcon={<RefreshCw className="w-4 h-4" />}>
            Reset Application
          </Button>
        </div>
      </body>
    </html>
  );
}
