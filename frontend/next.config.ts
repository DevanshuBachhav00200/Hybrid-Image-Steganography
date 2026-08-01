import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  experimental: {
    // Next.js 15 capabilities
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
