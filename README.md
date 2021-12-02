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
    "build:vite": "wvs build",
  }
}
```
### Options
* [x] -f,--framework `<type>`：指定使用的业务框架 (`vue`，`react`)
  * 此选项将会自动引入框架依赖的插件，react-[@vitejs/plugin-react](https://github.com/vitejs/vite/tree/main/packages/plugin-react#readme)，vu3-[@vitejs/plugin-vue](https://github.com/vitejs/vite/tree/main/packages/plugin-vue#readme)，vue2-[vite-plugin-vue2](https://github.com/underfin/vite-plugin-vue2/tree/master/#readme)
  * 用户可以不开启此选项，自行在用户配置中加入对应的插件
* [x] -s,--spa：按照单页应用目录结构处理 `src/${entryJs}`
  * 不指定 `-s`或`-m`，**默认按单页应用**
* [x] -m,--mpa：按照多页应用目录结构处理 `src/pages/${entryName}/${entryJs}`
* [x] -d,--debug `[feat]`：打印debug信息
* [x] -w,--wp2vite：use [wp2vite](https://github.com/tnfe/wp2vite) 自动转换webpack文件
* [ ] -c,--config: 手动指定vite配置路径
* [ ] -w,--webpack: 手动指定webpack配置路径

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
* [x] SPA - 单页应用
* [x] MPA - 多页应用
* [x] build for production - 打包`wvs build`
* [x] merge userConfig - 自动合并工程根目录的`vite.config.ts`文件
* [x] config transform use [wp2vite](https://github.com/tnfe/wp2vite) - webpack配置转换 !!! 存在一些小小问题，准备PR解决
* [ ] export inline plugin - 对外暴露内置的插件，供单独使用，如处理`htmlTemplate`与`entryJs`的能力

## Demos
* JS
  * [x] Vue2 SPA
  * [x] React SPA
  * [x] Vue MPA
  * [x] React MPA
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