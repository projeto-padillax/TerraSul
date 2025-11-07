import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
