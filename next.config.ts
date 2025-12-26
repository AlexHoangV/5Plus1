import type { NextConfig } from "next";

import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

// Turbopack loader is only needed for development interactivity
if (process.env.NODE_ENV === 'development') {
    try {
      const loaderPath = path.join(process.cwd(), 'src/visual-edits/component-tagger-loader.js');
      (nextConfig as any).turbopack = {
        rules: {
          "*.{jsx,tsx}": {
            loaders: [loaderPath]
          }
        }
      };
    } catch (e) {
    // Ignore if loader is not found
  }
}

export default nextConfig;
