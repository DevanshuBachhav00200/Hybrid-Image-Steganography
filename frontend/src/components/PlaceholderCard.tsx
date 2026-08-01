import { ReactNode } from "react";
import { Clock, Code2, CheckCircle2 } from "lucide-react";

interface PlaceholderCardProps {
  title: string;
  description: string;
  endpoint?: string;
  httpMethod?: "GET" | "POST" | "PUT" | "DELETE";
  icon?: ReactNode;
  children?: ReactNode;
}

export function PlaceholderCard({
  title,
  description,
  endpoint,
  httpMethod = "GET",
  icon,
  children,
}: PlaceholderCardProps) {
  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-gray-800 shadow-xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {icon && (
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100">{title}</h2>
            <p className="text-sm text-gray-400 mt-1">{description}</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Clock className="w-3.5 h-3.5" />
          Placeholder Baseline
        </span>
      </div>

      {endpoint && (
        <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center justify-between gap-3 text-xs sm:text-sm font-mono">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-purple-400" />
            <span className="text-gray-400">Target Backend Endpoint:</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded font-bold text-xs ${
                httpMethod === "POST"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
              }`}
            >
              {httpMethod}
            </span>
            <code className="text-blue-300 font-semibold">{endpoint}</code>
          </div>
        </div>
      )}

      {children}

      <div className="pt-4 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Architecture Verified & Ready for Logic
        </span>
        <span>Hybrid Stego Pipeline</span>
      </div>
    </div>
  );
}
