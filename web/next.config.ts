import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  allowedDevOrigins: ['192.168.56.1'],
};

export default nextConfig;
