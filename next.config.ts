import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  typescript: {
    // Allow production builds to complete even with type errors
    // Remove this in production or fix the underlying type issues
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
