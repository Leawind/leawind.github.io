# NPM Package

一个 npm 包的可能的用途包括：

1. 被其他包引用，例如`json5`,`md5`,`http`等
1. 安装以后可以在命令行中执行特定命令，例如`cnpm`,`verdaccio`等

## 准备

### 开发环境

推荐使用 vscode 作为 node 的开发环境。
3070
https://code.visualstudio.com/

### 注册账号

如果需要把包公开发布到 npm registry，那么需要注册一个 npm 账号，用于发布包。
如果不需要发布，则不必注册账号。

https://www.npmjs.com/signup

### 安装 node

https://nodejs.org/en

建议选择 LTS 版本。

### 在本地命令行登录 npm

```bash
$> npm login
```

输入用户名，根据提示操作即可。

## 开始

### 新建文件夹

为你的包创建一个目录，并执行 `npm init` 命令。

```bash
$> mkdir mynpmpkg
$> cd mynpmpkg
$> npm init
```

现在可以根据提示填写相关信息，也可以一路回车，之后再手动修改`package.json`中的信息。

### 编辑包的基本信息

打开`package.json`文件即可编辑

## 开发

### package.json 结构

参考 https://docs.npmjs.com/cli/v10/configuring-npm/package-json
