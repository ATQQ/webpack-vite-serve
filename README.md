# webpack-vite-serve
为webpack项目提供开发环境下使用Vite启动的能力

相关文章：[webpack项目接入Vite的通用方案介绍](https://sugarat.top/technology/learn/webapck2vite.html)

包管理工具推荐使用[pnpm](https://pnpm.io/)

TODO: 核心能力正在建设中
## Usage
### Installed
```sh
npm install webpack-vite-serve -D
# or
yarn add webpack-vite-serve -D
# or
pnpm add webpack-vite-serve -D
```

### Command Run
```sh
# devServer
wvs start [options]
```

```json
{
  "scripts": {
    "vite:vue": "wvs start -f vue",
    "vite:react": "wvs start -f react",
    "vite": "wvs start"
  }
}
```

TODO: build 待支持
```sh
# build
wvs build [options]
```
```json
{
  "scripts": {
    "build:vite": "wvs build -f vue -s",
  }
}
```
### Options
* -f,--framework：指定使用的业务框架
* -c,--config: 手动指定webpack配置文件路径
* -s,--spa：按照单页应用目录结构处理
* -m,--mpa：按照多页应用目录结构处理

## Supports
* [x] Vue
* [x] React
* [x] SPA
* [x] MPA
* [ ] build for production
* [ ] merge userConfig
* [ ] config [wp2vite](https://github.com/tnfe/wp2vite)

## Demos
* JS
  * [x] Vue2 SPA
  * [x] React SPA
  * [x] Vue MPA
  * [ ] React MPA
* TS
  * [x] Vue3 SPA
  * [x] React SPA
  * [x] Vue MPA
  * [ ] React MPA

### Build Local

使用pnpm
```sh
npm i -g pnpm
```

安装依赖
```sh
pnpm install
```

构建
```sh
pnpm build
# or
pnpm dev
```
### Run Demos
注：Demo依赖本地的构建产物，需先参照上个步骤进行构建

```sh
# 1
cd demos

# 2
cd js

# 3
cd demoProject

# 4 推荐pnpm
yarn install
  # or
npm install
  # or 
pnpm install

# 5
# run webpack devServer
npm run dev
# run vite devServer
npm run dev:vite
```

## Dev
使用pnpm
```sh
npm i -g pnpm
```

安装依赖
```sh
pnpm install
```

启动
```sh
pnpm dev
```

激活指令
```sh
npm link
```

测试指令
```sh
wvs hello
```