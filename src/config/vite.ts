/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import path from 'path';
import { defineConfig } from 'vite';
import env from 'vite-plugin-env-compatible';
import { htmlTemplatePlugin, pageEntryPlugin } from '../plugins/index';
import { getCWD, moduleIsExist } from '../utils';

const extraPlugins = [];

if (process.env.framework === 'VUE' && moduleIsExist('vue')) {
  const { version } = require('vue/package.json');
  // TODO；根据版本，做判断，jsx支持
  if (version.startsWith('3')) {
    const vue = require('@vitejs/plugin-vue');
    extraPlugins.push(vue());
  } else {
    const { createVuePlugin } = require('vite-plugin-vue2');
    extraPlugins.push(createVuePlugin());
  }
}
if (process.env.framework === 'REACT') {
  const react = require('@vitejs/plugin-react');
  extraPlugins.push(...[react()]);
}

// 内置依赖预构建
const optimizeDepsInclude = [
  'vue', 'vue-router', 'vuex', 'react', 'react-dom', 'react-router',
].filter((d) => moduleIsExist(d));

module.exports = defineConfig({
  plugins: [
    env({
      prefix: '',
    }),
    htmlTemplatePlugin(),
    pageEntryPlugin(),
    ...extraPlugins,
  ],
  server: {
    host: '0.0.0.0',
  },
  optimizeDeps: {
    include: optimizeDepsInclude,
  },
  resolve: {
    alias: {
      // 兜底
      '@': path.resolve(getCWD(), 'src'),
    },
  },
});
