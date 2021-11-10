import { existsSync, readFileSync } from 'fs';
import path from 'path';
import type { PluginOption } from 'vite';
import {
  getCWD, getEntryName, isMPA, transformTpl,
} from '../utils';

/**
 * 获取原始模板
 */
function loadHtmlContent(reqPath) {
  // 兜底页面
  const pages = [path.resolve(__dirname, '../../public/index.html')];

  // 单页/多页默认 public/index.html
  const tplPath = 'public/index.html';
  pages.unshift(path.resolve(getCWD(), tplPath));

  // 多页应用可以根据请求的 路径 作进一步的判断
  if (isMPA()) {
    const entryName = getEntryName(reqPath);
    if (entryName) {
    // src/pages/${entryName}/${entryName}.html
    // src/pages/${entryName}/index.html
    // public/${entryName}.html
      pages.unshift(path.resolve(getCWD(), `public/${entryName}.html`));
      pages.unshift(path.resolve(getCWD(), `src/pages/${entryName}/index.html`));
      pages.unshift(path.resolve(getCWD(), `src/pages/${entryName}/${entryName}.html`));
    }
  }
  // TODO：根据框架的配置寻找

  const page = pages.find((v) => existsSync(v));
  return readFileSync(page, { encoding: 'utf-8' });
}

export default function HtmlTemplatePlugin(): PluginOption {
  return {
    name: 'wvs-html-tpl',
    apply: 'serve',
    configureServer(server) {
      const { middlewares: app } = server;
      app.use(async (req, res, next) => {
        const htmlAccepts = ['text/html', 'application/xhtml+xml'];
        const isHtml = !!htmlAccepts.find((a) => req.headers?.accept?.includes(a));
        if (isHtml) {
          const originHtml = loadHtmlContent(req.url);
          const html = await server.transformIndexHtml(req.url, originHtml, req.originalUrl);
          res.end(html);
          return;
        }
        next();
      });
    },
    transformIndexHtml(html) {
      // data可以传入模板中包含的一些变量
      return transformTpl(html);
    },
  };
}
