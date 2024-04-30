# Systemd 系统和服务管理

参考[腾讯云 - 可能是史上最全面易懂的 Systemd 服务管理教程](https://cloud.tencent.com/developer/article/1516125)

## `/etc/systemd`目录结构

在 `/etc/systemd/` 目录下，包含了一系列子目录和配置文件，用于配置 `systemd` 系统和用户服务的行为。

| 路径                          | 描述                                                                   |
| ----------------------------- | ---------------------------------------------------------------------- |
| `/etc/systemd/system/`        | 存储系统级别的服务单元文件和配置文件，定义系统启动和运行过程中的服务。 |
| `/etc/systemd/user/`          | 存储用户级别的服务单元文件和配置文件，定义用户登录后的服务和行为。     |
| `/etc/systemd/system.conf`    | 包含系统级别的 `systemd` 配置设置，用于配置全局的 `systemd` 行为。     |
| `/etc/systemd/user.conf`      | 包含用户级别的 `systemd` 配置设置，用于配置用户级别的 `systemd` 行为。 |
| `/etc/systemd/logind.conf`    | 用于配置 `systemd` 的 `logind` 服务，负责用户登录和会话的管理。        |
| `/etc/systemd/journald.conf`  | 用于配置 `systemd-journald` 服务，负责 `systemd` 的日志系统。          |
| `/etc/systemd/resolved.conf`  | 用于配置 `systemd-resolved` 服务，负责 `systemd` 的域名解析服务。      |
| `/etc/systemd/timesyncd.conf` | 用于配置 `systemd-timesyncd` 服务，负责 `systemd` 的时间同步服务。     |

## 自定义服务

用户自定义服务文件通常位于`/etc/systemd/system/*.service`

在本示例中，服务的名称是`mcafs`

首先创建并编辑文件

```sh
vim /etc/systemd/system/mcafs.service
```

```ini
[Unit]
Description=Minecraft Assets FTP Server

[Service]
Type=simple
ExecStart=mcafs
User=leawind

[Install]
WantedBy=default.target

```

重新加载服`systemd`配置

```sh
sudo systemctl daemon-reload
```

启用服务

```sh
systemctl enable mcafs.service
```

手动启动服务

```sh
systemctl start mcafs.service
```

检查服务状态

```sh
systemctl status mcafs.service
```

重新加载配置文件，重启服务，查看服务状态

```sh
systemctl daemon-reload; systemctl restart mcafs.service; systemctl status mcafs.service
```
