import Link from "next/link";
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  GitCompare, 
  LayoutDashboard, 
  Cpu, 
  Layers, 
  KeyRound,
  ArrowRight
} from "lucide-react";

export default function HomePage() {
  const modules = [
    {
      title: "Encode Secret Payload",
      description: "Embed text or binary data into target cover images using multi-layer hybrid steganography.",
      href: "/encode",
      icon: Lock,
      badge: "Encode",
      color: "from-blue-600 to-cyan-600",
    },
    {
      title: "Decode Stego Image",
      description: "Extract hidden encrypted payloads from stego images using decryption keys and domain transforms.",
      href: "/decode",
      icon: Unlock,
      badge: "Decode",
      color: "from-purple-600 to-indigo-600",
    },
    {
      title: "Image Comparison & PSNR",
      description: "Perform side-by-side visual analysis, difference map rendering, and metrics computation (PSNR, SSIM, MSE).",
      href: "/compare",
      icon: GitCompare,
      badge: "Compare",
      color: "from-emerald-600 to-teal-600",
    },
    {
      title: "System Dashboard",
      description: "Monitor API server health, supported steganography pipeline specs, and execution metrics.",
      href: "/dashboard",
      icon: LayoutDashboard,
      badge: "Dashboard",
      color: "from-amber-600 to-orange-600",
    },
  ];

  const pipeline = [
    { step: "01", name: "Morse Encoding", icon: Layers, desc: "Text to Morse representation conversion" },
    { step: "02", name: "AES-256 Cipher", icon: KeyRound, desc: "High-grade payload encryption" },
    { step: "03", name: "Spatial / Frequency Stego", icon: Cpu, desc: "LSB spatial & DCT/DWT frequency domain embedding" },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-12 border border-gray-800">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <ShieldCheck className="w-4 h-4" />
            Hybrid Steganography Baseline Environment
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Multi-Layer Image <span className="gradient-text">Steganography & Encryption</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
            A modular platform combining spatial and frequency domain steganography with standard cryptographic algorithms for secure covert communications.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/encode"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
            >
              <Lock className="w-4 h-4" />
              Start Encoding
            </Link>
            <Link
              href="/documentation"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold border border-gray-700 transition-all"
            >
              Explore API Docs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Module Navigation Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-100">System Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.href}
                href={mod.href}
                className="group relative p-6 rounded-2xl glass-panel border border-gray-800 hover:border-gray-700 transition-all hover:shadow-2xl hover:shadow-blue-500/5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl bg-gradient-to-tr ${mod.color} text-white shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                    {mod.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-100 group-hover:text-blue-400 transition-colors flex items-center gap-2">
                    {mod.title}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{mod.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Architecture Highlights */}
      <div className="p-8 rounded-2xl glass-panel border border-gray-800 space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-100">Hybrid Architecture Pipeline</h2>
          <p className="text-sm text-gray-400">Sequential encoding workflow supported by backend endpoints</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {pipeline.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="p-4 rounded-xl bg-gray-900/60 border border-gray-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-gray-500">
                  <span>STEP {item.step}</span>
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>
                <h4 className="font-semibold text-gray-200 text-sm">{item.name}</h4>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
