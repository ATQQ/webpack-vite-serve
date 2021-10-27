/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import { URL } from 'url';
import type { Connect } from 'vite/dist/node';
import ejs from 'ejs';

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
