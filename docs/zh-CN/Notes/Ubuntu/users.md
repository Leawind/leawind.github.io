# 用户和用户组

## 相关命令

### `useradd`

`useradd`命令默认创建三无用户：无主目录，无密码，无系统 shell

### `adduser`

`adduser`命令会询问用户要创建的用户的相关信息。

```bash
adduser cmpt -uid 2001 -gid 2001 --home /home/cmpt
```

### `passwd`

管理用户密码

### `usermod`

修改用户信息

### `chsh`

设置用户登录 shell

### `chfn`

设置用户全名和其他注释

### `chage`

设置用户过期时间和密码有效期等

### `chown`

设置文件所属的用户或用户组

## 相关文件

-   `/etc/passwd`
-   `/etc/shadow` 这才是用户密码的相关信息
-   `/etc/sudoers` 建议使用`visudo`进行编辑，快捷键和 nano 一样

### `/etc/passwd`

文件名是“密码”，但里面没有密码，只有用户信息。其中每一列的含义如下

| 列  | 含义           | 示例                                             |
| --- | -------------- | ------------------------------------------------ |
| 1   | 用户名         | root                                             |
| 2   | 占位符，无意义 | x                                                |
| 3   | UID，用户 ID   | 0                                                |
| 4   | GID，组 ID     | 0                                                |
| 5   | 注释           | 逗号分隔。全名,房间号,工作手机号,家庭手机号,其他 |
| 6   | 主目录         | /home/leawind                                    |
| 7   | 登录 shell     | /bin/bash                                        |

#### `/etc/sudoers`

管理员权限

## 用户属性

### 用户所有相关属性

TODO

`$user`用户名
`$fullname`用户全名
`$homedir`主目录
`$shell`登录 Shell

| 描述                     | 查询状态                | 编辑                                    | 示例                                                   |                           |     |
| ------------------------ | ----------------------- | --------------------------------------- | ------------------------------------------------------ | ------------------------- | --- |
| 锁定账户，锁定后无法登录 | `passwd -S $user        | cut -d' ' -f2` L 表示已禁用，P 表示启用 | `usermod -L $user`锁定账户，`usermod -U $user`解锁账户 | `usermod -L admin`        |
| 注释                     |                         |                                         |                                                        |
| 全名                     | `grep $user /etc/passwd | cut -d: -f5                             | cut -d, -f1`查询用户全名                               | `chfn -f $fullname $user` |     |
| 密码                     | `grep $user /etc/shadow | cut -d: -f2`查询用户密码的密文          | `passwd $user`修改密码，`passwd -d $user`清除密码      |                           |
| 主目录                   | `grep $user /etc/passwd | cut -d:-f6`查询用户的主目录             | `usermod -d $homedir $user`设置用户主目录              |                           |
| 登录 Shell               | `grep $user /etc/passwd | cut -d:-f7`查询用户的主目录             | `chsh -s $shell $user`                                 | `chsh -s /bin/bash admin` |
| 管理员权限               | `sudo -l -U $user`      |                                         |                                                        |
| 用户 ID（UID）           | `id -u $user`           |                                         |                                                        |
| 用户组 ID（GID）         |                         |                                         |                                                        |
| 账号过期日期             |                         |                                         |                                                        |
| 密码最小使用天数         |                         |                                         |                                                        |
| 密码最大等待天数         |                         |                                         |                                                        |
| 警告期                   |                         |                                         |                                                        |
| 不活动期                 |                         |                                         |                                                        |
| 上次登录时间             |                         |                                         |                                                        |
| 上次密码更改时间         |                         |                                         |                                                        |

# 用户和用户组的关系

TODO

# 用户组

## 相关命令

### `groupadd [options] $group`

创建用户组

### `groupdel [options] $group`

删除用户组

### `groupmod [options] $group `

修改用户组

### `chgrp [OPTION] ... $group $file`

修改文件的用户组
