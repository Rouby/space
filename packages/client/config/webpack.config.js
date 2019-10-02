/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');

module.exports = (env = {}) => ({
  mode: env.production ? 'production' : 'development',
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: [
          'babel-loader',
          {
            loader: '@svgr/webpack',
            options: {
              native: true,
              icon: true,
              babel: false,
            },
          },
          'url-loader',
        ],
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            babelrc: false,
            presets: [
              [
                '@babel/preset-env',
                { targets: { browsers: 'last 2 Chrome versions' } },
              ],
              '@babel/preset-typescript',
              '@babel/preset-react',
            ],
            plugins: [
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }],
              [
                'import',
                { libraryName: 'antd', libraryDirectory: 'es', style: 'css' },
              ],
              [
                'react-intl',
                {
                  messagesDir: path.join(__dirname, '../messages'),
                  extractFromFormatMessageCall: true,
                },
              ],
            ],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader, options: { hmr: true } },
          'css-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    env.production && new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[hash].css',
      chunkFilename: 'static/css/[name].[hash].css',
      ignoreOrder: false,
    }),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, '../public'),
        to: path.resolve(__dirname, '../build'),
        ignore: 'index.html',
      },
    ]),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../public/index.html'),
    }),
    new DotenvPlugin(),
  ].filter(Boolean),
  devtool: env.production ? 'source-map' : 'eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, '../build'),
    hot: true,
    compress: true,
    port: 3000,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        pathRewrite: { '^/api': '' },
      },
    },
  },
  optimization: {
    moduleIds: 'hashed',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  output: {
    filename: env.production
      ? 'static/js/[name].bundle.[hash].js'
      : 'static/js/[name].bundle.js',
    chunkFilename: env.production
      ? 'static/js/[name].bundle.[hash].js'
      : 'static/js/[name].bundle.js',
    path: path.resolve(__dirname, '../build'),
  },
});
