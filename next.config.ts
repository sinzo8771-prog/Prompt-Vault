import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Next.js expects an absolute path for turbopack.root
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
