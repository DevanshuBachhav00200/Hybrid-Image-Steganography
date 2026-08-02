"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  content?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  activeTabId?: string;
  onChange?: (tabId: string) => void;
  className?: string;
  variant?: "pill" | "line" | "card";
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTabId,
  activeTabId,
  onChange,
  className,
  variant = "pill",
}) => {
  const [selectedId, setSelectedId] = useState(activeTabId || defaultTabId || tabs[0]?.id);

  const currentTabId = activeTabId !== undefined ? activeTabId : selectedId;

  const handleSelect = (id: string) => {
    if (activeTabId === undefined) {
      setSelectedId(id);
    }
    if (onChange) onChange(id);
  };

  const activeTabContent = tabs.find((t) => t.id === currentTabId)?.content;

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "flex items-center gap-1 overflow-x-auto p-1 border border-border/70 rounded-xl select-none",
          variant === "pill" && "bg-background-secondary/80",
          variant === "card" && "bg-card/90",
          variant === "line" && "bg-transparent border-none border-b border-border rounded-none p-0 gap-4"
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === currentTabId;
          return (
            <button
              key={tab.id}
              disabled={tab.disabled}
              onClick={() => handleSelect(tab.id)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-colors duration-200 focus-ring cursor-pointer",
                variant === "line" ? "pb-3 rounded-none" : "rounded-lg",
                isActive ? "text-text-primary" : "text-text-muted hover:text-text-secondary",
                tab.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {isActive && variant === "pill" && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-primary rounded-lg shadow-sm"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}

              {isActive && variant === "line" && (
                <motion.div
                  layoutId="activeTabLine"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}

              <span className={cn("relative z-10 flex items-center gap-2", isActive && variant === "pill" && "text-white")}>
                {tab.icon}
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {activeTabContent && <div className="animate-fadeIn">{activeTabContent}</div>}
    </div>
  );
};
