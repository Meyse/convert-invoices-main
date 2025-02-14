const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
import webpack from 'webpack';

module.exports = {
  webpack: (config: webpack.Configuration, { isServer }: { isServer: boolean }) => {
    // Add Node.js polyfills for client-side only
    if (!isServer) {
      if(config.resolve) {
        config.resolve.fallback = {
          fs: false,
          path: require.resolve('path-browserify'),
          crypto: require.resolve('crypto-browserify'),
          stream: require.resolve('stream-browserify'),
          buffer: require.resolve('buffer/'),
          util: require.resolve('util/'),
        };
      }
    }

    // Add the polyfill plugin
    config.plugins?.push(new NodePolyfillPlugin());

    return config;
  },
};