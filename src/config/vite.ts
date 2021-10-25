import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { htmlTemplatePlugin, pageEntryPlugin } from '../plugins/index';

const extraPlugins: any[] = [
  process.env.framework === 'REACT' ? [react()] : [],
  process.env.framework === 'VUE' ? [vue()] : [],
];
module.exports = defineConfig({
  plugins: [
    htmlTemplatePlugin(),
    pageEntryPlugin(),
    ...extraPlugins,
  ],
  optimizeDeps: {
  },
});
