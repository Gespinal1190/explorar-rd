import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Forced rebuild for deployment check - Trigger Vercel Deploy 2026
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
