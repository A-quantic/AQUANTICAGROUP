/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {},
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    // Forzar HTTPS - reemplazar http:// por https:// si existe
    NEXT_PUBLIC_API_URL: (process.env.NEXT_PUBLIC_API_URL || "https://amused-peace-production-424b.up.railway.app").replace(/^http:\/\//, "https://"),
  },
};

export default nextConfig;
