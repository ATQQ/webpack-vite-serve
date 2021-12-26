import { defineConfig } from 'tsup';
import publicDir from 'esbuild-plugin-public-directory';

export default defineConfig({
  splitting: false,
  sourcemap: true,
  clean: true,
  entryPoints: ['src/bin.ts', 'src/config/vite.ts'],
  external: [
    'vue',
  ],
  esbuildPlugins: [publicDir()],
});
