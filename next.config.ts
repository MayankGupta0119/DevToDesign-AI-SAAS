import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  /* config options here */
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
};

export default nextConfig;
