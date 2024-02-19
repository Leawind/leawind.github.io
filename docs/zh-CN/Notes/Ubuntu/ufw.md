# 防火墙 (UFW)

启用/关闭防火墙

```sh
systemctl start ufw
systemctl stop ufw
```

监控服务器状态

```sh
watch -n1 ufw status numbered
```

开放 ipv4 和 ipv6 的 TCP 协议的 80 端口

```sh
ufw allow 80/tcp comment '注释'
```

查看规则序号

```sh
ufw status numbered
```

```txt
Status: active

     To                         Action      From
     --                         ------      ----
[ 1] 22/tcp                     ALLOW IN    Anywhere                   # ssh
[ 2] 7890                       ALLOW IN    Anywhere                   # clash
[ 3] Anywhere on wlp3s0         ALLOW FWD   Anywhere on enp1s0
[ 4] Anywhere on enp1s0         ALLOW FWD   Anywhere on wlp3s0
[ 5] 53                         ALLOW IN    Anywhere                   # DNS
[ 6] 8080/tcp                   ALLOW IN    Anywhere                   # Public Website
[ 7] Anywhere                   ALLOW IN    192.168.0.0/24             # Open to LAN
[ 8] 25560:25570/tcp            ALLOW IN    Anywhere                   # Minecraft server|query
[ 9] 22/tcp (v6)                ALLOW IN    Anywhere (v6)              # ssh
[10] 7890 (v6)                  ALLOW IN    Anywhere (v6)              # clash
[11] Anywhere (v6) on wlp3s0    ALLOW FWD   Anywhere (v6) on enp1s0
[12] Anywhere (v6) on enp1s0    ALLOW FWD   Anywhere (v6) on wlp3s0
[13] 53 (v6)                    ALLOW IN    Anywhere (v6)              # DNS
[14] 8080/tcp (v6)              ALLOW IN    Anywhere (v6)              # Public Website
[15] 25560:25570/tcp (v6)       ALLOW IN    Anywhere (v6)              # Minecraft server|query
```

删除序号为 7 的规则

```sh
ufw delete 7
```
