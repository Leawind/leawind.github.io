# FRP 内网穿透

[Github](https://github.com/fatedier/frp)
[官方文档](https://gofrp.org/zh-cn/docs/)

## TCP 示例

使用 FRP 可以将某个本地端口映射到云端服务器的某个端口

服务端`frps.toml`

```toml
bindPort = 8020
log.to = "console"
```

客户端 `frpc.toml`

```toml
serverAddr = "110.41.142.84"
serverPort = 8020

[[proxies]]
name = "Minecraft server"
type = "tcp"
localIP = "127.0.0.1"
localPort = 8000
remotePort = 25565
```
