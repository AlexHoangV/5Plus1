import type { NextConfig } from "next";

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
    const loaderPath = require.resolve('orchids-visual-edits/loader.js');
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
