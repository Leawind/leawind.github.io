# MINECRAFT Java Edition: the basis you'd better know

[官方网站 | Minecraft](https://www.minecraft.net/zh-hans)

MC 使用 Java 库 LWJGL 开发。

## 官方启动器

来自官网的这个文件 [MinecraftLauncher.exe](../launcher/MinecraftLauncher.exe)就是官方启动器本器。建议把它单独放在一个文件夹下。
当第一次运行它时，它会在它所在目录生成一个games文件夹然后下载一些文件

### 配置 Installation

新建配置时会有这些项目可以设置：

#### 游戏目录 GAME DIRECTORY

这个目录用来存放该配置的存档等信息。当刚建完这个配置时，A这个“游戏目录”是空的，运行之后，可能会出现这些文件/文件夹:

	+ logs/	运行时产生的日志文件
	+ mods/	用来放模组，这个原版没有的
	+ resourcepacks/	该配置使用的资源包
	+ saves/	用于存放存档
	+ screenshots/	用于存放截图
	+ options.txt	游戏选项，包括 FOV，键位，图形，声音等设置选项
	+ realms_persistence.json	好像是新闻的网址
	+ servers.dat	
	+ servers.dat_old	
	+ usercache.json	这应该是玩家信息，里面有玩家的名称和 UUID

#### 版本 VERSION、分辨率 RESOLUTION

根据需要自行选择，略。

#### java可执行文件|JAVA EXECUTABLE

[Java下载](https://www.oracle.com/java/technologies/javase-downloads.html)

这里需要设置 java 解释器路径。下载 java 解释器（.zip）后可以在 `bin/`文件夹下找到 java.exe 和 javaw.exe 两个文件。可以用 java.exe，但它运行时会有一个多余的窗口，所以一般使用 javaw.exe。

参考:
[Optimising Your Minecraft: Jvm Arguments(2014)](https://xealgaming.net/threads/optimising-your-minecraft-jvm-arguments.4758/)
[Minecraft | Java arguments optimization](https://cassiofernando.netlify.app/blog/minecraft-java-arguments)
[wiki](https://wiki.biligame.com/mc/%E6%95%99%E7%A8%8B/%E7%BC%96%E5%86%99%E5%90%AF%E5%8A%A8%E5%99%A8)
[Stack Overflow: What are the -Xms and -Xmx parameters when starting JVM?](https://stackoverflow.com/questions/14763079/what-are-the-xms-and-xmx-parameters-when-starting-jvm)
[useful](https://xealgaming.net/threads/optimising-your-minecraft-jvm-arguments.4758/page-2)

```
官方启动器默认参数大概是这样的:
-Xmx2G -XX:+UnlockExperimentalVMOptions -XX:+UseG1GC -XX:G1NewSizePercent=20 -XX:G1ReservePercent=20 -XX:MaxGCPauseMillis=50 -XX:G1HeapRegionSize=32M
参数:
	-Xmx    最大允许内存 maximum heap size
	-Xms    初始申请内存 The max memory GC will use.
	-Xmn    最小值 Minimum java heap size.
	-XX:    不明//TODO
		+UnlockExperimentalVMOptions
		+UseG1GC
		G1NewSizePercent=20
		G1ReservePercent=20
		MaxGCPauseMillis=50
		G1HeapRegionSize=32M
```

[Java SE - Downloads | Oracle Technology Network | Oracle](https://www.oracle.com/java/technologies/javase-downloads.html)

### .minecraft 文件夹

[wiki: .minecraft](https://wiki.biligame.com/mc/.minecraft)
.minecraft 文件夹包含 .jar文件、音效、音乐、资源包、个人设置、世界等。在第一次启动启动器时，会自动创建.minecraft文件夹。
[.minecraft 默认位置](C:\Users\LEAWIND\AppData\Roaming\.minecraft)

#### 如何修改.minecraft位置

官方启动器的界面里没有直接提供修改这个文件夹路径的方式。
在 windows下如果需要更改它的位置，有至少2种方法。

一、用 MKLINK 命令创建符号链接，这个方法适用于几乎所有程序。
语法:`MKLINK /J link target`

二、在命令行中启动官方启动器时传入参数
`MinecraftLauncher.exe --workDir="D:\MC\.minecraft"`

#### 目录结构

这里并非所有文件都一定会存在的，有些来自于mod或光影，有些随着版本更新可能也会发生变化。

	+ assets/	一个很重要但不需要动它的文件夹
	+ bin/
	+ config/	@模组的配置文件
	+ libraries/	按照Maven约定打包的各种库（不含POM文件）
	+ logs/	日志
	|	+ latest.log
	+ mods/ @默认配置下的模组文件夹
	+ resourcepacks/	@默认配置下的资源包文件夹
	|	+ "resourcePack".zip	资源包
	+ saves/	@默认配置下的存档文件夹
	|	+ "saveName"/	存档
	+ screenshots/	@默认配置下的截图
	|	+ "YYYY-MM-DD_hh.mm.ss".png
	+ shaderpacks/	@默认配置下的光影文件夹
	|	+ "shader".zip	光影zip压缩文件，也可以是解压后的文件夹
	|	+ "shader".zip.txt	使用该光影后自动生成的配置文件
	+ stats/	统计信息文件夹
	|	+ stats_"userName"_unsent.dat	某玩家的统计信息
	|	+ stats_"userName"_unsent.old
	+ versions/	各个版本的文件
	|	+ "1.16.5"/
	|	|	+ "ver".jar
	|	|	+ "ver".json
	|	+ version_mainfest_v2.json	版本清单文件，有历史上所有版本的信息
	+ webcache/	
	+ hotbar.nbt	在游戏中保存的物品栏
	+ launcher_accounts.json	启动器配置文件
	+ launcher_cef_log.txt	日志
	+ launcher_entitlements.json	启动器配置文件
	+ launcher_gamer_pics.json	启动器配置文件
	+ launcher_log.txt	启动器配置文件
	+ launcher_msa_credentials.json	启动器配置文件
	+ launcher_profiles.json	包含启动器的所有相关设置、档案、选中的用户/档案以及缓存的用户信息（电子邮箱、访问令牌等等）
	+ launcher_setting.json	启动器配置文件
	+ launcher_ui_state.json	启动器配置文件
	+ optionsof.txt	@
	+ optionsshaders.txt	@游戏光影配置文件
	+ replay_pid"int".log	@
	+ updateLog.txt	官方启动器更新日志，用处不大，可以删
	+ usernamecache.json	用户名缓存，里面有用户的 UUID

## JE 存档结构|世界格式

[wiki](https://wiki.biligame.com/mc/%E4%B8%96%E7%95%8C%E6%A0%BC%E5%BC%8F)
一个存档就是一个文件夹，通常文件夹名与存档名相同，但存档名中的 `.` 会被替换为 `_`。

以下是`1.16`的存档结构:

	+ advancements/
	|	+ "player_uuid".json	储存玩家在该世界的进度和已解锁的配方(Since 17w13a)
	+ data/
	|	+ capabilities.dat	
	|	+ idcounts.dat	存储可合成地图这一物品所包括的地图数据[地图物品格式]
	|	+ map_0.dat	存储可合成地图这一物品所包括的地图数据[地图物品格式]
	|	+ raids.dat	主世界中的袭击信息
	+ datapacks/	[数据包]
	+ DIM1/	
	|	+ data/
	|	|	+ raids_end.dat	末地的袭击信息
	|	+ poi/世界内村民特定的床，工作站点和钟。
	|	+ region/	包含末地中的区域信息[Anvil文件格式]
	+ DIM-1/
	|	+ data/
	|	|	+ raids.dat	下界的袭击信息
	|	+ poi/世界内村民特定的床，工作站点和钟。
	|	+ region/	包含下界中的区域信息[Anvil文件格式]
	+ playerdata/	存储玩家信息(Since JE1.7.6)
	|	+ "uuid".dat	玩家的所有个人信息[Player.data格式]
	+ poi/	世界内村民特定的床，工作站点和钟。
	+ region/	包含主世界中的区域信息[Anvil文件格式]
	+ stats/
	|	+ "uuid".json	储存玩家在此世界游玩时的统计(Since JE1.7.2)[统计存储格式]
	+ icon.png	该存档的图标
	+ level.dat	存储关于世界的全局信息。
	+ level.dat_old		level.dat文件在从Alpha世界格式转换为MCRegion和Anvil文件前的备份文件。
	+ session.lock	用于获取最后执行的程序修改这一文件以及访问的权限。

## Skin 皮肤

[皮肤 - Minecraft Wiki，最详细的官方我的世界百科 (fandom.com)](https://minecraft.fandom.com/zh/wiki/皮肤)

[皮肤 - Minecraft Wiki_BWIKI_哔哩哔哩 (biligame.com)](https://wiki.biligame.com/mc/皮肤)

### 制作皮肤

可以使用软件 MCSkin3D 制作皮肤（windows）

## NBT 格式

NBT  Named Binary Tags 二进制命名标签
NBT 是一种树形结构，有二进制文件或文本形式（文本形式类似于JSON）

### 二进制 NBT 文件的查看/编辑

可以使用 VSCode 中的 `NBT Viewer` 扩展查看和编辑 nbt 格式的二进制文件，
或者  [NBTExplorer](https://sourceforge.net/projects/nbtexplorer.mirror/) 。

## resourcepack 资源包

[资源包 - Minecraft Wiki_BWIKI_哔哩哔哩 (biligame.com)](https://wiki.biligame.com/mc/资源包#Java.E7.89.88)

资源包不会改变游戏机制，但能带来不一样的视听体验。
资源包就是一个文件夹或 .zip 文件

### 安装
将资源包放在 `installation/resourcepacks` 文件夹里即可在游戏中启用。
也可以把它放在存档里以和该存档“绑定”

### 资源包结构

	+ pack.mcmeta	资源包元数据
	+ pack.png	图标
	+ assets/
		+ icons/
			+ icon_16x16.png
			+ icon_32x32.png
			+ minecraft.icns
		+ "namespace"/	命名空间
			+ sounds.json	音效
			+ blockstates/	模型
				+ "name".json	方块状态文件
			+ font/	字体
			+ icons/
			+ lang/	语言
			+ models/	模型
			+ particles/	粒子
			+ shaders/	着色器(光影)
			+ sounds/	声音
			+ texts/	文本
				+ credits.txt	开发者名单
				+ end.txt	终末之诗
				+ splashes.txt	游戏闪烁标语
			+ textures/
				+ block/	方块
				+ colormap/	颜色图
				+ effect/	效果
				+ entity/	实体
				+ environment/	环境，包括云、月球、雨、雪、太阳、末地天空
				+ font/	字体
				+ gui/	图形用户界面材质，包括工作台等界面
				+ item/	物品
				+ map/	地图背景，包括定位器地图上的位置标记
				+ misc/	杂项
				+ mob_effect/	effect 效果图标
				+ models/	包括盔甲
				+ painting/	图画
				+ particle/

其中 `pack.meta` 文件是必要的，其格式如下:

```json
{
	"pack": {
        "format_version": 7,
        "description": "Description of this pack"
    }
}
```



### 更改材质

材质放在文件夹`assets/"namespaces"/textures/`中。
材质有多种类型
具体结构可以在版本文件 `版本号.jar`中找到。

### 着色器
相关文件位于`assets/"namespaces"/shaders/`。

#### 制作
这需要学习 GLSL 着色语言。
[wikipedia](https://en.wikipedia.org/wiki/OpenGL_Shading_Language)
[MDN](https://developer.mozilla.org/zh-CN/docs/Games/Techniques/3D_on_the_web/GLSL_Shaders)

## datapack 数据包

数据包可以改变游戏的一些规则。
[wiki: 数据包](https://wiki.biligame.com/mc/%E6%95%B0%E6%8D%AE%E5%8C%85)
[教程/制作数据包](https://wiki.biligame.com/mc/%E6%95%99%E7%A8%8B/%E5%88%B6%E4%BD%9C%E6%95%B0%E6%8D%AE%E5%8C%85)

### 安装

数据包就是一个 文件夹 或 压缩成 zip 文件的文件夹。
文件夹名就是该数据包的名字，最好只含英文字母。
把这个文件夹丢到存档中的 datapacks 内即可使用。

### 数据包结构

数据包中的各文件|文件夹名应当满足 `[0-9a-z_/.\-]+`
但命名空间不能包含`[/.]`
命名方式建议使用蛇形命名法。`name_like_a_snake`

	+ pack.mcmeta	元数据，JSON格式，包含pack_format和description信息
	+ pack.png	该数据包的缩略图
	+ data/	包含一些命名空间
	|	+ "namespace"/	包含数据类型
	|	|	+ advancements/	进度
	|	|	|	+ "advName".json	自定义进度
	|	|	+ functions/	函数
	|	|	|	+ "funcName".mcfunction	自定义mc函数
	|	|	+ loot_tables/	战利品表，决定生物死亡时的掉落物
	|	|	|	+ "tableName".json	自定义战利品表
	|	|	+ predicates/	战利品表谓词
	|	|	+ recipes/	配方
	|	|	|	+ "recipeName".json	自定义配方
	|	|	+ structures/	结构
	|	|	|	+ "structName".nbt	自定义结构
	|	|	+ tags/	标签
	|	|	|	+ blocks/	方块标签
	|	|	|	|	+ "name".json
	|	|	|	+ entity_types/	实体标签
	|	|	|	|	+ "name".json
	|	|	|	+ fluids/	
	|	|	|	+ functions/	函数标签
	|	|	|	|	+ "name".json
	|	|	|	+ items/	物品标签
	|	|	|	|	+ "name".json
	|	+ minecraft/	一个特殊的命名空间
	|	|	+ "folder"/	建议与自己的命名空间同名
	|	|	|	+ "dimName".json	自定义维度

### 函数 Function
[函数-JE](https://wiki.biligame.com/mc/%E5%87%BD%E6%95%B0%EF%BC%88Java%E7%89%88%EF%BC%89)

#### 运行
可以在游戏中执行指令：`/function [命名空间]:[函数名]`

#### 编写
函数文件名就是函数名。
里面是一行一条指令，运行时会在 1 tick 内执行，就像连锁命令方块一样。
可以用 # 注释
不要斜杠
如果出现无限递归的逻辑，游戏会卡住，直到指令执行次数达到`/gamerule maxCommandChainLength`，默认为 65536

## Optifine

[OptiFine Downloads](https://optifine.net/downloads)
通常安装光影前需要先安装 Optifine
Optifine 的安装与 Forge 有点相似，但安装时不需要连网。

### 安装条件

要想成功安装 1.16.5 版本的 Optifine，`.minecraft/versions`中要存在 `1.16.5`文件夹，并存在完整的`1.16.5.jar`和`1.16.5.json`文件（运行一次就有了）。

同时确保`.minecraft/launcher_profiles.json`文件存在。

### 它是如何安装的
在 `libraries`中新建一个`optifine`文件夹并向其中添加一些文件。
在 `version`中新建一个形如`1.16.5-OptiFine_HD_U_G8`的文件夹，并把文件`version/1.16.5/1.16.5.jar`复制进去并改名为`1.16.5-OptiFine_HD_U_G8.jar`，另外还会生成一个相应的 json 文件。

最后还修改`.minecraft/launcher_profiles.json`，
在 "profiles" 中添加一项:
```jsonc
Optifine: {
    "name": "OptiFine",
      "created": "2021-06-09T18:28:11.288Z",
      "type": "custom",
      "lastVersionId": "1.16.5-OptiFine_HD_U_G8",
      "lastUsed": "2021-06-09T18:28:11.288Z",
      "icon": "data:image/png;base64,FWEJIOAIIUGVA="	//base64编码的图片
}
```

。

## shader pack 光影包

//TODO

把光影包放在 shaderpacks 文件夹里就行。

## mods 模组

[Forge Doc: Getting started with Forge](https://mcforge.readthedocs.io/en/latest/gettingstarted/)

[how-to-install-mods](https://www.windowscentral.com/minecraft-java-edition-guide-how-to-install-mods)

### 安装 Forge

[Downloads for Minecraft Forge for Minecraft 1.16.5](https://files.minecraftforge.net/net/minecraftforge/forge/)

安装 mod 前需要先安装 Forge

向.minecraft文件夹中安装 Forge 需要确保文件`launcher_profiles.json`存在。

#### 方法一

[Forge](https://files.minecraftforge.net/net/minecraftforge/forge/index_1.16.5.html)
下载之后得到一个jar文件,它应该长这样`forge-1.12.2-14.23.5.2854-installer.jar`
使用 java 运行： `java -jar forge-****.jar`
然后选择 client install,
设置 .minecraft 文件夹位置
点击 Install 安装，安装过程中会下载一些文件放到`libraries` 和 `versions` 中，还会修改`launcher_profiles.json`文件的内容。
安装完之后在官方启动器里新建配置，会看到那个版本的 forge，选它。
记得设置 java 路径，如果java版本过高可能会无法运行(Game crash)
配置完进入`.minecraft/versioins/`文件夹 
如果已经安装了这个版本的原版，可以把这个版本的 jar 包复制到 forge version 文件夹里去，节省下载时间。
在该配置对应的游戏文件夹(GameDir)内会有这些东西：

	+ config	模组配置
	+ logs	日志
	+ mods	模组文件夹
	+ resourcepacks	资源包
	+ saves	存档
#### 方法二

如果网络状况不太好，上述方法可能无效，因为运行jar包时需要下载一些文件。
可以用[我做的离线安装程序](E:\MC\Dev\forMOD\Forge\OfflineInstaller)，运行之前需要在 config.py 文件里设置一些参数，里边会有提示。

### mod结构
//TODO
一个mod通常是一个 jar 包

### 编写//TODO

官方的 API 文档：
[Forge Documentation (mcforge.readthedocs.io)](https://mcforge.readthedocs.io/en/1.16.x/)

wiki 的mod教程：[Tutorials/Creating Forge mods – Official Minecraft Wiki (fandom.com)](https://minecraft.fandom.com/wiki/Tutorials/Creating_Forge_mods)


这是一个 1.8 的教程：[Minecraft Modding with Forge](https://www.oreilly.com/library/view/minecraft-modding-with/9781491918883/ch01.html#Version_Forge)

[modding.md](../mod/modding.md)

## 第三方启动器

### 有哪些第三方启动器z

* HMCL[hmcl-web-front-vue (huangyuhui.net)](https://hmcl.huangyuhui.net/)
* PCL
* BMCL
* Nsiso[Nsiso启动器 - 我的世界-Minecraft启动器](https://nsiso.com/)
* BakaXL

### 如何制作一个启动器
可以了解一下原理，有助于解决一些小问题，真自己做一个... emmm 属实没必要
[教程/编写启动器 - Minecraft Wiki_BWIKI_哔哩哔哩 (biligame.com)](https://wiki.biligame.com/mc/教程/编写启动器)
[minecraft-launcher-lib · PyPI](https://pypi.org/project/minecraft-launcher-lib/)

## 局域网联机
### 如何开始
房主进入单人游戏后，使用指令 `/publish <port>`
即可对局域网开放，指令会返回端口号。
房主进入命令行，使用  `ipconfig` 命令可以查看 ipv4 地址。
同局域网下的其他玩家可以在多人游戏中直接看到该房间，也可使用直接连接，输入ipv4地址:端口号直接进入。例如 `192.168.82.32:10`

### 命令

`/defaultgamemode survival`
设置默认游戏模式

`/op <Player>`
赋予玩家管理员权限

`/deop <Player>`
取消玩家管理员权限

`/kick <Player> [Reason:str]` 
踢出玩家

`/ban <Player> [Reason:str]`
将玩家列入黑名单，从此该玩家将无法进入服务器

`/ban-ip <Player> [Reason:str]`
把一个IP地址列入黑名单。Player可以是玩家名或IP地址

`/banlist <ips|players>`
显示封禁列表

`/pardon <Player>`
`/pardon-ip <ip addr>`
将玩家从黑名单移除

## 服务器

### 构建服务器

[How to Configure Your Minecraft Server (server.properties) - Knowledgebase - Shockbyte](https://shockbyte.com/billing/knowledgebase/84/How-to-Configure-Your-Minecraft-Server-serverproperties.html)
//TODO

### 反作弊机制

解决不了外挂，就解决用外挂的人。不是所有人都能随便进来。
一旦发现有人使用外挂，将永久封禁其 UUID。
外挂包括但不限于：

	1. 使用外挂程序自动操作键盘或鼠标。
	2. 使用外挂程序修改实体属性。
	3. 使用外挂程序修改环境。
	4. 以非正常手段修改任意玩家储存在服务器的任何信息。
	5. 	使用外挂程序辅助挂机。
	6. 其他可能影响他人游戏体验的行为。


### 进入服务器

进入游戏 > 多人游戏 > 直接连接 > 输入服务器的 IP 地址或域名
可以在命令行中使用ping命令测试该服务器的延迟
我找到了几个延迟相对较小的服务器：
```

purpleprison.org                      178ms
hexicmc.com                           184ms
pixel.mc-complex.com                  178ms
pixelmonrealms.proxy.cosmicdns.com    183ms
mccentral.org                         186ms
```

