"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  const pathname = usePathname();

  // Route map for human-readable labels
  const routeLabels: Record<string, string> = {
    "": "Home",
    encode: "Encode Stego",
    decode: "Decode Stego",
    compare: "Comparison & Metrics",
    dashboard: "Research Dashboard",
    documentation: "System Documentation",
    about: "About System",
    contact: "Contact & Support",
    "design-system": "Design System Showcase",
  };

  // If explicit items provided, use them; otherwise auto-generate from pathname
  const resolvedItems: BreadcrumbItem[] = items || (() => {
    const segments = pathname.split("/").filter(Boolean);
    let accum = "";
    return segments.map((seg) => {
      accum += `/${seg}`;
      return {
        label: routeLabels[seg] || seg.charAt(0).toUpperCase() + seg.slice(1),
        href: accum,
      };
    });
  })();

  return (
    <nav aria-label="Breadcrumb Navigation" className={cn("flex items-center text-xs text-text-muted space-x-1.5 select-none", className)}>
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-text-primary transition-colors focus-ring rounded"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="sr-only">Home</span>
      </Link>

      {resolvedItems.map((item, index) => {
        const isLast = index === resolvedItems.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 text-border shrink-0" />
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-text-primary transition-colors focus-ring rounded">
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-text-primary font-mono">{item.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
