/**
 * Hybrid Image Steganography System - Typography Design Scale
 */

export const typography = {
  fontFamily: {
    sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
  },

  scale: {
    display: {
      fontSize: "3rem", // 48px
      lineHeight: "1.16",
      fontWeight: "800",
      letterSpacing: "-0.025em",
    },
    hero: {
      fontSize: "2.5rem", // 40px
      lineHeight: "1.2",
      fontWeight: "700",
      letterSpacing: "-0.02em",
    },
    h1: {
      fontSize: "2rem", // 32px
      lineHeight: "1.25",
      fontWeight: "700",
      letterSpacing: "-0.015em",
    },
    h2: {
      fontSize: "1.5rem", // 24px
      lineHeight: "1.33",
      fontWeight: "600",
      letterSpacing: "-0.01em",
    },
    h3: {
      fontSize: "1.25rem", // 20px
      lineHeight: "1.4",
      fontWeight: "600",
      letterSpacing: "0em",
    },
    h4: {
      fontSize: "1.125rem", // 18px
      lineHeight: "1.45",
      fontWeight: "500",
      letterSpacing: "0em",
    },
    subtitle: {
      fontSize: "1rem", // 16px
      lineHeight: "1.5",
      fontWeight: "500",
      letterSpacing: "0em",
    },
    body: {
      fontSize: "0.875rem", // 14px
      lineHeight: "1.57",
      fontWeight: "400",
      letterSpacing: "0em",
    },
    small: {
      fontSize: "0.75rem", // 12px
      lineHeight: "1.5",
      fontWeight: "400",
      letterSpacing: "0.01em",
    },
    caption: {
      fontSize: "0.6875rem", // 11px
      lineHeight: "1.45",
      fontWeight: "300",
      letterSpacing: "0.02em",
    },
    button: {
      fontSize: "0.875rem", // 14px
      lineHeight: "1.25",
      fontWeight: "600",
      letterSpacing: "0.025em",
    },
    mono: {
      fontSize: "0.8125rem", // 13px
      lineHeight: "1.5",
      fontWeight: "400",
      fontFamily: '"JetBrains Mono", monospace',
    },
  },
} as const;

export type TypographyTokens = typeof typography;
