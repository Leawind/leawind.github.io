# SSH 服务配置

## 生成密钥对

```bash
ls -l ~/.ssh/id_*.pub	# 检查密钥是否存在
ssh-keygen -t rsa -b 4096 -C "leawind@yeah.net"	# 使用电子邮件地址作为注释生成一个新的4096位SSH密钥对
```

## 配置 sshd

```bash
cd /etc/ssh
ls
sudo cp sshd_config sshd_config.backup	# 备份配置文件
sudo nano sshd_config
```

## 启动

```bash
service ssh status	# 查看ssh 服务状态
service ssh restart	# 重启ssh服务
ifconfig	# 查看本机 IP 地址
```

## 自动配置免密登录

### Linux 客户端

```bash
ssh @vnas.net	# 连接ssh
ssh-copy-id leawind@vnas.net	# 配置免密登录
```

### Windows 客户端

```bat
cd %USERPROFILE%\.ssh
# 生成密钥对
ssh-keygen
# 一路回车
# 打开 id_rsa.pub 文件，把其中内容复制到服务器上 ~/.ssh/authorized_keys 文件末尾
# 然后就可以免密登录了
ssh @vnas.net
```

```bat
cd %USERPROFILE%
type .ssh\id_rsa.pub | ssh leawind@192.168.3.6 "cat >> .ssh/authorized_keys”
type %USERPROFILE%\.ssh\id_rsa.pub | ssh leawind@192.168.3.6 "cat >> .ssh/authorized_keys"
```
