---
title: 快速开始
---

# 快速开始

## 添加依赖

在 `settings.gradle.kts` 中添加 Modstitch 插件仓库：

```kotlin
pluginManagement {
    repositories {
        maven("https://maven.isxander.dev/releases")
        gradlePluginPortal()
        maven("https://maven.fabricmc.net")
        maven("https://maven.neoforged.net/releases/")
    }
}
```

## 应用插件

在 `build.gradle.kts` 中应用基础插件：

```kotlin
plugins {
    id("dev.isxander.modstitch.base") version "0.8.5"
}
```

## 选择平台

通过 `gradle.properties` 中的 `modstitch.platform` 属性选择目标平台：

```properties
# 可选值：fabric-loom, fabric-loom-remap, moddevgradle, moddevgradle-legacy
modstitch.platform=fabric-loom-remap
```

## 基本配置

```kotlin
modstitch {
    minecraftVersion = "1.21.8"

    loom {
        fabricLoaderVersion = "0.16.19"
    }

    moddevgradle {
        neoForgeVersion = "21.8.0-beta"
    }

    parchment {
        version = "2025.12.12"
    }

    metadata {
        modId = "my_mod"
        modVersion = "1.0.0"
        modName = "My Mod"
        modGroup = "com.example"
    }

    mixins.register("my_mod")
}
```

> [!NOTE]
> 只需要配置当前激活平台对应的块（`loom` 或 `moddevgradle`），未激活平台的配置会被忽略。

## 多项目构建

如果使用 Stonecutter 等预处理器进行多项目构建，可以在父项目中设置 `modstitch.platform=parent`，这样 Modstitch 会自动应用到所有子项目：

```properties
modstitch.platform=parent
```
