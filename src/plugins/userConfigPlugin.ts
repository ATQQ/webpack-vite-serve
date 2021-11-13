import type { PluginOption } from 'vite';
import { getUserConfig } from '../utils';

export default function UserConfigPlugin(): PluginOption {
  return {
    name: 'wvs-config',
    async config(cfg, env) {
      const userConfig = await getUserConfig(env);
      return {
        ...userConfig.config,
      };
    },
  };
}
