"use client";

import React, { useEffect } from "react";
import { ShieldAlert, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Segment Error Boundary Caught Error:", error);
  }, [error]);

  return (
    <div className="min-h-[450px] w-full flex items-center justify-center p-6">
      <div className="glass-card p-8 border border-danger/40 rounded-2xl max-w-md w-full text-center space-y-4 shadow-glow-danger select-none">
        <div className="p-3.5 rounded-2xl bg-danger/15 text-danger border border-danger/30 w-fit mx-auto shadow-md">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-lg font-bold text-text-primary">Segment Processing Error</h2>
          <p className="text-xs text-text-muted leading-relaxed">
            An unexpected error occurred while loading this workspace segment.
          </p>
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <Button variant="danger" size="sm" onClick={() => reset()} leftIcon={<RefreshCw className="w-4 h-4" />}>
            Try Again
          </Button>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = "/")} leftIcon={<Home className="w-4 h-4" />}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
