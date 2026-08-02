"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Home,
  Cpu,
  Layers,
  BarChart2,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Info,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Dashboard", href: "/dashboard", icon: Cpu },
    { label: "Encode Module", href: "/encode", icon: Layers, badge: "Phase 3" },
    { label: "Decode Module", href: "/decode", icon: Shield, badge: "Phase 4" },
    { label: "Analysis & Metrics", href: "/compare", icon: BarChart2, badge: "Phase 5" },
    { label: "Design System Catalog", href: "/design-system", icon: BookOpen },
    { label: "Documentation", href: "/documentation", icon: Info },
    { label: "About System", href: "/about", icon: Shield },
    { label: "Contact", href: "/contact", icon: Mail },
  ];

  return (
    <aside
      className={cn(
        "hidden md:flex h-screen sticky top-0 z-30 bg-background-secondary border-r border-border flex-col justify-between transition-all duration-300 select-none",
        collapsed ? "w-20" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border/70 flex items-center justify-between">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/15 text-primary border border-primary/30">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-text-primary tracking-tight">STEGO-LAB</span>
              <span className="text-[10px] font-mono text-text-muted">Research Architecture</span>
            </div>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-card-hover border border-border transition-colors mx-auto focus-ring"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <nav aria-label="Sidebar Navigation" className="p-3 space-y-1 overflow-y-auto flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-white font-semibold shadow-md shadow-primary/20"
                  : "text-text-secondary hover:text-text-primary hover:bg-card-hover",
                collapsed && "justify-center px-0"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="truncate flex-1">{item.label}</span>}
              {!collapsed && item.badge && (
                <Badge variant={isActive ? "outline" : "muted"} size="sm">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      {!collapsed && (
        <div className="p-4 border-t border-border/70 bg-card/40 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-muted font-mono">System Core</span>
            <Badge variant="success" dot size="sm">Active</Badge>
          </div>
        </div>
      )}
    </aside>
  );
};
