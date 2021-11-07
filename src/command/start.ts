import spawn from 'cross-spawn';
import { CommandOptions } from '../types';

export default function startCommand(options:CommandOptions) {
  const { framework = '', mpa, spa } = options;

  // 不支持两个参数同时设定
  if (mpa && spa) {
    throw new Error('only support set mpa or spa');
  }
  process.env.SPA = spa ? 'true' : '';
  process.env.MPA = mpa ? 'true' : '';
  process.env.framework = framework.toUpperCase();
  const configPath = require.resolve('./../config/vite.js');
  const viteService = spawn('vite', ['--config', configPath], {
    cwd: process.cwd(),
    stdio: 'inherit',
  });

  viteService.on('close', (code) => {
    process.exit(code);
  });
}
