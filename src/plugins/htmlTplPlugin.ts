import type { PluginOption } from 'vite';
import {
  getPageName, parseURL, transformTpl, loadPageHtml, getMpaPageEntry, isMPA,
} from '../utils';

export default function HtmlTemplatePlugin(): PluginOption {
  let pages = [];
  if (isMPA()) {
    pages = getMpaPageEntry();
  }
  return {
    name: 'wvs-html-tpl',
    apply: 'serve',
    configureServer(server) {
      const { middlewares: app } = server;
      app.use(async (req, res, next) => {
        const htmlAccepts = ['text/html', 'application/xhtml+xml'];
        const isHtml = !!htmlAccepts.find((a) => req.headers?.accept?.includes(a));
        const { pathname } = parseURL(req.url);
        // 多页应用 自动跳转 302 重定向
        if (isMPA() && isHtml && pathname === '/' && pages[0]) {
          res.statusCode = 302;
          res.setHeader('Location', `/${pages[0]?.entryName || ''}`);
          res.end();
          return;
        }
        if (isHtml) {
          const pageName = getPageName(req.url);
          const originHtml = loadPageHtml(pageName);
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
