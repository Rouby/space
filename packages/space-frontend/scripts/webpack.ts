/// <reference types="./react-intl-webpack-plugin" />
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import { resolve } from 'path';
import ReactIntlWebpackPlugin from 'react-intl-webpack-plugin';
import webpack from 'webpack';

export function createConfig(isDevelopment: boolean): webpack.Configuration {
  return {
    mode: isDevelopment ? 'development' : 'production',
    entry: resolve(__dirname, '../src/index.tsx'),
    devtool: isDevelopment ? 'cheap-source-map' : 'source-map',
    output: {
      filename: isDevelopment
        ? 'static/js/[name].js'
        : 'static/js/[name].[contenthash].js',
      path: resolve(__dirname, '../dist'),
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          defaultVendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                configFile: false,
                metadataSubscribers: [
                  ReactIntlWebpackPlugin.metadataContextFunctionName,
                ],
                presets: [
                  [
                    require.resolve('@babel/preset-env'),
                    {
                      useBuiltIns: false,
                      targets: {
                        chrome: '85',
                      },
                    },
                  ],
                  [
                    require.resolve('@babel/preset-react'),
                    {
                      useBuiltIns: false,
                      development: isDevelopment,
                    },
                  ],
                  [
                    require.resolve('@babel/preset-typescript'),
                    {
                      onlyRemoveTypeImports: true,
                    },
                  ],
                ],
                plugins: [
                  isDevelopment && require.resolve('react-refresh/babel'),
                  [
                    require.resolve('babel-plugin-react-intl'),
                    {
                      idInterpolationPattern: '[sha512:contenthash:base64:6]',
                      removeDefaultMessage: true,
                      extractFromFormatMessageCall: true,
                      ast: true,
                    },
                  ],
                ].filter(Boolean),
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.mjs'],
      fallback: {
        querystring: 'querystring-es3',
      },
    },
    plugins: [
      new HTMLWebpackPlugin({
        inject: true,
        filename: './index.html',
        template: resolve(__dirname, '../public/index.html'),
        ...(!isDevelopment && {
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
          },
        }),
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.GRAPHQL_ENDPOINT': JSON.stringify('http://localhost:5000'),
        'process.env': '{}',
      }),
      new ForkTsCheckerWebpackPlugin({
        async: isDevelopment,
        formatter: undefined,
        logger: {
          devServer: false,
          infrastructure: 'silent',
          issues: 'silent',
        },
      }),
      isDevelopment && new ReactRefreshWebpackPlugin(),
      new ReactIntlWebpackPlugin(),
    ].filter(Boolean) as webpack.WebpackPluginInstance[],
  };
}
