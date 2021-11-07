import spawn from 'cross-spawn';
import { CommandOptions } from '../types';

export default function buildCommand(options:CommandOptions) {
  process.env.build = 'build';
  const { framework = '', mpa, spa } = options;

  // 不支持两个参数同时设定
  if (mpa && spa) {
    throw new Error('only support set mpa or spa');
  }
  process.env.SPA = `${spa}`;
  process.env.MPA = `${mpa}`;
  process.env.framework = framework.toUpperCase();

  const configPath = require.resolve('./../config/vite.js');

  const viteService = spawn('vite', ['build', '--config', configPath], {
    cwd: process.cwd(),
    stdio: 'inherit',
  });

  viteService.on('close', (code) => {
    process.exit(code);
  });
}
