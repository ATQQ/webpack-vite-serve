import {
  existsSync, readFileSync, unlinkSync, writeFileSync,
} from 'fs';
import type { PluginOption } from 'vite';
import wp2vite from 'wp2vite';
import { getCWD, getUserConfig, resolved } from '../utils';

export default function wp2vitePlugin(): PluginOption {
  return {
    name: 'wvs-wp2vite',
    enforce: 'pre',
    async config(_, env) {
      const cfgFile = resolved('vite.config.js');
      const tplFile = resolved('index.html');
      const contentMap = new Map([[cfgFile, ''], [tplFile, '']]);
      const files = [cfgFile, tplFile];

      console.time('wp2vite');
      // 判断是否存在vite.config.js 、index.html
      // 避免 wp2vite 覆盖
      files.forEach((f) => {
        if (existsSync(f)) {
          contentMap.set(f, readFileSync(f, { encoding: 'utf-8' }));
        }
      });

      // 转换出配置文件vite.config.js
      await wp2vite.start(getCWD(), {
        force: false,
        // 统一开启debug
        debug: !!process.env.DEBUG,
      });

      // TODO:提PR优化
      // 转换耗时计算
      console.timeEnd('wp2vite');

      // 获取wp2vite转换出的配置
      const cfg = await getUserConfig(env, 'js');

      contentMap.forEach((v, k) => {
        if (v) {
          // 如果修改了内容，还原内容
          writeFileSync(k, v);
        } else {
          // 移除创建的文件
          unlinkSync(k);
        }
      });

      if (cfg.config) {
        const { config } = cfg || {};
        // 留下需要的配置
        return {
          resolve: config?.resolve,
          server: config?.server,
          css: config?.css,
        };
      }

      return null;
    },
  };
}
