/**
 * Hybrid Image Steganography System - Shadow & Glow Tokens
 */

export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.5)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.5)",
  
  // Custom Cyber Ambient Glows
  glowBlue: "0 0 25px -5px rgba(59, 130, 246, 0.4)",
  glowPurple: "0 0 25px -5px rgba(139, 92, 246, 0.4)",
  glowCyan: "0 0 25px -5px rgba(6, 182, 212, 0.4)",
  glowEmerald: "0 0 25px -5px rgba(16, 185, 129, 0.4)",
  glowDanger: "0 0 25px -5px rgba(239, 68, 68, 0.4)",
} as const;

export type ShadowTokens = typeof shadows;
