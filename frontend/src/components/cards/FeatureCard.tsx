"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { hoverScaleVariants } from "@/styles/animations";

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  tag?: string;
  onClick?: () => void;
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  tag,
  onClick,
  className,
}) => {
  return (
    <motion.div
      variants={hoverScaleVariants}
      whileHover="whileHover"
      whileTap="whileTap"
      onClick={onClick}
      className={cn(
        "glass-card border border-border hover:border-primary/50 rounded-xl p-6 flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-300 group shadow-md hover:shadow-glow-blue",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl text-primary group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        {tag ? (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-card-hover border border-border text-text-muted">
            {tag}
          </span>
        ) : (
          <ArrowUpRight className="w-5 h-5 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
        )}
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base font-semibold text-text-primary group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-xs text-text-muted leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};
