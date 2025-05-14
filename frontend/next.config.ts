import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: process.env.NODE_ENV === "production" ? "https" : "http",
        hostname: process.env.NEXT_PUBLIC_SERVER_HOST || "localhost",
        port:
          process.env.NODE_ENV === "production"
            ? undefined
            : process.env.NEXT_PUBLIC_SERVER_PORT,
        pathname: "/**",
      },
    ],
  },
  devIndicators: false,
};

export default nextConfig;
