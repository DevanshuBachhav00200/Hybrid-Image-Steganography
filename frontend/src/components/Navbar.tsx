"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  GitCompare, 
  LayoutDashboard, 
  Info, 
  BookOpen 
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/", icon: ShieldCheck },
    { name: "Encode", href: "/encode", icon: Lock },
    { name: "Decode", href: "/decode", icon: Unlock },
    { name: "Compare", href: "/compare", icon: GitCompare },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "About", href: "/about", icon: Info },
    { name: "Docs", href: "/documentation", icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight gradient-text">
                HybridStego
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                v1.0 Baseline
              </span>
            </div>
          </Link>

          <nav className="flex items-center space-x-1 sm:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
