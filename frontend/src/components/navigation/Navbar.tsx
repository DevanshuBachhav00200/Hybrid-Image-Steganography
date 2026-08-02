"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
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
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useTheme } from "@/lib/theme-context";
import { MobileMenu } from "./MobileMenu";
import { buttonHoverVariants } from "@/lib/animations";

export interface NavbarProps {
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Encode", href: "/encode", icon: Layers },
    { label: "Decode", href: "/decode", icon: Shield },
    { label: "Compare", href: "/compare", icon: BarChart2 },
    { label: "Dashboard", href: "/dashboard", icon: Cpu },
    { label: "Docs", href: "/documentation", icon: BookOpen },
    { label: "About", href: "/about", icon: Info },
    { label: "Contact", href: "/contact", icon: Mail },
  ];

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full glass-nav px-4 sm:px-6 py-3 flex items-center justify-between border-b border-border shadow-md select-none",
          className
        )}
      >
        {/* Brand Logo with Motion Scale */}
        <Link href="/" aria-label="StegoCyber Home Page" className="flex items-center gap-3 group focus-ring rounded-lg">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-primary/15 border border-primary/30 text-primary shadow-glow-blue"
          >
            <Shield className="w-5 h-5" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-text-primary flex items-center gap-2">
              STEGO<span className="text-primary font-mono font-normal">CYBER</span>
              <Badge variant="accent" size="sm">v2.0</Badge>
            </span>
            <span className="text-[10px] text-text-muted font-mono hidden sm:inline-block">
              Hybrid Morse Multi-Domain
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links with Shared Layout Indicator */}
        <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-1 bg-card/50 p-1 rounded-xl border border-border/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 select-none focus-ring",
                  isActive
                    ? "text-white font-semibold"
                    : "text-text-secondary hover:text-text-primary hover:bg-card-hover"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-navbar-indicator"
                    className="absolute inset-0 bg-primary rounded-lg shadow-glow-blue -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Actions & Mobile Trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.div variants={buttonHoverVariants} initial="rest" whileHover="hover" whileTap="tap">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="hidden sm:inline-flex touch-target"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-warning" /> : <Moon className="w-4 h-4 text-primary" />}
            </Button>
          </motion.div>

          <Badge variant="success" dot size="md" glow className="hidden sm:inline-flex">
            System Ready
          </Badge>

          {/* Hamburger Menu Trigger for Mobile / Tablet */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Mobile Navigation Menu"
            aria-expanded={mobileMenuOpen}
            className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-card-hover border border-border transition-colors focus-ring touch-target flex items-center justify-center"
          >
            <Menu className="w-5 h-5" />
          </motion.button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};
