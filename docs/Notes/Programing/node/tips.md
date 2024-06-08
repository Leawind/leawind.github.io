# Node (NPM)

## `package.json` 中的脚本

### 跨平台移除整个目录

[`rimraf`](https://github.com/isaacs/rimraf) 相当于 `rm -rf`

### 并行或顺序执行脚本

利用 npm-run-all 提供的 CLI 工具

-   [`run-s`](https://github.com/mysticatea/npm-run-all/blob/master/docs/run-s.md) 顺序执行
-   [`run-p`](https://github.com/mysticatea/npm-run-all/blob/master/docs/run-p.md) 并行执行

## 常用的包

-   **rimraf** 用于在脚本中删除目录，相当于 `rm -rf`
-   **[npm-run-all](https://github.com/mysticatea/npm-run-all)** 用于在脚本中并行或顺序运行多个 npm 脚本的

## 查看安装的全局 npm 包

```sh
npm list -g --depth=0
```

## 更新全局 npm 包

```sh
npm update -g
```
