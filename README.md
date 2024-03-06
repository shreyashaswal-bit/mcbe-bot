<div align="center">
    <img src="docs/mcbe-bot.png"></img>

# mcbe-bot

基于 [bedrock-protocol](https://github.com/PrismarineJS/bedrock-protocol) 的 Minecraft 基岩版 bot 框架

</div>

> [!NOTE]  
> 该项目正处于开发阶段, 仅支持部分功能.

## 简介

mcbe-bot 是一个基于 bedrock-protocol 的 Minecraft 基岩版 bot 框架, 支持插件系统并拥有相对完整的 TypeScript 支持, 用于开发基岩版自动化 bot.

## 使用方法

### 1. 安装依赖

使用您常用的包管理器安装依赖, 推荐使用 pnpm.

```bash
pnpn install
```

### 2. 运行bot

使用您的包管理器运行启动脚本, 这里以 pnpm 为例.

```bash
pnpm start
```

运行 start 脚本后首先会执行 `pnpm exec tsc` 编译 plugins 目录下的ts插件. 编译完成后项目启动并自动加载插件.

[更多常用脚本](docs/scripts.md)

## 插件开发

mcbe-bot 支持使用 JavaScript 或 TypeScript 编写插件, 并且所有类型的插件都有相对完整的类型提示.

### JavaScript 示例

```js
const { createPlugin } = require("../src/util/createPlugin");
const s = require("../src/util/consoleStyle");

module.exports = createPlugin(({ parser }) => {
    console.log(s.mc`§eHello World!`);
    parser.command("hello-js").action(async () => {
        console.log(s.mc`§eHello JS!`);
    });
});
```

createPlugin 函数仅用于提供类型提示, 也可以直接导出一个函数实现插件.

### TypeScript 示例

```ts
import s from "../src/util/consoleStyle";
import { Context } from "../types/context";

export = ({ parser }: Context) => {
    console.log(s.mc`§1Hello TS!`);
    parser.command("hello-ts").action(async () => {
        console.log(s.mc`§1Hello TS!`);
    });
};
```

也可以使用 createPlugin 函数代替 `{ parser }: Context` 实现类型提示.
