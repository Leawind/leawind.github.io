# 环境变量

## 用户环境变量

可以在 `~/.bashrc` 中添加。

## 全局环境变量

我的习惯是在`/etc/profile.d/environment.sh`中配置。
这是文件内容示例：

```sh
# Execute when any shell login

# Alias

alias where=whereis
alias cls=clear
alias tn="ping www.baidu.com"
alias trees="tree -if"


# java
export JAVA_HOME_8="/opt/java/jdk1.8.0_351"
export JAVA_HOME_17="/opt/java/jdk-17.0.9"
export JAVA_HOME_21="/opt/java/jdk-21.0.1"
export java8=$JAVA_HOME_8/bin/java
export java17=$JAVA_HOME_17/bin/java
export java21=$JAVA_HOME_21/bin/java

export JAVA_HOME=$JAVA_HOME_17
export JRE_HOME=${JAVA_HOME}/jre
export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib
export PATH=$PATH:${JAVA_HOME}/bin

# mcrcon
export MCRCON_HOME=/opt/mcrcon

# go
export GO_HOME_1_21_4=/opt/go/go1.21.4
export go1214=$GO_HOME_1_21_4/bin/go

export PATH=$PATH:$GO_HOME_1_21_4/bin
```

注意：在 vscode 内置终端登录服务器时，可能不会加载上述文件。但通过 ssh 命令登录时会正常加载。

## 执行命令时临时设置环境变量

```sh
<键>=<值>[ <键>=<值>] <命令>
```
