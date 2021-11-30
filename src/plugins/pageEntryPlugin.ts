import type { PluginOption } from 'vite';
import path from 'path';
import { getEntryFullPath, getPageName, isMPA } from '../utils';

function getPageEntry(reqUrl) {
  if (isMPA()) {
    const pageName = getPageName(reqUrl);
    return !!pageName && getEntryFullPath(`src/pages/${pageName}`);
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
      // 添加 / ,避免非一级路由查找文件错误
      // case场景：/index/second => index/src/main
      // right：/index/second => src/main
      return html.replace('</body>', `<script type="module" src="${path.join('/', entry)}"></script>
        </body>
        `);
    },
  };
}
