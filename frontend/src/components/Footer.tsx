import Link from "next/link";
import { Shield, Github, FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-800/80 bg-gray-950/60 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Shield className="w-4 h-4 text-blue-400" />
            <span>Hybrid Image Steganography System &copy; 2026 Baseline</span>
          </div>

          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <Link href="/documentation" className="hover:text-blue-400 flex items-center gap-1 transition-colors">
              <FileText className="w-4 h-4" />
              <span>API Specs</span>
            </Link>
            <Link href="/about" className="hover:text-blue-400 transition-colors">
              About Project
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
