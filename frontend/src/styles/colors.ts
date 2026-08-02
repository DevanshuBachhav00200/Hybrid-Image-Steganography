/**
 * Hybrid Image Steganography System - Color Design Tokens
 * Complete enterprise cyber/research theme palette definitions.
 */

export const colors = {
  // Base Surface Colors
  background: {
    DEFAULT: "#030712", // Main app background (Slate 950 obsidian dark)
    secondary: "#111827", // Panel / Sidebar / Header background (Slate 900)
    tertiary: "#1F2937", // Elevated container background (Slate 800)
  },

  card: {
    DEFAULT: "#1F2937", // Card fill
    hover: "#263346", // Card hover fill
    glass: "rgba(31, 41, 55, 0.65)", // Glassmorphism backdrop fill
  },

  border: {
    DEFAULT: "#374151", // Standard subtle border (Slate 700)
    hover: "#4B5563", // Interactive border hover (Slate 600)
    active: "#3B82F6", // Active state border
  },

  // Primary Brand Colors
  primary: {
    DEFAULT: "#3B82F6", // Electric Blue
    hover: "#2563EB",
    light: "#60A5FA",
    dark: "#1D4ED8",
    glow: "rgba(59, 130, 246, 0.4)",
  },

  // Secondary Accent
  secondary: {
    DEFAULT: "#8B5CF6", // Deep Violet
    hover: "#7C3AED",
    light: "#A78BFA",
    dark: "#6D28D9",
    glow: "rgba(139, 92, 246, 0.4)",
  },

  // Cyber Accent
  accent: {
    DEFAULT: "#06B6D4", // Cyber Cyan
    hover: "#0891B2",
    light: "#38BDF8",
    dark: "#0E7490",
    glow: "rgba(6, 182, 212, 0.4)",
  },

  // Status Indicators
  status: {
    success: {
      DEFAULT: "#10B981", // Emerald Green
      hover: "#059669",
      bg: "rgba(16, 185, 129, 0.1)",
      border: "rgba(16, 185, 129, 0.3)",
      glow: "rgba(16, 185, 129, 0.4)",
    },
    warning: {
      DEFAULT: "#F59E0B", // Amber Gold
      hover: "#D97706",
      bg: "rgba(245, 158, 11, 0.1)",
      border: "rgba(245, 158, 11, 0.3)",
      glow: "rgba(245, 158, 11, 0.4)",
    },
    danger: {
      DEFAULT: "#EF4444", // Crimson Red
      hover: "#DC2626",
      bg: "rgba(239, 68, 68, 0.1)",
      border: "rgba(239, 68, 68, 0.3)",
      glow: "rgba(239, 68, 68, 0.4)",
    },
    info: {
      DEFAULT: "#3B82F6", // Blue info
      hover: "#2563EB",
      bg: "rgba(59, 130, 246, 0.1)",
      border: "rgba(59, 130, 246, 0.3)",
      glow: "rgba(59, 130, 246, 0.4)",
    },
  },

  // Typography Text Palette
  text: {
    primary: "#F9FAFB", // High-contrast crisp white
    secondary: "#D1D5DB", // Medium-contrast light gray
    muted: "#9CA3AF", // Muted gray description text
    disabled: "#6B7280", // Disabled state text
  },
} as const;

export type ColorTokens = typeof colors;
