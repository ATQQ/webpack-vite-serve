/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import { URL } from 'url';
import type { Connect } from 'vite/dist/node';
import ejs from 'ejs';
import { existsSync } from 'fs';
import path from 'path';

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
