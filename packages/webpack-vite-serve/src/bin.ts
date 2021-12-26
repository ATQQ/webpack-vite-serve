#!/usr/bin/env node
import chalk from 'chalk';
import { Command } from 'commander';
import { buildCommand, startCommand } from './command';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json');

const program = new Command();

// 设置版号
program.version(pkg.version);

program.command('start')
  .alias('s')
  .option('-c, --config <filepath>', 'set webpack config path')
  .option('-s, --spa', 'as spa application')
  .option('-m, --mpa', 'as mpa application')
  .option('-d, --debug [feat]', 'show debug logs')
  .option('-w, --wp2vite', 'use wp2vite transform webpack config')
  .option('-f, --framework <type>', 'set project type [vue/react]')
  .action(startCommand);

program.command('build')
  .alias('s')
  .option('-c, --config <filepath>', 'set webpack config path')
  .option('-s, --spa', 'as spa application')
  .option('-m, --mpa', 'as mpa application')
  .option('-d, --debug [feat]', 'show debug logs')
  .option('-w, --wp2vite', 'use wp2vite transform webpack config')
  .option('-f, --framework <type>', 'set project type [vue/react]')
  .action(buildCommand);

program.command('hello')
  .action(() => {
    console.log(chalk.blue('--------------------------'));
    console.log(chalk.green(`${chalk.blue('-')}    💐 hello  ${chalk.yellow('wvs')} 💐    ${chalk.blue('-')}`));
    console.log(chalk.blue('--------------------------'));
  });

program.parse(process.argv);
