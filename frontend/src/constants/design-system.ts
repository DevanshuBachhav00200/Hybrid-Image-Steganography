/**
 * Hybrid Image Steganography System - Design System Metadata & Guidelines
 */

export const SYSTEM_METADATA = {
  name: "Hybrid Steganography Cyber System",
  version: "2.0.0-DS",
  architecture: "Atomic Enterprise Design Tokens & Framer Motion",
  targetOS: "Cross-Platform Web",
  wcagLevel: "WCAG 2.1 AA Compliant",
};

export const ALGORITHM_METADATA = [
  {
    id: "lsb",
    name: "LSB",
    fullName: "Least Significant Bit",
    domain: "Spatial Domain",
    description: "High payload capacity with imperceptible spatial modifications, optimal for uncompressed raw images.",
    capacityScore: 95,
    robustnessScore: 40,
    speedScore: 98,
  },
  {
    id: "dct",
    name: "DCT",
    fullName: "Discrete Cosine Transform",
    domain: "Frequency Domain",
    description: "Medium-high payload embedding in mid-frequency frequency coefficients, resistant to JPEG compression.",
    capacityScore: 70,
    robustnessScore: 85,
    speedScore: 80,
  },
  {
    id: "dwt",
    name: "DWT",
    fullName: "Discrete Wavelet Transform",
    domain: "Wavelet Domain",
    description: "Multi-resolution frequency decomposition yielding high security, structural integrity, and noise robustness.",
    capacityScore: 65,
    robustnessScore: 95,
    speedScore: 75,
  },
] as const;
