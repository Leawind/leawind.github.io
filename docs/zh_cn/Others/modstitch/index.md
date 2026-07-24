---
title: Modstitch
---

# Modstitch

> [!INFO]
>
> 作者：[isXander](https://github.com/isXander)
>
> 源码：[github.com/isXander/modstitch](https://github.com/isXander/modstitch)

Modstitch 是一个 Gradle 插件，为 Minecraft 模组开发提供统一的构建抽象层。它封装了 Fabric Loom 和 NeoForge ModDevGradle 等不同模组加载器工具链的差异，使得同一个构建脚本可以同时面向多个目标平台。

## 核心特性

- **平台无关的 DSL**：使用统一的 `modstitch { }` 配置块，无需关心底层是 Loom 还是 ModDevGradle
- **自动 Mixin 注册**：在 mod 元数据文件中自动注册 mixin 配置
- **Class Tweaker 转换**：自动将 Class Tweaker（AW/AT）文件转换为对应平台的格式
- **智能默认值**：自动配置仓库、Java 版本、编码等常用设置
- **发布支持**：内置 Maven Publish 和 Mod Publish Plugin 集成
- **Parchment 映射**：可选的 Parchment 参数名映射支持

## 支持的平台

| 平台                      | Gradle 插件 ID                     |
| ------------------------- | ---------------------------------- |
| Fabric Loom               | `net.fabricmc.fabric-loom`         |
| Fabric Loom Remap         | `net.fabricmc.fabric-loom-remap`   |
| NeoForge ModDevGradle     | `net.neoforged.moddev`             |
| Legacy Forge ModDevGradle | `net.neoforged.moddev.legacyforge` |

## 版本要求

- Gradle 8.x+
- Java 8+（具体取决于 Minecraft 版本）
