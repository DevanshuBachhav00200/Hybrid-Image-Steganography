import { PlaceholderCard } from "@/components/PlaceholderCard";
import { BookOpen, Server, Code2, CheckCircle2 } from "lucide-react";

export default function DocumentationPage() {
  const endpoints = [
    { method: "GET", path: "/api/health", desc: "Backend health check status" },
    { method: "GET", path: "/api/version", desc: "API application version metadata" },
    { method: "GET", path: "/api/algorithms", desc: "Supported steganography algorithms spec" },
    { method: "POST", path: "/api/encode", desc: "Encode secret payload into cover image" },
    { method: "POST", path: "/api/decode", desc: "Extract hidden payload from stego image" },
    { method: "POST", path: "/api/compare", desc: "Compute PSNR, SSIM, MSE metrics" },
    { method: "POST", path: "/api/metrics", desc: "Detailed steganographic pipeline evaluation" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">API Documentation</h1>
        <p className="text-sm text-gray-400 mt-1">
          Technical specifications for FastAPI backend endpoints and client communication.
        </p>
      </div>

      <PlaceholderCard
        title="Interactive Swagger & ReDoc Specifications"
        description="When the backend server is running, native interactive documentation is served directly at the FastAPI endpoints below."
        endpoint="/api/docs"
        httpMethod="GET"
        icon={<BookOpen className="w-6 h-6" />}
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-400" />
              FastAPI Interactive OpenAPI Docs available at:
            </span>
            <code className="font-mono bg-blue-950/60 px-2.5 py-1 rounded text-blue-200">
              http://localhost:8000/api/docs
            </code>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-800">
            <table className="w-full text-left text-xs sm:text-sm font-mono">
              <thead className="bg-gray-900 text-gray-300 border-b border-gray-800">
                <tr>
                  <th className="p-3">HTTP Method</th>
                  <th className="p-3">Endpoint</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-gray-950/40 text-gray-400">
                {endpoints.map((ep) => (
                  <tr key={ep.path} className="hover:bg-gray-900/40">
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-xs ${
                          ep.method === "POST"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}
                      >
                        {ep.method}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-gray-200">{ep.path}</td>
                    <td className="p-3 text-gray-400 font-sans text-xs">{ep.desc}</td>
                    <td className="p-3">
                      <span className="text-amber-400 text-xs flex items-center gap-1 font-sans">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                        Baseline Ready
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PlaceholderCard>
    </div>
  );
}
