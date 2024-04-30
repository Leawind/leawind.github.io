# 网络配置

通常使用 `netplan` 配置网络。
以太网口使用 `systemd` 作为渲染器，无线网卡则通常使用 `NetworkManager`，因为 `systemd` 无法设置 AP 模式

## 配置文件

默认有两个配置文件

-   `00-installer-config.yaml`
-   `00-installer-config-wifi.yaml`

两个都删掉，重新创建配置文件。

-   `00-default.yaml`
-   `10-ethernets.yaml`
-   `10-wifi.yaml`

## 配置 LAN 接口

`/etc/netplan/10-ethernets.yaml`

```yaml
network:
    version: 2
    # renderer: NetworkManager
    renderer: networkd
    ethernets:
        enp1s0:
            dhcp4: false
            dhcp6: false
            addresses:
                - 192.168.0.1/24
            nameservers:
                addresses:
                    - 223.5.5.5
                    - 223.6.6.6
                    - 8.8.8.8
        enp2s0:
            ignore-carrier: true
            dhcp4: false
            dhcp6: false
            accept-ra: false
            addresses:
                - 192.168.1.1/24
            nameservers:
                addresses:
                    - 223.5.5.5
                    - 223.6.6.6
                    - 8.8.8.8
```

`/etc/netplan/10-wifi.yaml`

```yaml
network:
    version: 2
    # renderer: NetworkManager
    renderer: networkd
    wifis:
        wlp3s0:
            link-local: [ipv4, ipv6]
            access-points:
                'Mi 10':
                    password: '12345678'
            dhcp4: true
            dhcp6: true
            nameservers:
                addresses:
                    - 223.5.5.5
                    - 223.6.6.6
                    - 8.8.8.8
```

应用更改

```sh
netplan apply
```

## 开启转发

修改内核参数

```sh
vim /etc/sysctl.conf
```

在末尾添加

```
net.ipv4.ip_forward = 1
net.ipv4.conf.all.forwarding = 1
net.ipv6.conf.all.forwarding = 1
```

应用更改

```sh
sysctl -p
```

## DHCP 服务

```sh
apt install isc-dhcp-server
```

编辑配置文件

```
vim /etc/default/isc-dhcp-server
```

修改要启用 DHCP 服务的网卡名称

```
INTERFACESv4="enp1s0"
INTERFACESv6="enp1s0"
```

编辑另一个配置文件

```sh
vim /etc/dhcp/dhcpd.conf
```

```
# ChatGPT 说这的时间单位是秒
default-lease-time 14400;
max-lease-time 28800;

# This declaration allows BOOTP clients to get dynamic addresses,
# which we don't really recommend.
subnet 192.168.0.0 netmask 255.255.255.0 {
        range 192.168.0.2 192.168.0.15
        option routers 192.168.0.254
        option domain-name-servers 8.8.8.8
        option broadcast-address 192.168.0.255
}
```

测试配置文件是否有错误

```sh
dhcpd -t
```

重启 dhcp 服务

```sh
systemctl restart isc-dhcp-server
```

## 配置 UFW 防火墙

若不开启防火墙则可以忽略

```sh
# 允许来自enp1s0 LAN口的数据包从wlp3s0无线网输出
ufw route allow in on enp1s0 out on wlp3s0
ufw route allow in on wlp3s0 out on enp1s0
```

查看防火墙状态

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

## 配置 iptables

在 NAT 表中添加`POSTROUTING`规则，用于处理从本地网络到外部网络的数据包

输出接口是`wlp3s0`。

当匹配规则时，执行动作`MASQUERADE`，也就是修改数据包的源地址，使其看起来像是来自于路由器本身。

```
iptables -t nat -A POSTROUTING -o wlp3s0 -j MASQUERADE
```

保存规则，如果文件不存在可以手动创建

```sh
iptables-save > /etc/iptables/rules.v4
```

查看 NAT 表规则

```sh
iptables -t nat -L -v
```

## 开机自动读取 iptables 配置

系统启动时，位于`/etc/iptables/rules.v4`的配置文件并不会被自动读取，需要执行自定义命令读取。

使用`rc-local.service`服务配置开机自启。

rc-local 服务默认未启用，需要修改相关配置文件

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

编辑`/etc/rc.local`文件，添加以下内容

```sh
# read iptables config
iptables-restore < /etc/iptables/rules.v4
```

## DNS 服务

使用[bind9](https://kb.isc.org/docs/aa-00648)来搭建 DNS 服务

[Configurations and Zone Files](https://bind9.readthedocs.io/en/latest/chapter3.html)

https://www.cnblogs.com/doherasyang/p/14464999.html

```sh
apt install bind9 dnsutils
```

配置文件位于`/etc/bind/`

DNS 服务相关选项`/etc/bind/named.conf.options`

```
options {
	directory "/var/cache/bind";

	listen-on port 53 {
		any;
		192.168.0.1;
		127.0.0.1;
	};
	listen-on-v6 port 53 {
		any;
	};

	recursion yes;
	allow-recursion { any; };
	allow-query { any; };
	allow-transfer { any; };

	forwarders {
		// 本服务器无法解析的域名使用的DNS服务器
		223.5.5.5;
		223.6.6.6;
		8.8.8.8;
	};

	dnssec-validation no;
	max-cache-size unlimited;
};

logging {
	channel all_log {
		file "/var/log/named/all.log" versions 3 size 32M suffix timestamp;
		severity info;
		print-time yes;
		print-category yes;
		print-severity yes;
	};
	category default {
		all_log;
	};
};

```

管理一个顶级域名`s.`

`/etc/bind/named.conf.local`

```
zone "s" {
	type primary;
	file "/etc/bind/zones/db.s";
};
```

`etc/bind/zones/db.s`

```
s.	IN		SOA		ns.s.  leawind (
	20240101	; Serial
	3600		; Refresh
	1800		; Retry
	604800		; Expire
	86400		; Minimum
)

s.			IN	NS		ns.s.

*			IN	A		192.168.0.1		; Any sub domain

lea			IN	A		192.168.0.1		; This Server
ns			IN	A		192.168.0.1		; Name server
```

## 开启热点

// TODO

```sh
nmcli device wifi hotspot ifname wlp3s0 ssid leas.x password vszbiwfoif
```

### 添加无线网卡?

```sh
iw phy phy0 interface add wlv0 type monitor
```

其中`monitor`是网卡工作模式，使用`iw list`查看可用模式

### 删除网卡

```sh
iw dev wlv0 del
```
