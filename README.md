# webpack-vite-serve
为webpack项目提供一键接入Vite的能力

相关文章：[webpack项目接入Vite的通用方案介绍](https://sugarat.top/technology/learn/webapck2vite.html)

包管理工具推荐使用[pnpm](https://pnpm.io/)
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
* [x] -f,--framework：指定使用的业务框架 (`vue`，`react`)
* [x] -s,--spa：按照单页应用目录结构处理 `src/${entryJs}`
* [x] -m,--mpa：按照多页应用目录结构处理 `src/pages/${entryName}/${entryJs}`
* [ ] -c,--config: 手动指定webpack配置文件路径

其中`entryJs`匹配命名规则`/(index|main)\.[jt]sx?$/`
## Agreement
工程目录约定
### SPA
| Pages Dir |    Html Template    |     Entry Js     |
| :-------: | :-----------------: | :--------------: |
|   `src`   | `public/index.html` | `src/${entryJs}` |

```sh
* public
  * index.html
* src
  * main.ts
```
### MPA
|  Pages Dir  |              Html Template               |              Entry Js               |
| :---------: | :--------------------------------------: | :---------------------------------: |
| `src/pages` | `src/pages/${pageName}/${pageName}.html` | `src/pages/${entryName}/${entryJs}` |
|             |    `src/pages/${pageName}/index.html`    |                  -                  |
|             |           `public/index.html`            |                  -                  |

```sh
* public
  * index.html
* src
  * pages
    * pageName1
      * main.js
      * pageName.html
    * pageName2
      * index.ts
      * index.html
```
## Supports
* [x] Vue
* [x] React
* [x] SPA
* [x] MPA
* [x] build for production
* [x] merge userConfig
* [ ] config transform[wp2vite](https://github.com/tnfe/wp2vite)
* [ ] 通过插件提供配置`htmlTemplate`与`entryJs`的能力

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

### Run Demos

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

## Local
### Dev
使用pnpm
```sh
npm i -g pnpm
```

安装依赖
```sh
pnpm install
```

编译
```sh
pnpm dev
```

激活指令（全局）
```sh
npm link
```

测试指令
```sh
wvs hello
```

### Build

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