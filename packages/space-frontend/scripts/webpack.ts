import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import { resolve } from 'path';
import webpack from 'webpack';

const isDevelopment = process.env.NODE_ENV !== 'production';

export const config: webpack.Configuration = {
  mode: isDevelopment ? 'development' : 'production',
  entry: resolve(__dirname, '../src/index.tsx'),
  output: {
    filename: 'main.js',
    path: resolve(__dirname, '../dist'),
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
              presets: [
                // require.resolve('@babel/preset-env'),
                [
                  require.resolve('@babel/preset-react'),
                  { development: isDevelopment },
                ],
                [
                  require.resolve('@babel/preset-typescript'),
                  { onlyRemoveTypeImports: true },
                ],
              ],
              plugins: [
                isDevelopment && require.resolve('react-refresh/babel'),
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
    isDevelopment && new ReactRefreshWebpackPlugin(),
    new HTMLWebpackPlugin({
      filename: './index.html',
      template: resolve(__dirname, '../public/index.html'),
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new ForkTsCheckerWebpackPlugin({
      async: isDevelopment,
      formatter: undefined,
      logger: { devServer: false, infrastructure: 'silent', issues: 'silent' },
    }),
  ].filter(Boolean) as webpack.WebpackPluginInstance[],
};
