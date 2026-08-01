import { PlaceholderCard } from "@/components/PlaceholderCard";
import { MetricsCard } from "@/components/MetricsCard";
import { GitCompare, Eye, Image as ImageIcon } from "lucide-react";

export default function ComparePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Image Comparison & Quality Metrics</h1>
        <p className="text-sm text-gray-400 mt-1">
          Perform side-by-side visual analysis and compute quantitative steganographic quality metrics (PSNR, SSIM, MSE).
        </p>
      </div>

      <PlaceholderCard
        title="Visual Comparison Interface"
        description="Upload an original cover image and an encoded stego image to generate difference heatmaps and measure degradation metrics."
        endpoint="/api/compare"
        httpMethod="POST"
        icon={<GitCompare className="w-6 h-6" />}
      >
        <div className="space-y-6 opacity-80 pointer-events-none">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 text-center space-y-2">
              <ImageIcon className="w-6 h-6 text-blue-400 mx-auto" />
              <p className="text-xs font-semibold text-gray-300">Original Cover Image</p>
              <div className="h-28 rounded-lg bg-gray-950 flex items-center justify-center text-xs text-gray-600 border border-gray-800">
                Cover Image Preview
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 text-center space-y-2">
              <Eye className="w-6 h-6 text-emerald-400 mx-auto" />
              <p className="text-xs font-semibold text-gray-300">Stego Output Image</p>
              <div className="h-28 rounded-lg bg-gray-950 flex items-center justify-center text-xs text-gray-600 border border-gray-800">
                Stego Image Preview
              </div>
            </div>
          </div>
        </div>
      </PlaceholderCard>

      <MetricsCard
        title="Image Distortion Metrics Evaluation"
        subtitle="Computed via POST /api/metrics for quantitative degradation comparison"
      />
    </div>
  );
}
