# 磁盘和分区管理

如果还没安装系统，可以使用 Gparted 工具管理计算机中的硬盘分区。
将 Gparted 安装到 U 盘，从该 U 盘启动计算机即可。

## 查看磁盘空间

### `df`

```sh
df -h
```

```txt
Filesystem      Size  Used Avail Use% Mounted on
tmpfs           772M  2.1M  770M   1% /run
/dev/sda2       116G   19G   92G  18% /
tmpfs           3.8G     0  3.8G   0% /dev/shm
tmpfs           5.0M     0  5.0M   0% /run/lock
/dev/nvme0n1    916G   17G  853G   2% /data
/dev/sda1       1.1G  6.1M  1.1G   1% /boot/efi
tmpfs           772M  4.0K  772M   1% /run/user/0
tmpfs           772M  4.0K  772M   1% /run/user/1000
tmpfs           1.0M     0  1.0M   0% /var/snap/lxd/common/ns
```

### `lsblk`

```sh
lsblk
```

```txt
NAME    MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
loop0     7:0    0  63.4M  1 loop /snap/core20/1974
loop1     7:1    0  63.5M  1 loop /snap/core20/2015
loop2     7:2    0 111.9M  1 loop /snap/lxd/24322
loop3     7:3    0  53.3M  1 loop /snap/snapd/19457
loop4     7:4    0  40.9M  1 loop /snap/snapd/20290
sda       8:0    0 119.2G  0 disk
├─sda1    8:1    0     1G  0 part /boot/efi
└─sda2    8:2    0 118.2G  0 part /
nvme0n1 259:0    0 931.5G  0 disk /data
```

## 查看文件所在分区

```bash
df .
```

```txt
Filesystem     1K-blocks     Used Available Use% Mounted on
/dev/sda2      121399984 19755424  95431596  18% /
```

## 挂载分区

```bash
mount -o rw,remount /	# 重新挂载 /
```

## 查看分区标识

使用 `blkid`可以查看一个设备的 UUID（宇宙唯一标识符）。

## 开机自动挂载

编辑`/etc/fstab`文件

```
# <file system>                           <mount point>      <type>  <options>                                                   <dump>  <pass>
# <文件系统>                               <挂载点>             <类型>  <选项>                                                       <dump>  <pass>

# Root
UUID=1fb0cf5e-2fbd-44eb-b131-1a59f4b49d36    /               ext4    errors=remount-ro                                                0  1

# EFI
UUID=3274-35E0                               /boot/efi       vfat    defaults      0       1

# Other
UUID=C0F64505F644FCE2                        /D              auto    nosuid,nodev,nofail,x-gvfs-show,x-gvfs-name=11-SSD-0             0  0
UUID=46603D58603D5043                        /C              auto    nosuid,nodev,nofail,x-gvfs-show,x-gvfs-name=Windows-SSD          0  0

# Swap file
# 69793218560 Bytes = 65GiB
/swap/swapfile   none    swap    sw    0    0

```
