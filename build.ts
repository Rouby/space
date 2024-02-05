import { build } from 'vite';
import viteConfig from './vite.config';

{
  await build(viteConfig);
}

{
  console.log('building server files...');

  const time = Date.now();

  await Bun.build({
    entrypoints: ['./src/main.server.ts'],
    outdir: './dist',
    target: 'bun',
    sourcemap: 'external',
    external: Object.keys(require('./package.json').dependencies),
  });

  console.log('✓ built in', Date.now() - time, 'ms');
}
