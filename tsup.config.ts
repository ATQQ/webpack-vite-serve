// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'tsup';

export default defineConfig({
  splitting: false,
  sourcemap: true,
  clean: true,
  entryPoints: ['src/bin.ts', 'src/config/vite.ts'],
  external: [
    'vue',
  ],
});
