---
title: Shoulder Surfing Reloaded
---

# Shoulder Surfing Reloaded

> [!NOTE]
>
> 本模组的作者：[Exopandora](https://github.com/Exopandora)
>
> 源码：[github.com/Exopandora/ShoulderSurfing](https://github.com/Exopandora/ShoulderSurfing)。

Shoulder Surfing Reloaded（下文简称 SSR）是一个**仅客户端安装**的越肩第三人称视角模组。它在原版的第一、后三人称以外，增加了一个独立的“越肩”视角；相机会侧移至角色肩部后方，但交互目标、移动方向和显示准星仍可按相机所见来计算。

本文基于仓库中的 `5.0.7` 源码编写；当前构建目标是 Minecraft `26.2`，支持 Fabric、Forge 与 NeoForge。各加载器仅负责启动和少量版本差异，绝大部分功能在 `common` 模块中实现。

## 阅读导航

- [功能总览](./features)：从玩家可见的行为出发说明模组提供什么。
- [相机与输入](./camera-and-input)：越肩相机的位置、碰撞、转向、移动解耦如何实现。
- [交互、准星与渲染](./interaction-and-rendering)：为什么第三人称仍能准确指向目标，以及玩家透明、声音等效果。
- [架构、Mixin 与兼容](./architecture-and-mixins)：启动结构、游戏逻辑注入点、插件 API 和兼容性。

## 一句话理解实现

原版第三人称通常以玩家本体的视线和中心准星为基准；SSR 将“用于看世界的相机”和“用于角色朝向/移动的玩家”分离，并在必要处把原版从玩家眼睛出发的射线改成由相机语义构造的射线。因而它需要同时介入相机、鼠标、玩家输入、方块/实体拾取、HUD 和实体渲染，而不是只改一个相机坐标。

> [!WARNING]
>
> 模组会在客户端改变角色朝向和移动输入。与严格反作弊服务器联机时，行为可能被判定为异常；这也是项目 README 明确提示的限制。
