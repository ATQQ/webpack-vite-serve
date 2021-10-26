# webpack-vite-serve
为webpack项目提供开发环境下使用Vite启动的能力

相关文章：[webpack项目接入Vite的通用方案介绍](https://sugarat.top/technology/learn/webapck2vite.html)

包管理工具推荐使用[pnpm](https://pnpm.io/)
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
### Supports - 支持进度
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

### Build Local - 本地构建

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
```

### Running - 运行示例
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

## Dev - 本地开发
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