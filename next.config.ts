import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    qualities: [75],
  },
};

export default nextConfig;
