## Conda

### 下载

[Latest Miniconda installer links](https://docs.conda.io/projects/miniconda/en/latest/)

```sh
# 官方
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
# 清华镜像
wget https://mirrors.tuna.tsinghua.edu.cn/anaconda/miniconda/Miniconda3-latest-Linux-x86_64.sh

```

### 安装

```sh
bash ./Miniconda3-latest-Linux-x86_64.sh
```

安装完后重载配置文件

```sh
source ~/.bashrc
```

检查

```sh
$> conda --version
conda 23.10.0
```

### 配置镜像

```sh
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/bioconda/
conda config --set show_channel_urls yes
```

### 使用

查看已存在的环境

```sh
conda env list
```

可以在[官网](https://www.python.org/doc/versions/)查询所有 python 版本号

创建环境

```sh
conda create -n py35 python=3.5
```
