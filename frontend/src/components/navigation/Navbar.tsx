"use client";

import React from "react";
import Link from "next/link";
import { Shield, Layers, Sun, Moon, Cpu, BarChart2, BookOpen, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useTheme } from "@/lib/theme-context";

export interface NavbarProps {
  activePath?: string;
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activePath = "/dashboard", className }) => {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: Cpu },
    { label: "Encode Stego", href: "/encode", icon: Layers },
    { label: "Decode Stego", href: "/decode", icon: Shield },
    { label: "Comparison", href: "/compare", icon: BarChart2 },
    { label: "Design System", href: "/design-system", icon: BookOpen },
    { label: "About System", href: "/about", icon: Info },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full glass-nav px-6 py-3.5 flex items-center justify-between border-b border-border shadow-md",
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
          <span className="text-[10px] text-text-muted font-mono">Hybrid Morse Multi-Domain</span>
        </div>
      </Link>

      {/* Nav Links */}
      <nav className="hidden md:flex items-center gap-1 bg-card/50 p-1 rounded-xl border border-border/60">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePath === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 select-none",
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

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-warning" /> : <Moon className="w-4 h-4 text-primary" />}
        </Button>
        <Badge variant="success" dot size="md" glow>
          System Ready
        </Badge>
      </div>
    </header>
  );
};
