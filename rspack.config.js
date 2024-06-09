const rspack = require('@rspack/core');
const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { RsdoctorRspackPlugin } = require('@rsdoctor/rspack-plugin');

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: 'source-map',
  entry: {
    main: './src/main.ts',
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loader: 'builtin:swc-loader',
      },
    ],
  },
  devServer: {
    client: {
      overlay: {
        warnings: false,
        errors: true,
      },
    },
    static: {
      directory: path.join(__dirname, 'src'),
    },
    compress: true,
    port: 3004,
    hot: true,
  },
  plugins: [
    process.env.RSDOCTOR &&
      new RsdoctorRspackPlugin({
        features: ['loader', 'bundle', 'plugins', 'treeShaking'],
      }),
    process.env.NODE_ENV === 'development' && new ForkTsCheckerWebpackPlugin(),
    new rspack.DefinePlugin({
      __MAP__: JSON.stringify(process.env.MAP),
    }),
    new rspack.HtmlRspackPlugin({
      template: 'src/index.html',
      minify: process.env.NODE_ENV === 'production',
    }),
    new rspack.CopyRspackPlugin({
      patterns: [{ from: 'src/static', to: 'src/static' }],
    }),
  ].filter(Boolean),
};
