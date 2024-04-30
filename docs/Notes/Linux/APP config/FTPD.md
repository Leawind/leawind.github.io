# FTP Server 配置 (VSFTPD)

## 安装

```bash
sudo apt install vsftpd	# 安装 vsftpd
sudo service vsftpd status	# 查看 vsftpd 状态
```

## 配置文件

```bash
cd /etc
sudo cp vsftpd.conf vsftpd.conf.backup	# 备份配置文件
sudo nano vsftpd.conf	# 打开配置文件
```

## 重启

```bash
sudo service vsftpd restart
sudo service vsftpd status
```

## 防火墙

```bash
sudo service ufw stop	# 关闭防火墙
```

