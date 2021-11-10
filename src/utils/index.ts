/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import { URL } from 'url';
import type { Connect } from 'vite/dist/node';
import ejs from 'ejs';
import { existsSync, readdirSync, readFileSync } from 'fs';
import path from 'path';
import { loadConfigFromFile, ConfigEnv } from 'vite';

export function getCWD() {
  return process.cwd();
}

export function getReqURL(request:Connect.IncomingMessage) {
  return new URL(request.url, `http://${request.headers.host}`);
}

/**
* ejs渲染
*/
export function transformEjsTpl(html:string, data = {}, ops = {}) {
  return ejs.render(html, data, ops);
}

export function moduleIsExist(name) {
  try {
    return !!require(name);
  } catch {
    return false;
  }
}

/**
 * 判断是否单页应用
 */
export function isSPA() {
  return process.env.SPA || false;
}

/**
 * 判断是否单页应用
 */
export function isMPA() {
  return !!process.env.MPA || false;
}

/**
 * 根据资源路径，动态获取entryName
 * @param reqUrl 资源路径
 * @@param cfg webpack的配置
 */
export function getEntryName(reqUrl:string, cfg?:any) {
  // TODO：兼容webpack配置 historyRewrites
  const { pathname } = new URL(reqUrl, 'http://localhost');
  const paths = pathname.split('/').filter((v) => !!v);
  const entryName = paths.find((p) => existsSync(path.join(getCWD(), 'src/pages', p)));
  if (!entryName) {
    console.log(pathname, 'not match any entry');
  }
  return entryName || '';
}

export const resolved = (...p) => path.resolve(getCWD(), ...p);

export function getEntryFullPath(dirPath) {
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
}

/**
* 初始化模板内容（替换 <%varName%> 一些内容）
*/
export function transformTpl(tplStr:string, data = {}, ops?:{
 backup?:string
 matches?:RegExp[]
}) {
  // TODO:可以再此处获取webpack配置，做自动转换
  // eslint-disable-next-line no-param-reassign
  data = {
    PUBLIC_URL: '.',
    BASE_URL: './',
    htmlWebpackPlugin: {
      options: {
        title: 'App',
      },
    },
    ...data,
  };
  const { backup = '', matches = [] } = ops || {};
  // match %Name% <%Name%>
  return [/<?%=?(.*)%>?/g].concat(matches).reduce((tpl, r) => tpl.replace(r, (_, $1) => {
    const keys = $1.trim().split('.');
    const v = keys.reduce((pre, k) => (pre instanceof Object ? pre[k] : pre), data);
    return (v === null || v === undefined) ? backup : v;
  }), tplStr);
}

/**
 * 获取构建入口文件的路径
 * @param tplPath 模板文件路径
 * @param entry 入口JS文件路径
 * @param data 模板中的参数
 */
export function getEntryHtml(tplPath:string, entry:string, data?:any) {
  const originHtml = readFileSync(tplPath, { encoding: 'utf-8' });
  const initHtml = transformTpl(originHtml, data);
  const entryHtml = initHtml.replace('</body>', `<script type="module" src="${entry}"></script>
  </body>
  `);
  return entryHtml;
}

/**
 * 获取多页应用的构建配置
 */
export function getMpaEntry(baseDir = 'src/pages') {
  // 获取所有的EntryName
  const entryNameList = readdirSync(resolved(baseDir), { withFileTypes: true })
    .filter((v) => v.isDirectory())
    .map((v) => v.name);

  return entryNameList
    .map((entryName) => ({ entryName, entryHtml: '', entryJs: getEntryFullPath(path.join(baseDir, entryName)) }))
    .filter((v) => !!v.entryJs)
    .map((v) => {
      const { entryName } = v;
      const entryHtml = [
        // src/pages/${entryName}/${entryName}.html
        resolved(`src/pages/${entryName}/${entryName}.html`),
        // src/pages/${entryName}/index.html
        resolved(`src/pages/${entryName}/index.html`),
        // public/${entryName}.html
        resolved(`public/${entryName}.html`),
        // 应用兜底
        resolved('public/index.html'),
        // CLI兜底页面
        path.resolve(__dirname, '../../public/index.html'),
      ].find((html) => existsSync(html));
      return {
        ...v,
        entryHtml,
      };
    });
}

export function getUserConfig(configEnv:ConfigEnv) {
  const configName = 'vite.config';
  const suffix = ['ts', 'js', 'mjs', 'cjs'];
  const configFile = suffix.map((s) => `${configName}.${s}`).find((s) => existsSync(s));
  return loadConfigFromFile(configEnv, configFile);
}
