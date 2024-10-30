import { NextConfig } from "next";
import webpack from "webpack";
import { Buffer } from "buffer";

// Define global Buffer
globalThis.Buffer = Buffer;

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
        process: "process/browser",
      })
    );

    return config;
  },
  // Place any additional Next.js configurations here
};

export default nextConfig;
