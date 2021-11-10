import type { PluginOption } from 'vite';
import { getEntryFullPath, getEntryName, isMPA } from '../utils';

function getPageEntry(reqUrl) {
  if (isMPA()) {
    const entryName = getEntryName(reqUrl);
    return !!entryName && getEntryFullPath(`src/pages/${entryName}`);
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
