import { existsSync, readdirSync } from 'fs';
import path from 'path';

import type { PluginOption } from 'vite';
import { getCWD, getEntryName, isMPA } from '../utils';

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
  if (isMPA()) {
    const entryName = getEntryName(reqUrl);
    return !!entryName || getEntryFullPath(`src/pages/${entryName}`);
  }
  // 其它场景跟MPA处理类似

  // 默认SPA
  const SPABase = 'src';
  return getEntryFullPath(SPABase);
}

export default function pageEntryPlugin(): PluginOption {
  return {
    name: 'wvs-page-entry',
    apply: 'serve',
    transformIndexHtml(html, ctx) {
      const entry = getPageEntry(ctx.originalUrl);
      if (!entry) {
        return html;
      }
      return html.replace('</body>', `<script type="module" src="${entry}"></script>
        </body>
        `);
    },
  };
}
