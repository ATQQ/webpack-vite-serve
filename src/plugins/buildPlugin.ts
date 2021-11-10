import {
  rmdirSync, writeFileSync, readFileSync, unlinkSync,
} from 'fs';
import path from 'path';
import type { PluginOption } from 'vite';
import {
  getEntryFullPath, getEntryHtml, getMpaEntry, isMPA, resolved,
} from '../utils';

const tempHtmlName = '.wvs_temp_index.html';
export default function BuildPlugin(): PluginOption {
  const entry = [];

  // 构建开始前配置
  if (isMPA()) {
    entry.push(...getMpaEntry());
  } else {
    // 单页应用
    entry.push({
      entryName: 'index',
      entryHtml: 'public/index.html',
      entryJs: getEntryFullPath('src'),
    });
  }

  return {
    name: 'wvs-build',
    apply: 'build',
    config() {
      const input = entry.reduce((pre, v) => {
        const { entryName, entryHtml, entryJs } = v;
        const html = getEntryHtml(resolved(entryHtml), path.join('/', entryJs));
        const htmlEntryPath = resolved(path.parse(entryJs).dir, tempHtmlName);
        // 创建临时文件
        writeFileSync(htmlEntryPath, html);
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
    // 构建完成后
    closeBundle() {
      // 目录调整
      entry.forEach((e) => {
        const { entryName, entryJs } = e;
        const outputHtmlPath = resolved('dist', path.parse(entryJs).dir, tempHtmlName);
        writeFileSync(resolved('dist', `${entryName}.html`), readFileSync(outputHtmlPath));
        unlinkSync(resolved(path.parse(entryJs).dir, tempHtmlName));
      });
      // 移除临时资源
      rmdirSync(resolved('dist', 'src'), { recursive: true });
    },
  };
}
