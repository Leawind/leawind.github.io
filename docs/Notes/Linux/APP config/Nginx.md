# Nginx


## 安装

```sh
apt install nginx
systemctl enable nginx
```

## 基础

### 配置文件路径

[Creating NGINX Plus and NGINX Configuration Files](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/)

|                       |              |      |
| --------------------- | ------------ | ---- |
| /etc/nginx/nginx.conf | 配置文件路径 |      |
|                       |              |      |
|                       |              |      |


## 配置反向代理

所有http服务器都在一台物理设备上，分别监听不同端口。

```sh
vim /etc/nginx/nginx.conf
```

> 配置 verdaccio 的反向代理需要设置verdaccio运行的环境变量
>
> 参考
> https://verdaccio.org/docs/reverse-proxy
> https://verdaccio.org/docs/env

## 参考

[Getting Started](https://www.nginx.com/resources/wiki/start/)

[NGINX Reverse Proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)

https://xuexb.github.io/learn-nginx/guide/
