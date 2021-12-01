/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import {
  defineConfig, searchForWorkspaceRoot, mergeConfig, Plugin, UserConfig,
} from 'vite';
import env from 'vite-plugin-env-compatible';
import {
  htmlTemplatePlugin, pageEntryPlugin, buildPlugin, userConfigPlugin, wp2vitePlugin,
} from '../plugins/index';
import { getCWD, moduleIsExist, resolved } from '../utils';

const extraPlugins = [];

// 修改用户配置的plugin
const configPlugins = [userConfigPlugin()];

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

// 使用wp2vite自动转换webpack配置
if (process.env.WP2VITE) {
  configPlugins.push(wp2vitePlugin());
}

// 内置依赖预构建
const optimizeDepsInclude = [
  'vue', 'vue-router', 'vuex', 'react', 'react-dom', 'react-router',
].filter((d) => moduleIsExist(d));

module.exports = defineConfig(async () => {
  let config: UserConfig = {
    plugins: [
      // // 合并用户配置
      // userConfigPlugin(),
      env({
        prefix: '',
      }),
      htmlTemplatePlugin(),
      pageEntryPlugin(),
      buildPlugin(),
      ...extraPlugins,
    ],
    server: {
      host: '0.0.0.0',
      fs: {
        allow: [searchForWorkspaceRoot(getCWD())],
      },
    },
    optimizeDeps: {
      include: optimizeDepsInclude,
    },
    resolve: {
      alias: {
        // 兜底
        '@/': `${resolved('src/')}`,
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          // 支持内联 JavaScript
          javascriptEnabled: true,
        },
      },
    },
  };
  // eslint-disable-next-line no-restricted-syntax
  for (const p of configPlugins) {
    const { config: configHook } = p as Plugin;
    if (configHook) {
      const configEnv = {
        command: process.env.command as 'build' | 'serve',
        mode: process.env.mode,
      };
      // eslint-disable-next-line no-await-in-loop
      const res = await configHook(config, configEnv);
      if (res) {
        config = mergeConfig(config, res);
      }
    }
  }
  return config;
});
