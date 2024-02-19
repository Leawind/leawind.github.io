# Docker

## 安装

系统是 ubuntu server 22.04 LTS。

官方有很详细的文档：[Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/)

### 卸载旧版本

```sh:no-order
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done
```

### 添加软件仓库（华为云）

```sh
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

### 安装 docker 软件包

```sh
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### 验证是否安装成功

```sh
sudo docker run hello-world
```

### 设置开机自启

```sh
systemctl enable docker
```

## 常见问题

### 修改默认网桥的网段 IP

默认网段是`172.17.0.1/16`，可能会发生冲突，所以需要手动更改。

编辑或新建配置文件

```sh
vim /etc/docker/daemon.json
```

```json
{
	"bip": "192.168.6.1/24"
}
```
