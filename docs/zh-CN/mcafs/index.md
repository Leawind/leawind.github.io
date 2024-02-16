# MCAFS 

通过提供FTP服务使你可以访问`.minecraft/assets`目录中的资源文件。

[MCAFS npm 包](https://www.npmjs.com/package/mcafs)

## 喵？

Minecraft 的一些资源文件，例如音乐、音效、语言等储存在 `.minecraft/assets` 中，但这些文件的组织形式令人难以直接访问。

而通过本项目提供的 FTP 服务可以方便地访问 `.minecraft/assets` 中的资源。

## 安装

```bash
$> npm install mcafs
```

或

```bash
$> git clone https://github.com/LEAWIND/mcafs.git
$> cd mcafs
$> npm install
```

## 使用方法

```bash
$> mcafs -u localhost:2023
```

输出示例

```bash
$> mcafs -u localhost:2023
[2023-10-05T12:24:32.942] [INFO] MCAFS - Minecraft Assets Directory: C:\Users\LEAWIND\AppData\Roaming\.minecraft\assets
[2023-10-05T12:24:32.983] [INFO] MCAFS - FTP Server is starting at ftp://localhost:2023/
```

使用任意 FTP 客户端即可访问 `ftp://localhost:2023`

## 命令行选项

| flags                        | 默认值                    | 描述                                                                | 可选项                                         |
| ---------------------------- | ------------------------- | ------------------------------------------------------------------- | ---------------------------------------------- |
| -v --version                 |                           | 显示版本号                                                          |                                                |
| -h --help                    |                           | 显示命令帮助                                                        |                                                |
| -d --assertsDir \<assetsDir> | 默认.minecraft/assets位置 | 自定义assets位置                                                    |                                                |
| -u --url \<url>              |                           | URL，例如ftp://0.0.0.0:2023。若指定了此项，则addr和port选项将被忽略 |                                                |
| -a --addr \<addr>            | 127.0.0.1                 | IP 地址                                                             |                                                |
| -p --port \<port>            | 21                        | FTP 端口号                                                          |                                                |
| -l --logLevel \<logLevel>    | info                      | 日志级别                                                            | all,trace,debug,info,warn,error,fatal,mark,off |

## Minecraft Assets 系统介绍

Minecraft 的不同版本之间有很多资源文件（包括音乐、音效、语言翻译等）是相同的，例如C418-cat唱片的音乐文件在许多版本中都存在。

如果玩家每安装一个新版本，就要将该版本所使用的所有资源文件整个重新下载一遍，在硬盘中要占用崭新的一块空间来存储它，那么这对于网络资源、硬盘资源都会造成极大的浪费。

所以 Minecraft 的解决办法是使用一个统一的虚拟文件系统来存储这些资源文件。

`indexes/`目录中包含若干索引文件，每个索引文件表示一个文件集合，索引文件中包含了该集合中每个文件的虚拟路径、索引和文件大小等信息。

例如：`1.10.json`的部分内容如下
```json
{
	"objects": {
		"icons/icon_32x32.png": {
			"hash": "92750c5f93c312ba9ab413d546f32190c56d6f1f",
			"size": 5362
		},
		"icons/minecraft.icns": {
			"hash": "991b421dfd401f115241601b2b373140a8d78572",
			"size": 114786
		},
		"minecraft/icons/icon_16x16.png": {
			"hash": "bdf48ef6b5d0d23bbb02e17d04865216179f510a",
			"size": 3665
		}
	}
}
```

通过mcafs提供的FTP服务，可以通过`/1.10/icons/icon_32x32.png`访问示例中那个大小为5362Byte的文件。
