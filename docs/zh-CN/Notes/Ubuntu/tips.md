# Tips

## 监控网络流量

```sh
ethstatus -i <网络接口>
```

## 配置网络连接

### 查看网络接口状态

```hs
ip a
ipconfig
lxc network list
networkctl
```

### 使用 netplan 配置网络连接

[Netplan 官方文档](https://netplan.readthedocs.io/en/stable/netplan-tutorial/#using-static-ip-addresses)

进入配置文件目录

```sh
cd /etc/netplan
```

#### 配置无线网络

```sh
vim 00-installer-config-wifi.yaml
```

```yaml
# This is the network config written by 'subiquity'
network:
    version: 2
    wifis:
        wlp3s0:
            access-points:
                'jxnu_stu': {}
            dhcp4: true
```

应用修改

```sh
netplan apply
```

## 更改 MAC 地址、启用/关闭无线网卡

```sh
sudo apt install macchanger
```

```sh
ip link set dev wlp3s0 down	# 关闭
macchanger -r wlp3s0	# 更改 MAC 地址
ip link set dev wlp3s0 up	# 启用
```

## root 终端颜色

打开`~/.bashrc`认真看注释

```sh
# uncomment for a colored prompt, if the terminal has the capability; turned
# off by default to not distract the user: the focus in a terminal window
# should be on the output of commands, not on the prompt
#force_color_prompt=yes
```

把这一行取消注释即可

```sh
#force_color_prompt=yes
force_color_prompt=yes
```

## 设置 root 用户密码

```
passwd root
```

## 更新

```bash
apt update
```

## 安装常用工具

```bash
apt install openssh_server	# SSH 服务
apt install tree	# tree 命令
apt install vsftpd	# FTP 服务
apt install net-tools	# 网络工具，可以使用 ifconfig 查看 IP 地址
apt install openjdk-8-jdk	# OpenJDK 8
```

## 防火墙

```bash
ufw status	# 查看防火墙状态
ufw enable
ufw disable

```

## 配置启动脚本

`sudo nano /etc/rc.local`

```bash
!/bin/sh -e
#
# rc.local
#
# This script is executed at the end of each multiuser runlevel.
# Make sure that the script will "exit 0" on success or any other
# value on error.
# 这个脚本在每个 multiuser runlevel 的末尾执行。
# 请确保这个脚本在执行成功时返回0 ( "exit 0" )，并且在发生错误时返回任何其他值。
#
# In order to enable or disable this script just change the execution
# bits.
# 要启用或禁用此脚本，修改文件权限的 "执行位" 即可
#
# By default this script does nothing.
# 此脚本默认什么也不做。

# Start SSH server
service ssh start

## Start Website server

## Start Minecraft server

exit 0
```

## 压缩

```bash
# 压缩
tar -czvf compress.tar.gz /home/leawind
# 排除隐藏文件
tar -czvf compress.tar.gz /home/leawind --exclude ./web/[.]*
```

## 解压

```bash
tar -xvf compress.tar.gz
```

## 关机

```sh
shutdown -P now	# 立即关机
reboot	# 立即重启
shutdown -r now # 立即重启
```

## iperf 测网速

服务端

```sh
iperf3 -s
```

客户端

```sh
iperf3 -c leas.x
```

## 时间同步

安装 NTP 服务

```sh
apt install ntp
systemctl enable ntp
systemctl start ntp
```

配置文件位于`/etc/ntp.conf`

## 设置时区

```sh
apt install systemd-timesyncd
```

```sh
timedatectl set-ntp on
```

```sh
timedatectl set-timezone Asia/Shanghai
```

## 查看目录占用空间大小

```sh
du -h
```

## 配置内核参数

查看参数值

```sh
sysctl fs.inotify.max_user_watches
```

编辑文件`/etc/sysctl.conf`或在`/etc/sysctl.d/`下新建文件`local.conf`

```
fs.inotify.max_user_watches=1048576
```

应用更改

```sh
sysctl -p
```

## 查看 socket

```sh
$> ss -h
Usage: ss [ OPTIONS ]
       ss [ OPTIONS ] [ FILTER ]
   -h, --help          this message
   -V, --version       output version information
   -n, --numeric       don't resolve service names
   -r, --resolve       resolve host names
   -a, --all           display all sockets
   -l, --listening     display listening sockets
   -o, --options       show timer information
   -e, --extended      show detailed socket information
   -m, --memory        show socket memory usage
   -p, --processes     show process using socket
   -i, --info          show internal TCP information
       --tipcinfo      show internal tipc socket information
   -s, --summary       show socket usage summary
       --tos           show tos and priority information
       --cgroup        show cgroup information
   -b, --bpf           show bpf filter socket information
   -E, --events        continually display sockets as they are destroyed
   -Z, --context       display process SELinux security contexts
   -z, --contexts      display process and socket SELinux security contexts
   -N, --net           switch to the specified network namespace name

   -4, --ipv4          display only IP version 4 sockets
   -6, --ipv6          display only IP version 6 sockets
   -0, --packet        display PACKET sockets
   -t, --tcp           display only TCP sockets
   -M, --mptcp         display only MPTCP sockets
   -S, --sctp          display only SCTP sockets
   -u, --udp           display only UDP sockets
   -d, --dccp          display only DCCP sockets
   -w, --raw           display only RAW sockets
   -x, --unix          display only Unix domain sockets
       --tipc          display only TIPC sockets
       --vsock         display only vsock sockets
   -f, --family=FAMILY display sockets of type FAMILY
       FAMILY := {inet|inet6|link|unix|netlink|vsock|tipc|xdp|help}

   -K, --kill          forcibly close sockets, display what was closed
   -H, --no-header     Suppress header line
   -O, --oneline       socket's data printed on a single line
       --inet-sockopt  show various inet socket options

   -A, --query=QUERY, --socket=QUERY
       QUERY := {all|inet|tcp|mptcp|udp|raw|unix|unix_dgram|unix_stream|unix_seqpacket|packet|netlink|vsock_stream|vsock_dgram|tipc}[,QUERY]

   -D, --diag=FILE     Dump raw information about TCP sockets to FILE
   -F, --filter=FILE   read filter information from FILE
       FILTER := [ state STATE-FILTER ] [ EXPRESSION ]
       STATE-FILTER := {all|connected|synchronized|bucket|big|TCP-STATES}
         TCP-STATES := {established|syn-sent|syn-recv|fin-wait-{1,2}|time-wait|closed|close-wait|last-ack|listening|closing}
          connected := {established|syn-sent|syn-recv|fin-wait-{1,2}|time-wait|close-wait|last-ack|closing}
       synchronized := {established|syn-recv|fin-wait-{1,2}|time-wait|close-wait|last-ack|closing}
             bucket := {syn-recv|time-wait}
                big := {established|syn-sent|fin-wait-{1,2}|closed|close-wait|last-ack|listening|closing}
```

## 在 ubuntu server 上安装图形界面

```bash
sudo apt install ubuntu-desktop # 安装桌面，这个过程可能比较漫长
systemctl set-default graphical.target # 启用图形界面
systemctl set-default multi-user.target # 禁用图形界面
shutdown -r now # 重新启动
```

## ibus 输入法问题

按下 ctrl+. 时会出现 <underline>e</underline>
执行 `ibus-setup` 即可

## 调整触摸板速度

[How to change 2-finger touchpad scroll speed on Ubuntu 22.04](https://askubuntu.com/questions/1413750/how-to-change-2-finger-touchpad-scroll-speed-on-ubuntu-22-04)

### 找到触摸板备的 id

```bash
$ xinput list|grep -i touch
⎜   ↳ MSFT0001:00 04F3:31AD Touchpad          	id=17	[slave  pointer  (2)]
```

可以看到 id=17

### 修改触摸板速度

```bash
xinput set-prop 17 "libinput Scrolling Pixel Distance" 50
```

`17` 是触摸板设备 id
`50` 是速度，值越大，滚动速度越慢
最大值是 50

## 开机时自动执行脚本

首先确保启用`rc-local`服务。

`rc-local`服务可能默认未启用，需要修改相关配置文件

```sh
vim /lib/systemd/system/rc-local.service
```

在末尾添加

```ini
[Install]
WantedBy=multi-user.target
```

保存后重载`systemd`配置

```sh
systemctl daemon-reload
```

**确保文件`/etc/rc.local`有执行权限**，然后启用 `rc-local` 服务

```sh
systemctl enable rc-local.service
```

在`/etc/rc.local`文件中添加启动脚本即可。

示例：

```sh
#!/bin/bash

echo Starting startup Script

# read iptables config
iptables-restore < /etc/iptables/rules.v4

# enable WLAN
ip link set wlp3s0 up

exit 0

```

注意其中应该尽量使用绝对路径

## 命令的别名

别名可以在 `~/.bash_aliases` 中定义。

```sh
# Alias definitions.
# You may want to put all your additions into a separate file like
# ~/.bash_aliases, instead of adding them here directly.
# See /usr/share/doc/bash-doc/examples in the bash-doc package.

if [ -f ~/.bash_aliases ]; then
	. ~/.bash_aliases
fi
```

## 允许/禁止被 ping

在文件`/etc/sysctl.conf`末尾添加一行

```sh
net.ipv4.icmp_echo_ignore_all = 0
```

1 表示忽略 icmp 包，外界就无法 ping 通本机
