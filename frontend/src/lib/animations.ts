import { Variants, Transition, Easing } from "framer-motion";

// Standard Easing & Spring Physics Curves
export class EaseCurves {
  static easeOutExpo: Easing = [0.16, 1, 0.3, 1];
  static easeInOutCubic: Easing = [0.65, 0, 0.35, 1];
  static springGentle: Transition = { type: "spring", stiffness: 260, damping: 25 };
  static springBouncy: Transition = { type: "spring", stiffness: 400, damping: 20 };
  static springSnappy: Transition = { type: "spring", stiffness: 500, damping: 30 };
}

// ----------------------------------------------------
// 1. PAGE ROUTE TRANSITION VARIANTS
// ----------------------------------------------------
export const pageFadeVariants: Variants = {
  initial: {
    opacity: 0,
    y: 8,
    scale: 0.995,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: EaseCurves.easeOutExpo,
      when: "beforeChildren",
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.995,
    transition: {
      duration: 0.2,
      ease: EaseCurves.easeInOutCubic,
    },
  },
};

export const pageSlideVariants: Variants = {
  initial: {
    opacity: 0,
    x: 16,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      ease: EaseCurves.easeOutExpo,
    },
  },
  exit: {
    opacity: 0,
    x: -16,
    transition: {
      duration: 0.2,
      ease: EaseCurves.easeInOutCubic,
    },
  },
};

// ----------------------------------------------------
// 2. STAGGERED ENTRANCE CONTAINER VARIANTS
// ----------------------------------------------------
export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

export const staggerItemVariants: Variants = {
  initial: {
    opacity: 0,
    y: 16,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: EaseCurves.easeOutExpo,
    },
  },
};

// ----------------------------------------------------
// 3. SCROLL REVEAL VARIANTS
// ----------------------------------------------------
export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EaseCurves.easeOutExpo },
  },
};

export const fadeInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: EaseCurves.easeOutExpo },
  },
};

export const fadeInRightVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: EaseCurves.easeOutExpo },
  },
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: EaseCurves.easeOutExpo },
  },
};

// ----------------------------------------------------
// 4. MICRO-INTERACTION VARIANTS (CARDS, BUTTONS, MODALS)
// ----------------------------------------------------
export const cardHoverVariants: Variants = {
  rest: { y: 0, scale: 1, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
  hover: {
    y: -4,
    scale: 1.01,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 0 15px rgba(59, 130, 246, 0.15)",
    transition: EaseCurves.springGentle,
  },
  tap: { scale: 0.98, transition: EaseCurves.springSnappy },
};

export const buttonHoverVariants: Variants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -1.5,
    transition: EaseCurves.springSnappy,
  },
  tap: {
    scale: 0.96,
    y: 0,
    transition: EaseCurves.springSnappy,
  },
};

export const dragZonePulseVariants: Variants = {
  rest: { borderColor: "rgba(59, 130, 246, 0.3)", scale: 1 },
  hover: {
    borderColor: "rgba(59, 130, 246, 0.8)",
    scale: 1.01,
    transition: { duration: 0.2 },
  },
  drag: {
    borderColor: "rgba(168, 85, 247, 0.9)",
    scale: 1.02,
    boxShadow: "0 0 25px rgba(168, 85, 247, 0.3)",
    transition: { duration: 0.15 },
  },
};

// ----------------------------------------------------
// 5. MODAL OVERLAY VARIANTS
// ----------------------------------------------------
export const modalBackdropVariants: Variants = {
  closed: { opacity: 0, backdropFilter: "blur(0px)" },
  open: { opacity: 1, backdropFilter: "blur(8px)", transition: { duration: 0.25 } },
};

export const modalContentVariants: Variants = {
  closed: { opacity: 0, scale: 0.92, y: 16 },
  open: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: EaseCurves.springGentle,
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: 12,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

// ----------------------------------------------------
// 6. SHIMMER & SKELETON VARIANTS
// ----------------------------------------------------
export const shimmerVariants: Variants = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      repeat: Infinity,
      duration: 1.8,
      ease: "linear",
    },
  },
};

export const pulseGlowVariants: Variants = {
  animate: {
    opacity: [0.4, 0.8, 0.4],
    scale: [0.98, 1.02, 0.98],
    transition: {
      repeat: Infinity,
      duration: 2.5,
      ease: "easeInOut",
    },
  },
};
