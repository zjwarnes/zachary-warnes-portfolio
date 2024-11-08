/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: [
      '@mediapipe/tasks-vision',
      '@xenova/transformers'
    ],
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          path: false,
          crypto: false,
        };
      }
      
      // Add WASM loading configuration
      config.experiments = {
        ...config.experiments,
        asyncWebAssembly: true,
        layers: true
      };

      // Ensure proper asset handling
      config.module.rules.push({
        test: /\.wasm$/,
        type: 'asset/resource'
      });

      return config;
    },
    // Add this to ensure proper asset handling
    assetPrefix: process.env.NODE_ENV === 'production' ? undefined : ''
  }
  
  module.exports = nextConfig