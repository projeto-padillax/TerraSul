import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/favicon.ico",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/imovel-:slug(.*)-:codigo",
        destination: "/imovel/:slug/:codigo",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/blog",
        destination: "https://blog.terrasulimoveis.com.br/",
      },
      {
        source: "/blog/:path*",
        destination: "https://blog.terrasulimoveis.com.br/:path*",
      },
    ];
  },
  images: {
    formats: ["image/webp"],
    // 31 days (seconds)
    minimumCacheTTL: 2_678_400,
    deviceSizes: [360, 414, 768, 1024, 1280],
    imageSizes: [16, 24, 32, 48, 64, 96, 128],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.vistahost.com.br",
        pathname: "**", // aceita qualquer path desse domínio
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
