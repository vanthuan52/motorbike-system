import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";
import { createJiti } from "jiti";
import createNextIntlPlugin from "next-intl/plugin";

const jiti = createJiti(fileURLToPath(import.meta.url));

jiti.esmResolve("./src/config/env.config.ts");

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async rewrites() {
    return [
      {
        source: "/:locale(en|vi)/manifest.webmanifest",
        destination: "/manifest.webmanifest",
      },
    ];
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "debug"] }
        : false,
  },
  experimental: {
    cssChunking: true,
    optimizePackageImports: [],
    serverActions: {
      allowedOrigins: process.env.CORS_ORIGINS?.split(","),
    },
    webVitalsAttribution: ["FCP", "TTFB"],
    useLightningcss: false,
    webpackMemoryOptimizations: true,
  },
  images: {
    formats: ["image/webp"],
    minimumCacheTTL: process.env.NODE_ENV === "production" ? 60 : 0,
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
      {
        protocol: "https",
        hostname: "randomuser.me",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  output: "standalone",
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  serverExternalPackages: ["pino-pretty"],
};

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

export default withNextIntl(nextConfig);
