"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught Error Boundary Exception:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] w-full flex items-center justify-center p-6">
          <div className="glass-card p-8 border border-danger/40 rounded-2xl max-w-md w-full text-center space-y-4 shadow-glow-danger">
            <div className="p-3.5 rounded-2xl bg-danger/15 text-danger border border-danger/30 w-fit mx-auto shadow-md">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-text-primary">System Runtime Exception</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                An unexpected UI rendering error occurred. The system isolated the exception to protect state integrity.
              </p>
              {this.state.error && (
                <div className="p-2 bg-card rounded border border-border font-mono text-[10px] text-danger overflow-x-auto max-h-24 text-left">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <Button variant="danger" size="sm" onClick={this.handleReset} leftIcon={<RefreshCw className="w-4 h-4" />}>
                Reload Application
              </Button>
              <Button variant="outline" size="sm" onClick={this.handleGoHome} leftIcon={<Home className="w-4 h-4" />}>
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
