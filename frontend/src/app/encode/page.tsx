import { PlaceholderCard } from "@/components/PlaceholderCard";
import { Lock, Upload, Key, Sliders, Image as ImageIcon } from "lucide-react";

export default function EncodePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Encode Payload</h1>
        <p className="text-sm text-gray-400 mt-1">
          Embed encrypted data into cover images using spatial LSB or frequency domain DCT/DWT algorithms.
        </p>
      </div>

      <PlaceholderCard
        title="Steganography Encoding Interface"
        description="This module will allow uploading a cover image, entering secret payload text or files, selecting AES encryption parameters, and picking steganography algorithms."
        endpoint="/api/encode"
        httpMethod="POST"
        icon={<Lock className="w-6 h-6" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-80 pointer-events-none">
          {/* Mock Upload Box */}
          <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center space-y-3 bg-gray-900/40">
            <Upload className="w-8 h-8 text-blue-400 mx-auto" />
            <div>
              <p className="text-sm font-semibold text-gray-200">Upload Cover Image</p>
              <p className="text-xs text-gray-500">PNG, BMP, JPG up to 10MB</p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-gray-800 text-xs text-gray-300 font-medium border border-gray-700">
              Browse Image
            </button>
          </div>

          {/* Mock Options Box */}
          <div className="space-y-4 bg-gray-900/40 p-6 rounded-xl border border-gray-800">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-purple-400" />
                Secret Key (AES-256)
              </label>
              <input
                type="password"
                disabled
                placeholder="Enter encryption passphrase..."
                className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-xs text-gray-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-400" />
                Algorithm Selection
              </label>
              <select disabled className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-xs text-gray-400">
                <option>Hybrid (AES + Morse + LSB)</option>
                <option>DCT Frequency Domain</option>
                <option>DWT Wavelet Domain</option>
              </select>
            </div>
          </div>
        </div>
      </PlaceholderCard>
    </div>
  );
}
