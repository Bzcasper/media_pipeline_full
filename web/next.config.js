/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@trapgod/media-sdk", "ai"],
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: false,

  // Image optimization
  images: {
    domains: ["localhost", "example.com"],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // SWC optimizations
  swcMinify: true,

  // Bundle analyzer for performance monitoring
  webpack: (
    config,
    { isServer, dev, pages, buildId, defaultLoaders, webpack }
  ) => {
    // Optimize for production
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups.commons = {
        name: "commons",
        chunks: "all",
        minChunks: 2,
      };
    }
    return config;
  },

  // Experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
    // Enable additional optimizations
    esmExternals: "loose",
    typedRoutes: true,
  },

  // Headers for performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=86400",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
