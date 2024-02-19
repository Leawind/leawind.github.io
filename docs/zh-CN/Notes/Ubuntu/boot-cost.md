# 启动耗时

## 查看启动时各项目耗时

### 直接打印到屏幕

```sh
# 打印到屏幕
systemd-analyze time
```

```txt
         19.270s dev-sda2.device
         11.104s apparmor.service
          9.812s dev-loop1.device
          9.770s dev-loop0.device
          8.221s systemd-journal-flush.service
...
            13ms sys-kernel-debug.mount
            13ms sys-fs-fuse-connections.mount
            12ms plymouth-quit-wait.service
            10ms sys-kernel-config.mount
             8ms snapd.socket
```

### 生成 svg 流水线图

```sh
systemd-analyze blame
```

## 对罪孽较重的项目的处理方式

有些服务可以直接禁用，有些不适合禁用的可以延迟启动，也就是在系统启动完后等待一段时间再启动。

### 可以禁用的服务

-   ufw
-   apport 应用程序崩溃时弹出提示
-   avahi-daemon
-   cups
-   cups-browsed
-   network-manager
-   unattended-upgrades
-   whoopsie

### apt-daily 服务

这个服务用于自动更新软件包，可以延迟启动。

```bash
sudo systemctl edit apt-daily.timer
```

```ini
# apt-daily timer configuration override
[Timer]
OnBootSec=15min
OnUnitActiveSec=1d
AccuracySec=1h
RandomizedDelaySec=30min
```

### 启动时卡住 A start job is running for Network to be configured

启动时卡在这：

```
A start job is running for Network to be configured ...
```

解决办法：修改初始化失败后的尝试及等待时间

修改配置文件 `/etc/systemd/system/network-online.target.wants/systemd-networkd-wait-online.service`

```sh
vim /etc/systemd/system/network-online.target.wants/systemd-networkd-wait-online.service
```

在`server`中添加一行

```ini
TimeoutStartSec=4sec
```
