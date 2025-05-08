import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Disable TypeScript checks for build, only for development
    ignoreBuildErrors: true
  },
  eslint: {
    // Disable ESLint checks for build, only for development
    ignoreDuringBuilds: true
  },
  images: {
    domains: ['localhost', 'placekitten.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  }
};

export default nextConfig;
