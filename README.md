# webpack-vite-serve
为webpack项目提供开发环境下使用Vite启动的能力

相关文章：[webpack项目接入Vite的通用方案介绍](https://sugarat.top/technology/learn/webapck2vite.html)
## Usage
TODO: 能力建设中
```sh
npm install webpack-vite-serve -D
# or
yarn add webpack-vite-serve -D
# or
pnpm add webpack-vite-serve -D
```

package.json
```json
{
  "scripts": {
    "vite:vue": "wvs start -f vue",
    "vite:react": "wvs start -f react",
    "vite": "wvs start"
  }
}
```

运行
```sh
npm run vite
# or
yarn vite
# or
pnpm vite
```
## 可选参数
* -f,--framework：指定使用的业务框架

## Demos
* JS
  * [x] Vue SPA
  * [x] React SPA
  * [ ] Vue MPA
  * [ ] React MPA
* TS
  * [ ] Vue SPA
  * [ ] React SPA
  * [ ] Vue MPA
  * [ ] React MPA

### 运行demo
```sh
# 1
cd demos

# 2
cd js

# 3
cd demoProject

# 4
yarn install
  # or
npm install

# 5
# run webpack devServer
npm run dev
# run vite devServer
npm run vite
```

## Dev - 本地开发项目
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