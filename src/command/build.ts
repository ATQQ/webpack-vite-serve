import spawn from 'cross-spawn';
import { CommandOptions } from '../types';

export default function buildCommand(options:CommandOptions) {
  const {
    framework = '', mpa, spa, debug,
  } = options;

  // 不支持两个参数同时设定
  if (mpa && spa) {
    throw new Error('only support set mpa or spa');
  }
  process.env.SPA = spa ? 'true' : '';
  process.env.MPA = mpa ? 'true' : '';
  process.env.framework = framework.toUpperCase();

  const configPath = require.resolve('./../config/vite.js');
  const params = ['build', '--config', configPath];

  if (debug) {
    // 标志debug
    process.env.DEBUG = 'true';

    // vite debug
    params.push('--debug');
    if (typeof debug === 'string') {
      params.push(debug);
    }
  }

  const viteService = spawn('vite', params, {
    cwd: process.cwd(),
    stdio: 'inherit',
  });

  viteService.on('close', (code) => {
    process.exit(code);
  });
}
