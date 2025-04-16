import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['dummyjson.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
