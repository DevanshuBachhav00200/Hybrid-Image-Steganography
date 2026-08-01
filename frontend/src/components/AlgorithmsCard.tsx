import { Cpu, Layers, Lock, FileCode, CheckCircle2, Clock } from "lucide-react";

export function AlgorithmsCard() {
  const algorithms = [
    {
      name: "Morse Code Obfuscation",
      type: "Text Processing",
      path: "app/algorithms/morse/encoder.py",
      status: "Placeholder Only",
      icon: Layers,
      color: "text-amber-400 border-amber-500/20 bg-amber-500/10",
      description: "Converts text payloads into standard dot-dash Morse code tokens prior to encryption.",
    },
    {
      name: "AES-256 Symmetric Cipher",
      type: "Cryptography",
      path: "app/algorithms/aes/cipher.py",
      status: "Placeholder Only",
      icon: Lock,
      color: "text-purple-400 border-purple-500/20 bg-purple-500/10",
      description: "Encrypts Morse payload using AES-256-CBC cipher with key derivation.",
    },
    {
      name: "LSB Spatial Domain Stego",
      type: "Spatial Steganography",
      path: "app/algorithms/lsb/stego.py",
      status: "Placeholder Only",
      icon: Cpu,
      color: "text-blue-400 border-blue-500/20 bg-blue-500/10",
      description: "Replaces least significant bits of cover image pixels with encrypted binary stream.",
    },
    {
      name: "DCT Frequency Domain Stego",
      type: "Frequency Transform",
      path: "app/algorithms/dct/stego.py",
      status: "Placeholder Only",
      icon: FileCode,
      color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
      description: "Embeds payload into Discrete Cosine Transform quantization coefficients.",
    },
    {
      name: "DWT Wavelet Domain Stego",
      type: "Frequency Transform",
      path: "app/algorithms/dwt/stego.py",
      status: "Placeholder Only",
      icon: Cpu,
      color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/10",
      description: "Embeds payload into Discrete Wavelet Transform sub-bands (LL, LH, HL, HH).",
    },
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-100">Supported Steganography Algorithms</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Modular package specifications under backend <code className="font-mono text-blue-300">app/algorithms</code>
          </p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          Baseline Placeholders
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {algorithms.map((algo) => {
          const Icon = algo.icon;
          return (
            <div
              key={algo.name}
              className="p-4 rounded-xl bg-gray-900/60 border border-gray-800/80 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-300">
                    {algo.type}
                  </span>
                  <div className={`p-1.5 rounded-lg border ${algo.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-200">{algo.name}</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{algo.description}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between text-[11px]">
                <code className="text-gray-500 font-mono truncate max-w-[170px]">{algo.path}</code>
                <span className="text-amber-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  Ready
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
