import { PlaceholderCard } from "@/components/PlaceholderCard";
import { MetricsCard } from "@/components/MetricsCard";
import { AlgorithmsCard } from "@/components/AlgorithmsCard";
import { LayoutDashboard, Server, Cpu, Activity } from "lucide-react";

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
            <span>FastAPI Server Entrypoint</span>
            <Server className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-emerald-400 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            app/main.py Ready
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
            <span>Fidelity Telemetry</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xl font-bold text-gray-100 font-mono">
            PSNR / SSIM / MSE / BER
          </p>
        </div>
      </div>

      <MetricsCard />

      <AlgorithmsCard />

      <PlaceholderCard
        title="Steganography Pipeline Telemetry"
        description="This dashboard will render real-time execution logs and algorithm benchmark metrics once steganography logic is connected."
        endpoint="/api/metrics"
        httpMethod="POST"
        icon={<LayoutDashboard className="w-6 h-6" />}
      />
    </div>
  );
}
