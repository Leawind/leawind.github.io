# Spark and Hadoop

将 hadoop-3.1.3.tar.gz 压缩包解压到 /usr/local

```bash
sudo tar -zxf ./hadoop-3.1.3.tar.gz -C /usr/local
```

修改文件所有者

```bash
sudo chown -R hadoop /usr/local/hadoop-3.1.3
```

查看版本

```bash
cd /usr/local/hadoop-3.1.3
./bin/hadoop version
```

输出版本号：

```txt
Hadoop 3.1.3
Source code repository https://gitbox.apache.org/repos/asf/hadoop.git -r ba631c436b806728f8ec2f54ab1e289526c90579
Compiled by ztang on 2019-09-12T02:47Z
Compiled with protoc 2.5.0
From source with checksum ec785077c385118ac91aadde5ec9799
This command was run using /usr/local/hadoop/share/hadoop/common/hadoop-common-3.1.3.jar
```



##  配置环境变量

```bash
# /etc/environment
# hadoop
PATH=$PATH:/usr/local/hadoop/bin
```

