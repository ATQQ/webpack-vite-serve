import { existsSync, readFileSync } from 'fs';
import path from 'path';
import type { PluginOption } from 'vite';
import {
  getCWD, getEntryName, getReqURL, isMPA,
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

/**
 * 初始化模板内容（替换 <%varName%> 一些内容）
 */
function initTpl(tplStr:string, data = {}, ops?:{
  backup?:string
  matches?:RegExp[]
}) {
  const { backup = '', matches = [] } = ops || {};
  // match %Name% <%Name%>
  return [/<?%=?(.*)%>?/g].concat(matches).reduce((tpl, r) => tpl.replace(r, (_, $1) => {
    const keys = $1.trim().split('.');
    const v = keys.reduce((pre, k) => (pre instanceof Object ? pre[k] : pre), data);
    return (v === null || v === undefined) ? backup : v;
  }), tplStr);
}

export default function HtmlTemplatePlugin(): PluginOption {
  return {
    name: 'wvs-html-tpl',
    apply: 'serve',
    configureServer(server) {
      const { middlewares: app } = server;
      app.use(async (req, res, next) => {
        const { pathname } = getReqURL(req);
        const htmlAccepts = ['text/html', 'application/xhtml+xml'];
        const isHtml = !!htmlAccepts.find((a) => req.headers?.accept?.includes(a));
        if (isHtml) {
          const originHtml = loadHtmlContent(pathname);
          const html = await server.transformIndexHtml(req.url, originHtml, req.originalUrl);
          res.end(html);
          return;
        }
        next();
      });
    },
    transformIndexHtml(html) {
      // data可以传入模板中包含的一些变量
      // TODO:可以再此处获取webpack配置，做自动转换
      return initTpl(html, {
        PUBLIC_URL: '.',
        BASE_URL: './',
        htmlWebpackPlugin: {
          options: {
            title: 'App',
          },
        },
      });
    },
  };
}
