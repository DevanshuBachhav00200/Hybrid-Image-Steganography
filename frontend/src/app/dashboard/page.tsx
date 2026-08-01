import { PlaceholderCard } from "@/components/PlaceholderCard";
import { LayoutDashboard, Activity, Cpu, Server, CheckCircle2 } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">System Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">
          Monitor service availability, algorithm specs, and steganographic processing metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>FastAPI Server Status</span>
            <Server className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-emerald-400 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Online / Ready
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Supported Algorithms</span>
            <Cpu className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-xl font-bold text-gray-100 font-mono">
            5 Modules
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Execution Metrics</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xl font-bold text-gray-100 font-mono">
            PSNR / SSIM / MSE
          </p>
        </div>
      </div>

      <PlaceholderCard
        title="Steganography Pipeline Telemetry"
        description="This dashboard will render real-time statistics, execution logs, and algorithm performance comparisons once algorithms are implemented."
        endpoint="/api/metrics"
        httpMethod="POST"
        icon={<LayoutDashboard className="w-6 h-6" />}
      >
        <div className="p-6 rounded-xl bg-gray-900/60 border border-gray-800 space-y-4 text-sm text-gray-400">
          <p className="font-semibold text-gray-200">Registered Engine Specs (Placeholder Baseline):</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            <li className="p-2.5 rounded bg-gray-950 border border-gray-800 flex items-center justify-between">
              <span>Morse Code Encoder</span>
              <span className="text-amber-400 font-semibold">Placeholder</span>
            </li>
            <li className="p-2.5 rounded bg-gray-950 border border-gray-800 flex items-center justify-between">
              <span>AES-256 Cipher Engine</span>
              <span className="text-amber-400 font-semibold">Placeholder</span>
            </li>
            <li className="p-2.5 rounded bg-gray-950 border border-gray-800 flex items-center justify-between">
              <span>LSB Spatial Embedder</span>
              <span className="text-amber-400 font-semibold">Placeholder</span>
            </li>
            <li className="p-2.5 rounded bg-gray-950 border border-gray-800 flex items-center justify-between">
              <span>DCT & DWT Transform Engines</span>
              <span className="text-amber-400 font-semibold">Placeholder</span>
            </li>
          </ul>
        </div>
      </PlaceholderCard>
    </div>
  );
}
