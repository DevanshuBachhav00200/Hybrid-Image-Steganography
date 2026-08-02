"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Cpu,
  Layers,
  BarChart2,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Info,
  Settings,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export interface SidebarProps {
  activePath?: string;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePath = "/dashboard", className }) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: Cpu },
    { label: "Encode Module", href: "/encode", icon: Layers, badge: "Phase 3" },
    { label: "Decode Module", href: "/decode", icon: Shield, badge: "Phase 4" },
    { label: "Analysis & Metrics", href: "/compare", icon: BarChart2, badge: "Phase 5" },
    { label: "Design System Catalog", href: "/design-system", icon: BookOpen },
    { label: "Documentation", href: "/about", icon: Info },
  ];

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 z-30 bg-background-secondary border-r border-border flex flex-col justify-between transition-all duration-300 select-none",
        collapsed ? "w-20" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border/70 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/15 text-primary border border-primary/30">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-text-primary tracking-tight">STEGO-LAB</span>
              <span className="text-[10px] font-mono text-text-muted">Research System</span>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-card-hover border border-border transition-colors mx-auto"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="p-3 space-y-1 overflow-y-auto flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePath === item.href;
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
      </div>

      {/* Footer info */}
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
