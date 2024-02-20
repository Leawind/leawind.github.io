---
search: false
---

# Issue

## .gitattributes

```
* text=auto

*.ts             text eol=lf
*.js             text eol=lf
*.py             text eol=lf
*.java           text eol=lf
*.kts            text eol=lf
*.gradle         text eol=lf
*.properties     text eol=lf
*.json           text eol=lf
*.yaml           text eol=lf
*.toml           text eol=lf
*.md             text eol=lf
*.html           text eol=lf
*.htm            text eol=lf
*.css            text eol=lf

*.sln  text eol=crlf

*.png  binary
*.jpg  binary
*.ico  binary
*.gif  binary
*.mp3  binary
*.ogg  binary
```

## Roadmap?

## 文档中应当介绍如何彻底卸载该模组

## issue labels

https://github.com/vuejs/vitepress/labels

## GUI 中实现 2D 物理效果

## 飞行时转向相机落点会怎样

## pick 距离过远时 MISS

## 奔跑时迅速转向

## 使用数据包来决定手持瞄准的物品

## 在配置屏幕中显示内置匹配规则

## 首次使用的教程

添加选项：启用教程

第一次完成教程后会自动将该选项禁用

## 放置床的方向

## 添加配置：玩家 pickResult 与相机 pickResult 不同时，禁用交互

<hr />

## 记住第三人称状态

## 望远镜

## 相机远离玩家的速度

默认速度较慢，当玩家移动时，根据移动速度和方向决定速度。

## 捐赠按钮动画

## 使用食物时不自动旋转

## 鼠标停止操作一段时间后，视角跟随玩家移动而转动（视角自动跟随）

## 瞄准时自动从中间切换到两侧视角

https://www.mcmod.cn/class/12699.html

## 加个龙之谷的视角方式

> 因为我童年的 3D 启蒙就是它，很习惯他的人物视角放置

## 角色头部能在角色朝向准星时的一定范围内会看着准星

https://space.bilibili.com/500810858

## 当玩家（实体）视线被挡住时，让玩家（人）知道

射箭，丢末影珍珠或雪球等物品时，当准星瞄准的地方有方块挡住时，准星变成红色的，或弹道预览变成红色

## 像越肩视角的动态准星功能

## 睡觉时的视角

## 弹射物自动瞄准

## 一种新的操作模式

鼠标移动直接控制虚拟玩家旋转，而非控制相机旋转。
实时虚拟玩家视线落点，相机必须保持朝向该落点。
相机与玩家距离为定值，玩家视线与玩家到相机的射线角度为定值
据此确定相机位置

## 玩家卡顿

实际上玩家移动并不卡顿，是相机的平滑移动卡顿。玩家距离相机比较近，所以看起来玩家会卡顿。

卡顿程度与玩家移动速度成正相关，与渲染帧率成负相关。

### 原因

经过测试，获取的玩家实体眼睛坐标是准确的，相机坐标的写入也正常。

-   [x] float 精度不足
-   [ ] 时间精度不足

### 解决方法

-   [x] Client tick
-   [x] 独立 tick
-   [x] 过去一些 tick 的平均时间
-   [x] getSmooth(k) -> value + lerp(k, 0, value-lastValue)
-   [x] 双重 smooth
-   [√] Client tick + 插值。这个办法似乎解决了卡顿问题，但仍有一点瑕疵。
-   [ ] 限制 smooth 值变化的加速度

## 移植到其他版本

-   [ ] 1.20.4
-   [ ] 1.20.3
-   [ ] 1.20.2
-   [ ] 1.20.1
-   [ ] 1.20
-   [ ] 1.19.4
-   [x] 1.19.2
-   [ ] 1.18.2
-   [ ] 1.16.5
-   [ ] 1.12.2
-   [ ] 1.8.9

## 常量选取

## 可能需要兼容的模组

|     |     |                  |                        |
| --- | --- | ---------------- | ---------------------- |
|     |     | EpicFight        | 史诗战斗               |
|     |     | TAC              | 永恒枪械               |
|     |     | YSM              |                        |
|     |     |                  | 输入法冲突修复         |
|     |     |                  | rlcraft 这一类的整合包 |
|     |     |                  | dawn craft             |
|     |     |                  | 沉浸式载具             |
|     |     | Better Combat    |                        |
|     |     | Do a Barrel Roll |                        |
|     |     |                  | 瓦尔基里               |
|     |     | SWEM             |                        |
|     |     | Parcool          |                        |
|     |     |                  |                        |
|     |     |                  |                        |
|     |     |                  |                        |

## Platforms

| Name           | Usages                             | my url                                              | proj url                                                          |     |     |     |     |     |     |
| -------------- | ---------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------- | --- | --- | --- | --- | --- | --- |
| Github         | code,publish,download,donate,issue | https://github.com/LEAWIND                          | https://github.com/LEAWIND/Third-Person                           |     |     |     |     |     |     |
| Bilibili       | publish,issue                      | https://space.bilibili.com/314412977                | https://www.bilibili.com/video/BV1Fg4y1R7ow                       |     |     |     |     |     |     |
| afdian         | donate                             | https://afdian.net/a/Leawind                        |                                                                   |     |     |     |     |     |     |
| Patreon        | donate                             | https://www.patreon.com/user/about?u=67288519       | https://www.patreon.com/                                          |     |     |     |     |     |     |
| Gitee          | code,publish,download,donate       | https://gitee.com/leawind                           |                                                                   |     |     |     |     |     |     |
| Modrinth       | publish,download                   | https://modrinth.com/user/leawind                   |                                                                   |     |     |     |     |     |     |
| CurseForge     | publish,download,issue             | https://www.curseforge.com/members/leawind/projects | https://www.curseforge.com/minecraft/mc-mods/leawind-third-person |     |     |     |     |     |     |
| mcmod          | publish,issue                      | https://www.mcmod.cn/class/12699.html               | https://www.mcmod.cn/class/12699.html                             |     |     |     |     |     |     |
| mcbbs          | publish,issue                      |                                                     |                                                                   |     |     |     |     |     |     |
| Youtube        | publish,issue                      |                                                     |                                                                   |     |     |     |     |     |     |
| X              | publish,issue                      |                                                     |                                                                   |     |     |     |     |     |     |
| Twitch         | ?                                  |                                                     |                                                                   |     |     |     |     |     |     |
| Facebook       |                                    |                                                     |                                                                   |     |     |     |     |     |     |
| Tiktok         |                                    |                                                     |                                                                   |     |     |     |     |     |     |
| Instagram      |                                    |                                                     |                                                                   |     |     |     |     |     |     |
| Reddit         |                                    |                                                     |                                                                   |     |     |     |     |     |     |
| NeteaseMyWorld | earn money                         |                                                     |                                                                   |     |     |     |     |     |     |
|                |                                    |                                                     |                                                                   |     |     |     |     |     |     |

## Urls

[Leawind 的第三人称视角](http://doc-notedev.s/ThirdPersonPerspective)

[一个新的第三人称越肩视角模组~](https://www.bilibili.com/video/BV1Fg4y1R7ow)

[★ 我的世界 ★ 更好第三人称 国产模组](https://www.bilibili.com/video/BV17Q4y1x7ow)

[Top 10 Minecraft Mods (1.20.2) - 2023](https://www.youtube.com/watch?v=hBpVYqfyeNM&t=57s)

[26 New Minecraft Mods You Need To Know! (1.20.1, 1.20.2)](https://www.youtube.com/watch?v=m872UIPrD-A)
