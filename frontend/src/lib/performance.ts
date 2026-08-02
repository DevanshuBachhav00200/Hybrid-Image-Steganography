/**
 * Core Web Vitals & Performance Monitoring Utility
 * Hybrid Image Steganography System
 */

export interface Metric {
  id: string;
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
}

/**
 * Report Web Vitals to analytics or console
 */
export function reportWebVitals(metric: Metric): void {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: Math.round(metric.value * 100) / 100,
      rating: metric.rating,
      id: metric.id,
    });
  }
}

/**
 * Measure execution latency of a function block
 */
export function measureLatency<T>(label: string, fn: () => T): T {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  if (process.env.NODE_ENV === "development") {
    console.log(`[Performance] ${label} took ${duration.toFixed(2)} ms`);
  }
  return result;
}

/**
 * Get current navigation timing metrics
 */
export function getNavigationMetrics() {
  if (typeof window === "undefined" || !window.performance) return null;

  const timing = window.performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
  if (!timing) return null;

  return {
    dnsTime: timing.domainLookupEnd - timing.domainLookupStart,
    connectTime: timing.connectEnd - timing.connectStart,
    ttfb: timing.responseStart - timing.requestStart,
    domInteractive: timing.domInteractive - timing.startTime,
    domComplete: timing.domComplete - timing.startTime,
    loadEvent: timing.loadEventEnd - timing.startTime,
  };
}
