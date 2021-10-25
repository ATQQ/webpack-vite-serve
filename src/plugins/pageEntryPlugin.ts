import { existsSync, readdirSync } from 'fs';
import path from 'path';
import { URL } from 'url';

import type { PluginOption } from 'vite';
import { getCWD } from '../utils';

const resolved = (...p) => path.resolve(getCWD(), ...p);

const getEntryFullPath = (dirPath) => {
  if (!existsSync(resolved(dirPath))) {
    return false;
  }
  // main|index.js|ts|jsx|tsx
  const entryName = /(index|main)\.[jt]sx?$/;
  const entryNames = readdirSync(resolved(dirPath), { withFileTypes: true })
    .filter((v) => {
      entryName.lastIndex = 0;
      return v.isFile() && entryName.test(v.name);
    });
  return entryNames.length > 0 ? path.join(dirPath, entryNames[0].name) : false;
};

function getPageEntry(reqUrl) {
  const { pathname } = new URL(reqUrl, 'http://localhost');

  const isMPA = false;
  // MPA 根据页面路由动态的处理
  if (isMPA) {
    pathname.split('/');
    // 进一步的处理
  }

  // 其它场景跟MPA处理类似

  // SPA
  const SPABase = 'src';
  return getEntryFullPath(SPABase);
}

export default function pageEntryPlugin(): PluginOption {
  return {
    name: 'wvs-page-entry',
    apply: 'serve',
    transformIndexHtml(html, ctx) {
      return html.replace('</body>', `<script type="module" src="${getPageEntry(ctx.originalUrl)}"></script>
        </body>
        `);
    },
  };
}
