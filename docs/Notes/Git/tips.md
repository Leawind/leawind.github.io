# Git Tips

## Git Commit 规范

### commit message 格式

```javascript
<类型>[范围]: <标题>

[主体内容]
```

例如：`fix(admin): k8sProxy反向代理路由修改`

### 类型(必须)

用于说明 git commit 的类别，只允许使用下面的标识

-   feat：新功能（feature）
-   fix：修复 bug，可以是 QA 发现的 BUG，也可以是研发自己发现的 BUG
-   docs：文档（documentation）
-   style：格式（不影响代码运行的变动）
-   refactor：重构（即不是新增功能，也不是修改 bug 的代码变动）
-   perf：优化相关，比如提升性能、体验
-   test：增加测试
-   chore：构建过程或辅助工具的变动
-   revert：回滚到上一个版本
-   merge：代码合并
-   sync：同步主线或分支的 Bug

### 范围(可选)

-   用于说明 commit 影响的范围，例如项目包含多模块，admin、interface、task、job 等
-   多个以`|`分割

### 标题(必须)

-   标题是 commit 目的的简短描述

### 主体内容(可选)

-   用新的空行将“标题”和“主体内容”隔开，Git 会自动识别第一行为摘要
-   主体内容是 commit 目的的详细描述，可以放一些备注、说明等

_注：提交信息应该尽可能准确描述本次提交内容_

## 行结束符问题

[GitHub 文档 - 配置 Git 处理行结束符](https://docs.github.com/zh/get-started/getting-started-with-git/configuring-git-to-handle-line-endings)

`.gitattributes`

```
* text=auto

*.md   text eol=lf
*.html text eol=lf
*.htm  text eol=lf
*.js   text eol=lf
*.css  text eol=lf
*.py   text eol=lf
*.ts   text eol=lf
*.json text eol=lf

*.sln  text eol=crlf

*.png  binary
*.jpg  binary
*.ico  binary
*.gif  binary
```

## 常用命令

| 命令                           | 描述                               |     |
| ------------------------------ | ---------------------------------- | --- |
| git branch -a                  | 查看所有分支                       |     |
| git branch                     | 查看本地分支                       |     |
| git branch -r                  | 查看远程分支                       |     |
| git branch \<name>             | 创建分支，停留在当前分支           |     |
| git switch \<name>             | 切换分支                           |     |
| git switch -c \<name>          | 创建并切换分支                     |     |
| git init                       | 初始化一个 git 仓库                |     |
| git clone \<url>               | clone 一个 git 仓库                |     |
| git add \<file>                | 添加文件到索引库                   |     |
| git commit -m "\<message>"     | 提交更改                           |     |
| git commit -a -m "\<message>"  | 提交更改，自动将所有文件加入暂存区 |     |
| git diff                       | 显示更改                           |     |
| git clone -b \<branch> \<url>  | 克隆指定分支                       |     |
| git clone \<url>               | 克隆默认分支                       |     |
| git reset --hard HEAD          | 丢弃所有更改                       |     |
| git rm -r --cached <file_name> |                                    |     |
|                                |                                    |     |
|                                |                                    |     |
