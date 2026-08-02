"use client";

import React from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";
import {
  fadeInUpVariants,
  fadeInLeftVariants,
  fadeInRightVariants,
  scaleInVariants,
  staggerContainerVariants,
} from "@/lib/animations";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "scale" | "stagger";
  delay?: number;
  className?: string;
  viewportMargin?: string;
}

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  className = "",
  viewportMargin = "-40px",
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  let selectedVariants: Variants = fadeInUpVariants;
  if (direction === "left") selectedVariants = fadeInLeftVariants;
  if (direction === "right") selectedVariants = fadeInRightVariants;
  if (direction === "scale") selectedVariants = scaleInVariants;
  if (direction === "stagger") selectedVariants = staggerContainerVariants;

  return (
    <motion.div
      variants={selectedVariants}
      initial={direction === "stagger" ? "initial" : "hidden"}
      whileInView={direction === "stagger" ? "animate" : "visible"}
      viewport={{ once: true, margin: viewportMargin }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
