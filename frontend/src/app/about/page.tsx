import { PlaceholderCard } from "@/components/PlaceholderCard";
import { Info, Shield, Layers, Lock, Cpu } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">About the Hybrid Steganography Project</h1>
        <p className="text-sm text-gray-400 mt-1">
          Overview of research objectives, system architecture, and algorithm concepts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl glass-panel border border-gray-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-100">Project Mission</h2>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            The Hybrid Image Steganography System is designed to demonstrate high-capacity, robust, and imperceptible data embedding by coupling classical cryptography (AES-256) and text obfuscation (Morse Code) with spatial and frequency domain steganographic techniques.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-gray-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-100">Layered Security Design</h2>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            By applying a multi-stage process (Text &rarr; Morse &rarr; AES-256 Cipher &rarr; Binary Representation &rarr; Image Coefficients), payload security relies on both computational secrecy and statistical imperceptibility.
          </p>
        </div>
      </div>

      <PlaceholderCard
        title="Architecture Overview Baseline"
        description="Supported steganographic algorithms (LSB, DCT, DWT) and encryption layers (AES-256) are structured in modular Python packages under app/algorithms."
        endpoint="/api/algorithms"
        httpMethod="GET"
        icon={<Info className="w-6 h-6" />}
      >
        <div className="p-6 rounded-xl bg-gray-900/60 border border-gray-800 space-y-3 text-xs sm:text-sm text-gray-300">
          <p className="font-semibold text-gray-200">Key Modular Packages:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
            <div className="p-3 rounded-lg bg-gray-950 border border-gray-800">
              <span className="text-blue-400 font-bold block mb-1">app/algorithms/morse</span>
              Morse code text representation encoder/decoder placeholder.
            </div>
            <div className="p-3 rounded-lg bg-gray-950 border border-gray-800">
              <span className="text-purple-400 font-bold block mb-1">app/algorithms/aes</span>
              AES-256 symmetric cipher payload encryption placeholder.
            </div>
            <div className="p-3 rounded-lg bg-gray-950 border border-gray-800">
              <span className="text-emerald-400 font-bold block mb-1">app/algorithms/{'{lsb,dct,dwt}'}</span>
              Spatial & Frequency domain stego coefficient embedders.
            </div>
          </div>
        </div>
      </PlaceholderCard>
    </div>
  );
}
