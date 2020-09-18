import * as webpack from 'webpack';
import * as webpackDevServer from 'webpack-dev-server';
import { config } from './webpack';

process.env.NODE_ENV = 'development';

new webpackDevServer(webpack(config) as any, {
  hot: true,
  transportMode: 'ws',
}).listen(3000);
