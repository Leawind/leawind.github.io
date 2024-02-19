# 安装

[nvm](https://github.com/nvm-sh/nvm)是一个 node 的版本管理器，可以安装并快速切换各种版本的 node。

npm 是 node 包管理器，会随着 node 一同安装。

nrm 是 npm 的镜像源管理工具，用于快速切换 npm 源

## 安装 NVM

nvm 可以用来管理多个不同版本的 node

### Windows

windows 系统在 github 仓库 [nvm-windows](https://github.com/coreybutler/nvm-windows/releases) 上下载对应版本的安装文件 `nvm-setup.exe`

安装完成后检查是否安装完毕

```bat
nvm -v
1.1.11
```

### Ubuntu

#### 安装 nvm

可能需要先修改 hosts 才连得上

```txt
199.232.96.133 raw.githubusercontent.com
```

然后下载安装脚本并安装

```sh
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
# 或
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
```

```sh
source ~/.bashrc
```

#### 配置镜像

使用 nvm 安装 node 的速度很慢，通过环境变量配置镜像：

打开用户配置文件

`vim ~/.bashrc`

在末尾添加以下内容

```sh
# NVM taobao mirror
export NVM_NODEJS_ORG_MIRROR=http://npm.taobao.org/mirrors/node
```

更新环境变量

`source ~/.bashrc`

## 配置 nvm 镜像

nvm 默认下载源在国外，可以设置为淘宝镜像

配置文件位于`%USERPROFILE%\AppData\Roaming\nvm\settings.txt`

在其中添加以下内容即可

```txt
node_mirror: https://npm.taobao.org/mirrors/node/
npm_mirror: https://npm.taobao.org/mirrors/npm/
```

## 通过 nvm 安装 node

查看所有可安装的版本

[Node.js -- Previous Releases](https://nodejs.org/en/about/previous-releases)

```sh
nvm ls-remote
```

直接安装最新的 LTS（长期支持）版本

```sh
nvm install lts
```

安装指定版本

```sh
nvm install v18.12.1
```

安装完查看当前 npm 版本

```sh
npm -v
10.1.0
```

## 配置 npm 镜像

由于 npm 的服务器在国外，所以直接使用 npm 安装 package 时速度非常慢。需要使用某些国内镜像。

如下所示，使用 npm 命令时可以用`--registry`参数指定镜像源，但这样并不方便

```sh
npm install -g mcafs --registry=https://registry.npm.taobao.org
```

### 安装镜像管理器 nrm

```sh
npm install -g nrm --registry=https://registry.npm.taobao.org
```

查看所有可选择的源

```sh
nrm ls
* npm ---------- https://registry.npmjs.org/
  yarn --------- https://registry.yarnpkg.com/
  tencent ------ https://mirrors.cloud.tencent.com/npm/
  cnpm --------- https://r.cnpmjs.org/
  taobao ------- https://registry.npmmirror.com/
  npmMirror ---- https://skimdb.npmjs.com/registry/
```

测试源

```sh
nrm test npm
```

切换源

```sh
nrm use taobao
```

添加源

```sh
nrm add tb https://registry.npm.taobao.org
```

### 安装 cnpm (不推荐)

```sh
npm install -g cnpm --registry=https://registry.npm.taobao.org
added 440 packages in 27s
```

执行结果如下

```sh
npm install -g cnpm --registry=https://registry.npm.taobao.org
added 440 packages in 27s
```

从此，几乎所有 npm 命令都可以使用 cnpm 代替，除了`npm publish`以外。

## 安装 npm 包

假设要安装的包名是`mcafs`，则在命令行中执行`npm install --global mcafs`或`npm i -g mcafs`即可。
