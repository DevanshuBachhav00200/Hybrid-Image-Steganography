"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Shield,
  Home,
  Layers,
  Cpu,
  BarChart2,
  BookOpen,
  Info,
  Mail,
  Sun,
  Moon,
  Github,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useTheme } from "@/lib/theme-context";

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const navLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Dashboard", href: "/dashboard", icon: Cpu },
    { label: "Encode Stego", href: "/encode", icon: Layers, badge: "Phase 3" },
    { label: "Decode Stego", href: "/decode", icon: Shield, badge: "Phase 4" },
    { label: "Comparison", href: "/compare", icon: BarChart2, badge: "Phase 5" },
    { label: "Design System", href: "/design-system", icon: BookOpen },
    { label: "Documentation", href: "/documentation", icon: Info },
    { label: "About System", href: "/about", icon: Shield },
    { label: "Contact", href: "/contact", icon: Mail },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Slide-over Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="relative z-10 w-4/5 max-w-sm h-full bg-background-secondary border-l border-border flex flex-col justify-between p-6 shadow-2xl overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-primary/15 border border-primary/30 text-primary">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-text-primary tracking-tight">STEGO-LAB</span>
                  <span className="text-[10px] font-mono text-text-muted">Cyber Research System</span>
                </div>
              </Link>
              <button
                onClick={onClose}
                aria-label="Close Mobile Navigation"
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-card-hover border border-border transition-colors focus-ring"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Links */}
            <div className="py-6 space-y-1.5 flex-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 select-none",
                      isActive
                        ? "bg-primary text-white font-semibold shadow-md shadow-primary/20"
                        : "text-text-secondary hover:text-text-primary hover:bg-card-hover"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{link.label}</span>
                    </div>
                    {link.badge && (
                      <Badge variant={isActive ? "outline" : "muted"} size="sm">
                        {link.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Footer Actions */}
            <div className="pt-4 border-t border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted font-mono">Theme Mode</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleTheme}
                  leftIcon={theme === "dark" ? <Sun className="w-4 h-4 text-warning" /> : <Moon className="w-4 h-4 text-primary" />}
                >
                  {theme === "dark" ? "Light" : "Dark"}
                </Button>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-text-muted pt-2 border-t border-border/50">
                <span>Status:</span>
                <Badge variant="success" dot size="sm">
                  System Ready
                </Badge>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
