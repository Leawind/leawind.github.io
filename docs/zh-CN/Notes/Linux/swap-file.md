# 交换文件

## 创建 swap 文件

创建一个 8GB 大小的文件

```bash
sudo mkdir /swaps
sudo dd if=/dev/zero of=/swaps/swapfile count=1024 bs=8MiB
```

## 修改文件所有者和权限

```bash
sudo chown -R root:root /swaps
sudo chmod -R 0600 /swaps
```

## 将刚创建的交换文件设置为交换分区

```bash
sudo mkswap /swaps/swapfile
```

## 启用交换分区

```bash
sudo swapon /swaps/swapfile
```

## 添加到 `/etc/fstab`

在 fstab 文件中添加条目，以便每次开机时自动挂载交换文件

先备份

```bash
sudo cp /etc/fstab /etc/fstab.bak
```

再在文件末尾添加一行

```fstab
/swaps/swapfile	none	swap	sw	0	0
```

## 检查

```bash
# 查看内存情况
free -wht
```

### 查看交换文件

```sh
swapon -s
```

### 禁用所有交换文件

```sh
swapoff -a
```
