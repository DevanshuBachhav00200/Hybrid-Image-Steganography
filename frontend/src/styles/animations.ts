import { Variants, Transition } from "framer-motion";

/**
 * Hybrid Image Steganography System - Animation Presets (Framer Motion)
 */

export const transitions: Record<string, Transition> = {
  default: { type: "spring", stiffness: 300, damping: 30 },
  smooth: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] },
  bounce: { type: "spring", stiffness: 400, damping: 20 },
  slow: { duration: 0.5, ease: "easeInOut" },
};

export const fadeInVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: transitions.smooth },
  exit: { opacity: 0, transition: transitions.smooth },
};

export const slideUpVariants: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: transitions.default },
  exit: { opacity: 0, y: -16, transition: transitions.smooth },
};

export const slideDownVariants: Variants = {
  initial: { opacity: 0, y: -16 },
  animate: { opacity: 1, y: 0, transition: transitions.default },
  exit: { opacity: 0, y: 16, transition: transitions.smooth },
};

export const scaleVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: transitions.default },
  exit: { opacity: 0, scale: 0.95, transition: transitions.smooth },
};

export const modalVariants: Variants = {
  initial: { opacity: 0, scale: 0.92, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0, transition: transitions.default },
  exit: { opacity: 0, scale: 0.95, y: 8, transition: transitions.smooth },
};

export const backdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const staggerItemVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: transitions.default },
};

export const hoverScaleVariants = {
  whileHover: { scale: 1.02, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98 },
};

export const buttonTactileVariants = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
};

export const uploadPulseVariants: Variants = {
  idle: { scale: 1 },
  hovering: { scale: 1.02, transition: { repeat: Infinity, repeatType: "reverse", duration: 0.8 } },
};
