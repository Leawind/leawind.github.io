---
title: 架构、Mixin 与兼容
---

# 架构、Mixin 与兼容

## 模块与启动

项目分为 `api`、`common`、`compat`、`fabric`、`forge`、`neoforge` 六个 Gradle 子项目。`common` 承载状态机、配置、渲染、Mixin 和内置插件；三个加载器模块注册平台实现和少量特定注入。当前版本的 Fabric/NeoForge 在 `Minecraft` 构造完成后调用 `ShoulderSurfing.init()`，Fabric 还监听客户端配置重载；Forge/NeoForge 的事件注册在平台端完成。

运行期单例 `ShoulderSurfing` 聚合了五个关键对象：独立相机、相机实体渲染器、准星渲染器、对象拾取器和输入处理器。每个客户端 tick，它会处理快捷键、临时第一人称、瞄准状态、相机耦合、自由观察、角色转向，并分发插件事件。

```text
加载器入口 → ShoulderSurfing.init → 加载内置/外部插件 → 创建事件总线
客户端 tick → 输入与状态机 → 相机/角色更新 → 事件处理器
渲染帧 → 原版 Camera/HUD/实体渲染 Mixin → 越肩位置、准星、透明度
```

## Mixin 改动分层

公共 Mixin 配置列出约二十余个客户端注入，主要可按目的归类：

| 类别           | 代表目标                                                                          | 对游戏逻辑的影响                                       |
| -------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------ |
| 视角状态与相机 | `Options`、`Camera`、`MouseHandler`                                               | 接管视角切换；替换相机位姿；让越肩走第一人称鼠标路径   |
| 玩家控制       | `LocalPlayer`、`ClientInput`、`Minecart`                                          | 接管鼠标转向、重算移动向量、处理载具旋转               |
| 选取/交互      | `Player`、`Item`、`ProjectileUtil`                                                | 将方块、实体、物品和攻击范围的射线换成相机语义         |
| HUD/视觉       | `Hud`、`GameRenderer`、`DebugScreenOverlay`                                       | 改准星可见性与位置、视角晃动、调试显示                 |
| 模型渲染       | `EntityRenderer`、`EntityRenderDispatcher`、`SubmitNodeCollection`、`RenderTypes` | 定位相机实体的渲染状态，并对身体、盔甲和光效应用透明度 |
| 一致性修正     | `EntityBoundSoundInstance`、`CompassAngleState`、`AbstractClientPlayer`           | 修正玩家声音位置、指南针方位和 FOV 分支                |

加载器专用的 `LevelRendererMixin` 在世界渲染末尾驱动相机与准星的逐帧计算；Fabric/NeoForge 的 `CameraMixin` 则适配不同签名的 z 轴旋转写入。

## 事件/插件 API：把扩展从侵入式 Mixin 中移出

SSR 的 API 提供事件总线与 `IShoulderSurfingPlugin`。插件可注册处理器来判断角色是否瞄准、使用物品、攻击、交互、选取、坐船，是否强制相机耦合/原版输入/临时第一人称；也可修改相机目标偏移、相机旋转和自身透明度。内置 `BuiltinPlugin` 将默认策略注册为这些处理器，第三方兼容逻辑就不必直接注入核心相机类。

项目还用 `ServiceLoader` 风格的平台 `PluginLoader` 发现插件。兼容模块会按已加载模组选择性应用 Mixin；仓库内包含 Create、Create Fly、Cobblemon、Curios、Neat、TslatEntityStatus、Wildfire Gender 等适配，README 同时列出若干相机类模组的不兼容性。

## 为什么需要这么多兼容点

模组改变的并非服务端世界状态，而是“客户端如何决定自己看向和打向哪里”。Minecraft 的这些决策分散在普通方块拾取、实体拾取、物品辅助方法、攻击范围、鼠标转向、HUD 和渲染管线中。只替换相机位置会造成准星、攻击与角色动画各自指向不同方向；SSR 通过上述注入把它们统一到可配置的相机/玩家语义，代价则是与同样改相机、输入或渲染流程的模组更容易发生冲突。
