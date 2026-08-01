import { Activity, ShieldCheck, BarChart3, Binary } from "lucide-react";

interface MetricsCardProps {
  psnr?: number | string;
  ssim?: number | string;
  mse?: number | string;
  ber?: number | string;
  title?: string;
  subtitle?: string;
}

export function MetricsCard({
  psnr = "--.- dB",
  ssim = "0.----",
  mse = "-.----",
  ber = "0.00%",
  title = "Steganographic Quality & Metrics",
  subtitle = "Evaluates visual distortion and signal fidelity between cover and stego images.",
}: MetricsCardProps) {
  const metricsList = [
    {
      name: "PSNR",
      fullName: "Peak Signal-to-Noise Ratio",
      value: psnr,
      icon: Activity,
      color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
      description: "Higher values indicate lower image degradation.",
    },
    {
      name: "SSIM",
      fullName: "Structural Similarity Index",
      value: ssim,
      icon: BarChart3,
      color: "text-blue-400 border-blue-500/20 bg-blue-500/10",
      description: "Measures structural perception similarity (0.0 to 1.0).",
    },
    {
      name: "MSE",
      fullName: "Mean Squared Error",
      value: mse,
      icon: Binary,
      color: "text-purple-400 border-purple-500/20 bg-purple-500/10",
      description: "Cumulative squared error between pixel intensities.",
    },
    {
      name: "BER",
      fullName: "Bit Error Rate",
      value: ber,
      icon: ShieldCheck,
      color: "text-amber-400 border-amber-500/20 bg-amber-500/10",
      description: "Percentage of payload bit corruption extracted.",
    },
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-100">{title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
          Placeholder Metrics
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsList.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className="p-4 rounded-xl bg-gray-900/60 border border-gray-800/80 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-gray-300">{item.name}</span>
                <div className={`p-1.5 rounded-lg border ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-xl font-bold font-mono text-gray-100">{item.value}</p>
                <p className="text-[10px] text-gray-500 font-sans mt-0.5">{item.fullName}</p>
              </div>
              <p className="text-[11px] text-gray-400 leading-tight pt-1 border-t border-gray-800">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
