"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 rounded-lg bg-primary/15 border border-primary/30 text-primary group-hover:scale-105 transition-transform duration-200 shadow-glow-blue">
            <Shield className="w-5 h-5" />
          </div>
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

        {/* Desktop Nav Links */}
        <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-1 bg-card/50 p-1 rounded-xl border border-border/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 select-none",
                  isActive
                    ? "bg-primary text-white shadow-sm font-semibold"
                    : "text-text-secondary hover:text-text-primary hover:bg-card-hover"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Actions & Mobile Trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="hidden sm:inline-flex"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-warning" /> : <Moon className="w-4 h-4 text-primary" />}
          </Button>

          <Badge variant="success" dot size="md" glow className="hidden sm:inline-flex">
            System Ready
          </Badge>

          {/* Hamburger Menu Trigger for Mobile / Tablet */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Mobile Menu"
            className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-card-hover border border-border transition-colors focus-ring"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};
