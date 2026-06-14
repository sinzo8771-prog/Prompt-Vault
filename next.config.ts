import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Ensure Next.js uses the correct project root (prevents “inferred workspace root” warning).
    root: "./",
  },
};

export default nextConfig;
