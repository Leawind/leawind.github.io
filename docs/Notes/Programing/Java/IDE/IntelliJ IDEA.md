# IntelliJ IDEA

## links

[JAVA 菜鸟教程](https://www.runoob.com/java/java-environment-setup.html)

[IDEA 官方教程](https://www.jetbrains.com/zh-cn/idea/resources/)
​[创建java程序](https://www.jetbrains.com/help/idea/creating-and-running-your-first-java-application.html)

## 工程和模块 Project & Module

### 工程 [Project](https://www.jetbrains.com/help/idea/creating-and-managing-projects.html)

在IntelliJ IDEA中，项目可以帮助您在单个单元中组织源代码、测试、使用的库、构建说明和个人设置。 IntelliJ IDEA中的项目是一个shell，它将模块组合在一起，提供模块之间的依赖关系，并存储模块间共享的配置。

工程有2种类型：

* directory-based, 常用

* file-based, 现在已经不用了

### 模块 [Module](https://www.jetbrains.com/help/idea/creating-and-managing-modules.html)

模块由任意个内容根目录和一个模块文件组成。

内容根目录是保存代码的文件夹。

模块文件(.iml)用来储存模块配置。

## IDEA 快捷键

* Alt + Ins 新建一个包
* Shift + Enter 另起一行
* Ctrl + J	显示所有模板
* Alt + 4	聚焦到 | 关闭 命令行窗口
* Ctrl + Shift + Alt + S	打开项目结构窗口
* db ctrl	运行 anything
* db shift	Anything
* Ctrl + Alt + L	格式化代码
* Shift + F10 运行配置
* Shift + F9 调试配置
* F8	步过，不会进入函数
* F7	步入，会进入自定义函数内部
* Shift + F8，步出，运行到方法调用处
* Alt + F9	运行到光标处

## 编译

编译好的文件默认会放在out文件夹，其中 production 是直接运行产生的字节码文件

## 打包

File -> Project Structure -> ARchive 设置打包规则

