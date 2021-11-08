// import { existsSync, readFileSync } from 'fs';
// import path from 'path';
import { unlinkSync, rmdirSync, mkdirSync } from 'fs';
import path from 'path';
import type { PluginOption } from 'vite';
import { getCWD, isMPA } from '../utils';
// import {
//   getCWD, getEntryName, isMPA,
// } from '../utils';

// function getHtmlEntryList() {
//   return 'public/index.html';
// }
const resolved = (...p:string[]) => path.resolve(getCWD(), ...p);
const TEMP_PATH = 'wvs_temp';

export default function BuildPlugin(): PluginOption {
  // 构建完成
  process.on('exit', () => {
    // unlinkSync();

    // rmdirSync();
  });

  // 构建开始前配置
  mkdirSync(resolved(TEMP_PATH));
  const buildInput:{[key:string]:string} = {};
  if (isMPA()) {
    
  } else {
    buildInput.index = `${TEMP_PATH}/index.html`;
  }
  return {
    name: 'wvs-build',
    apply: 'build',
    config(cfg, env) {
      return {
        build: {
          rollupOptions: {
            input: {
              index: path.resolve(getCWD(), '.wvs_temp/index.html'),
              second: path.resolve(getCWD(), '.wvs_temp/second.html'),
            },
          },
        },
      };
    },
  };
}
