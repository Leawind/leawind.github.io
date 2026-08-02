---
title: 玩家指南
---

# 玩家指南

## 安装前需要知道的事

这是一个**仅客户端**模组，服务器不需要安装它。请下载与 Minecraft 版本和加载器完全匹配的文件，并同时安装必需的 [Perspective API]。Fabric 版本还需要 Fabric API。

配置界面依赖 [Yet Another Config Lib（YACL）]，但 YACL 是可选依赖；没有 YACL 时，视角和快捷键等核心功能仍可使用。Fabric 用户可以额外安装 [Mod Menu]，便于从模组列表打开配置界面。

## 进入视角

视角的选择由 Perspective API 负责。默认情况下使用原版视角切换键（通常是 `F5`）：短按可在可用视角间切换，长按可以打开视角轮盘。

切换到 _Leawind 的第三人称_ 视角后，本模组的相机和交互功能才会启用。回到第一人称或原版第三人称时，本模组不会继续接管这些行为。

## 配置文件

配置文件位于：

```text
.minecraft/config/leawind_third_person.json
```

手动编辑配置文件前请退出游戏；运行中的客户端会定期保存设置，可能覆盖正在编辑的文件。若文件损坏或来自不兼容的 beta 版本，模组会回退到默认设置。

## 常见问题

- 按 F5 没有看到这个视角：检查该视角是否被 Perspective API 的切换器禁用。
- 没有配置按钮：安装 YACL；没有 YACL 不代表模组核心功能失效。
- 第三人称下准星或交互目标不符合预期：确认当前确实处于本模组视角，并检查“第三人称准星”和“探测起点”设置。模组会遵守玩家的交互距离，不会扩大可交互范围。

[Perspective API]: https://modrinth.com/mod/perspective-api
[Yet Another Config Lib（YACL）]: https://modrinth.com/mod/yacl
[Mod Menu]: https://modrinth.com/mod/modmenu
