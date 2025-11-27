/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@mediapipe/tasks-vision',
    '@xenova/transformers'
  ],
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude native modules and client-side packages from server bundle
      config.externals.push(
        'onnxruntime-node',
        'sharp'
      );
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'onnxruntime-node': false,
        '@xenova/transformers': false,
        'sharp': false,
        'fs': false,
        'path': false,
      };
    } else {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        'onnxruntime-node': false,
        'sharp': false,
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

    // Exclude .node binary files from webpack bundling
    config.module.rules.push({
      test: /\.node$/,
      use: 'ignore-loader'
    });

    return config;
  },
  // Add this to ensure proper asset handling
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : ''
}

module.exports = nextConfig