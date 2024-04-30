# MySQL

## 安装

### Windows

进入[官网的下载页面](https://dev.mysql.com/downloads/mysql/)，选择 mysql 版本和系统版本。

#### 通过压缩包手动安装

选择 `ZIP Archive` 下载压缩包并解压。

我的路径是`D:\Program_env\mysql\MySQL\mysql-8.1.0-winx64`

在该路径下创建配置文件`my.ini`

```ini
[mysqld]
port=3306
; mysql 的安装目录
basedir=D:/Program_env/mysql/MySQL/mysql-8.1.0-winx64
; mysql数据库的数据的存放目录
datadir=D:/MINE/Data/SQLDataBase
;
secure-file-priv=D:/Program_env/mysql/export

; 允许最大连接数
max_connections=32
max_connect_errors=10

; 创建新表时将使用的默认存储引擎
default-storage-engine=INNODB
; 服务器字符集
character-set-server=utf8mb4

[client]
port=3306
; 默认字符集
default-character-set=utf8mb4


[mysql]
default-character-set=utf8mb4


```

在命令行中执行初始化，并记下密码。

```bat
D:\Program_env\mysql\workdir>mysqld --initialize --user=leawind --console
2023-10-15T07:12:43.058173Z 0 [System] [MY-015017] [Server] MySQL Server Initialization - start.
2023-10-15T07:12:43.065836Z 0 [System] [MY-013169] [Server] D:\Program_env\mysql\MySQL\mysql-8.1.0-winx64\bin\mysqld.exe (mysqld 8.1.0) initializing of server in progress as process 22832
2023-10-15T07:12:43.089950Z 1 [System] [MY-013576] [InnoDB] InnoDB initialization has started.
2023-10-15T07:12:43.398161Z 1 [System] [MY-013577] [InnoDB] InnoDB initialization has ended.
2023-10-15T07:12:44.959296Z 6 [Note] [MY-010454] [Server] A temporary password is generated for root@localhost: hh%29<zoK?z,
2023-10-15T07:12:47.318374Z 0 [System] [MY-015018] [Server] MySQL Server Initialization - end.

D:\Program_env\mysql\workdir>


```

以管理员权限启动命令行

```bat
D:\MC\MCJE>mysqld -install
Service successfully installed.

D:\MC\MCJE>net start MySQL
MySQL 服务正在启动 ...
MySQL 服务已经启动成功。

D:\MC\MCJE>
```

#### 通过 MSI 安装

略

### Ubuntu

[参考](https://zhuanlan.zhihu.com/p/610793026)

```sh
sudo apt install mysql-server
```

查看服务状态

```sh
(base) leawind@lea:~$ sudo systemctl status mysql
● mysql.service - MySQL Community Server
     Loaded: loaded (/lib/systemd/system/mysql.service; enabled; vendor preset: enabled)
     Active: active (running) since Thu 2023-12-21 00:48:38 CST; 57s ago
    Process: 32517 ExecStartPre=/usr/share/mysql/mysql-systemd-start pre (code=exited, status=0/SUCCESS)
   Main PID: 32525 (mysqld)
     Status: "Server is operational"
      Tasks: 38 (limit: 9117)
     Memory: 365.5M
        CPU: 1.320s
     CGroup: /system.slice/mysql.service
             └─32525 /usr/sbin/mysqld

Dec 21 00:48:37 lea.s systemd[1]: Starting MySQL Community Server...
Dec 21 00:48:38 lea.s systemd[1]: Started MySQL Community Server.
```

查看版本

```sh
(base) leawind@lea:~$ mysql --version
mysql  Ver 8.0.35-0ubuntu0.22.04.1 for Linux on x86_64 ((Ubuntu))
```

安全安装

```sh
sudo mysql_secure_installation
```

根据提示操作即可。

```sql
mysql> SELECT user,authentication_string,plugin,host FROM mysql.user;
+------------------+------------------------------------------------------------------------+-----------------------+-------------+
| user             | authentication_string                                                  | plugin                | host        |
+------------------+------------------------------------------------------------------------+-----------------------+-------------+
| debian-sys-maint | $A$005$.Qv>5nlxNgH|X`!Z8oQXrhC6v5lcb/u22x0ghxsJjCs5Nqds.9xc6CHcYAhiA | caching_sha2_password | localhost   |
| mysql.infoschema | $A$005$THISISACOMBINATIONOFINVALIDSALTANDPASSWORDTHATMUSTNEVERBRBEUSED | caching_sha2_password | localhost   |
| mysql.session    | $A$005$THISISACOMBINATIONOFINVALIDSALTANDPASSWORDTHATMUSTNEVERBRBEUSED | caching_sha2_password | localhost   |
| mysql.sys        | $A$005$THISISACOMBINATIONOFINVALIDSALTANDPASSWORDTHATMUSTNEVERBRBEUSED | caching_sha2_password | localhost   |
| root             |                                                                        | auth_socket           | localhost   |
+------------------+------------------------------------------------------------------------+-----------------------+-------------+
6 rows in set (0.00 sec)

mysql>
```

#### 配置文件

配置文件位于 `/etc/mysql/mysql.conf.d/mysqld.cnf`

未完待续
