import { PlaceholderCard } from "@/components/PlaceholderCard";
import { Unlock, Upload, Key, FileCheck } from "lucide-react";

export default function DecodePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Decode Payload</h1>
        <p className="text-sm text-gray-400 mt-1">
          Extract hidden secret data from stego images using secret keys and target decompression algorithms.
        </p>
      </div>

      <PlaceholderCard
        title="Steganography Decoding Interface"
        description="This module will allow uploading a stego image, supplying the secret decryption key, selecting target extraction techniques, and revealing secret payloads."
        endpoint="/api/decode"
        httpMethod="POST"
        icon={<Unlock className="w-6 h-6" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-80 pointer-events-none">
          {/* Mock Upload Box */}
          <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center space-y-3 bg-gray-900/40">
            <Upload className="w-8 h-8 text-purple-400 mx-auto" />
            <div>
              <p className="text-sm font-semibold text-gray-200">Upload Stego Image</p>
              <p className="text-xs text-gray-500">Encoded PNG / BMP image</p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-gray-800 text-xs text-gray-300 font-medium border border-gray-700">
              Browse Stego Image
            </button>
          </div>

          {/* Mock Key & Decrypt Controls */}
          <div className="space-y-4 bg-gray-900/40 p-6 rounded-xl border border-gray-800">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-purple-400" />
                Decryption Key
              </label>
              <input
                type="password"
                disabled
                placeholder="Enter passphrase to decrypt..."
                className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-xs text-gray-400"
              />
            </div>

            <button
              disabled
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/50 text-white font-medium text-xs border border-purple-500/30"
            >
              <FileCheck className="w-4 h-4" />
              Extract Hidden Payload
            </button>
          </div>
        </div>
      </PlaceholderCard>
    </div>
  );
}
