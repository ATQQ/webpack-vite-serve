/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import { defineConfig } from 'vite';
import { htmlTemplatePlugin, pageEntryPlugin } from '../plugins/index';

let extraPlugins = [];

if (process.env.framework === 'VUE') {
  const vue = require('@vitejs/plugin-vue');
  extraPlugins = [vue()];
}
if (process.env.framework === 'REACT') {
  const react = require('@vitejs/plugin-react');
  extraPlugins = [react()];
}

module.exports = defineConfig({
  plugins: [
    htmlTemplatePlugin(),
    pageEntryPlugin(),
    ...extraPlugins,
  ],
  optimizeDeps: {
  },
});
