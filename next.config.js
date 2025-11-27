/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@mediapipe/tasks-vision',
    '@xenova/transformers'
  ],
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude onnxruntime-node and @xenova/transformers from server bundle
      config.externals.push('onnxruntime-node');
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'onnxruntime-node': false,
        '@xenova/transformers': false,
      };
    } else {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        'onnxruntime-node': false,
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