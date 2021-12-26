import {
  rmdirSync, writeFileSync, readFileSync,
} from 'fs';
import path from 'path';
import type { PluginOption, ResolvedConfig } from 'vite';
import {
  getEntryFullPath, getEntryHtml, getMpaPageEntry, isMPA, resolved,
} from '../utils';

const tempHtmlName = '.wvs_temp_index.html';
export default function BuildPlugin(): PluginOption {
  const entry = [];

  // 构建开始前配置entry
  if (isMPA()) {
    entry.push(...getMpaPageEntry());
  } else {
    // 单页应用
    entry.push({
      entryName: 'index',
      entryHtml: 'public/index.html',
      entryJs: getEntryFullPath('src'),
    });
  }
  const htmlContentMap = new Map();
  let userConfig:ResolvedConfig = null;
  return {
    name: 'wvs-build',
    apply: 'build',
    configResolved(cfg) {
      userConfig = cfg;
    },
    config() {
      const input = entry.reduce((pre, v) => {
        const { entryName, entryHtml, entryJs } = v;
        const html = getEntryHtml(entryHtml, path.join('/', entryJs));
        const htmlEntryPath = resolved(path.parse(entryJs).dir, tempHtmlName);
        // 存储内容
        htmlContentMap.set(htmlEntryPath, html);
        // eslint-disable-next-line no-param-reassign
        pre[entryName] = htmlEntryPath;
        return pre;
      }, {});
      return {
        build: {
          rollupOptions: {
            input,
          },
        },
      };
    },
    load(id) {
      if (id.endsWith('.html')) {
        return htmlContentMap.get(id);
      }
      return null;
    },
    resolveId(id) {
      if (id.endsWith('.html')) {
        return id;
      }
      return null;
    },
    // 构建完成后
    closeBundle() {
      const { outDir } = userConfig.build;
      // 目录调整
      entry.forEach((e) => {
        const { entryName, entryJs } = e;
        const outputHtmlPath = resolved(outDir, path.parse(entryJs).dir, tempHtmlName);
        writeFileSync(resolved(outDir, `${entryName}.html`), readFileSync(outputHtmlPath));
      });
      // 移除临时资源
      rmdirSync(resolved(outDir, 'src'), { recursive: true });
    },
  };
}
