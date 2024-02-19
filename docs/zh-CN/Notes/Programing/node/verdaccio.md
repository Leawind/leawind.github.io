# Verdaccio

https://www.npmjs.com/package/verdaccio

轻量级本地私有 npm 仓库

## 安装

```sh
npm i -g verdaccio
```

启动服务

```
verdaccio
```

然后可以在浏览器中访问`http://localhost:4873`

配置文件位于`~/verdaccio/config.yaml`

## 配置 systemd 服务

https://verdaccio.org/zh-cn/docs/server-configuration/#using-systemd

首先找到`node_modules`位置

```sh
(base) leawind@leas:~/.nvm/versions/node/v20.9.0$ npm ls -g
/home/leawind/.nvm/versions/node/v20.9.0/lib
├── corepack@0.20.0
├── mcafs@1.0.1
├── mdless@2.0.1
├── npm@10.2.4
├── nrm@1.2.6
├── verdaccio-htpasswd@10.5.5
└── verdaccio@5.27.0
```

找到其中准备好的`service`文件，复制到系统相应目录即可

注意修改路径

```sh
sudo cp /usr/lib/node_modules/verdaccio/systemd/verdaccio.service
```

```sh
systemctl daemon-reload
```

## 配置缓存

类似的有[registry-sync](https://www.npmjs.com/package/registry-sync#registry-sync)

```sh
vim /home/leawind/verdaccio/config.yaml
```

### 缓存目录

`~/verdaccio/storage`
