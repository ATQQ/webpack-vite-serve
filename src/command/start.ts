import spawn from 'cross-spawn';

export default function startCommand(options:{[key:string]:string}) {
  const { framework = '' } = options;
  process.env.framework = framework.toUpperCase();
  const configPath = require.resolve('./../config/vite.js');
  const viteService = spawn('vite', ['--host', '0.0.0.0', '--config', configPath], {
    cwd: process.cwd(),
    stdio: 'inherit',
  });

  viteService.on('close', (code) => {
    process.exit(code);
  });
  // console.log(config);
}
