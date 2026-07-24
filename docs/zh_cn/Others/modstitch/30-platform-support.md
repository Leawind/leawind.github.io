---
title: 平台支持
---

# 平台支持

Modstitch 支持四种 Minecraft 模组构建平台，通过统一的 DSL 进行配置。

## Platform 枚举

```kotlin
enum class Platform(
    val friendlyName: String,
    val modManifest: String
) {
    Loom("fabric-loom", "fabric.mod.json"),
    LoomRemap("fabric-loom-remap", "fabric.mod.json"),
    MDG("moddevgradle", "META-INF/neoforge.mods.toml"),
    MDGLegacy("moddevgradle-legacy", "META-INF/mods.toml")
}
```

| 属性           | 说明                                 |
| -------------- | ------------------------------------ |
| `friendlyName` | 用于 `modstitch.platform` 属性的名称 |
| `modManifest`  | 对应平台的 mod 元数据文件路径        |

## Fabric Loom

### BaseLoomExtension

Loom 平台的扩展配置：

```kotlin
modstitch {
    loom {
        fabricLoaderVersion = "0.16.19"  // Fabric Loader 版本

        // 直接访问 Loom 扩展
        configureLoom {
            silentMojMappings()
        }
    }
}
```

| 属性                    | 类型                     | 说明               |
| ----------------------- | ------------------------ | ------------------ |
| `fabricLoaderVersion`   | `Property<String>`       | Fabric Loader 版本 |
| `loomExtension`         | `LoomGradleExtensionAPI` | 原始 Loom 扩展 API |
| `configureLoom(action)` | 方法                     | 直接配置 Loom      |

### 自动配置

应用 Loom 平台时，Modstitch 会自动：

1. 应用 `net.fabricmc.fabric-loom` 或 `net.fabricmc.fabric-loom-remap` 插件
2. 添加 FabricMC Maven 仓库
3. 配置 Minecraft 依赖和映射（Mojang + Parchment）
4. 添加 Fabric Loader 依赖
5. 注册 mixin 配置
6. 配置运行配置
7. 将 Class Tweaker 转换为 Access Widener V1 格式

### 运行配置

Loom 平台的运行配置通过 `net.fabricmc.loader.impl.launch.knot.KnotClient` 启动。

## NeoForge ModDevGradle

### BaseModDevGradleExtension

ModDevGradle 平台的扩展配置：

```kotlin
modstitch {
    moddevgradle {
        neoForgeVersion = "21.8.0-beta"  // NeoForge 版本
        // 或
        forgeVersion = "47.2.0"          // Legacy Forge 版本

        // 高级配置
        configureNeoForge {
            // NeoForge 扩展配置
        }

        configureObfuscation {
            // 混淆配置
        }

        configureMixin {
            // Mixin 配置
        }

        defaultRuns()
    }
}
```

| 属性                   | 类型                   | 说明              |
| ---------------------- | ---------------------- | ----------------- |
| `neoForgeVersion`      | `Property<String>`     | NeoForge 版本     |
| `forgeVersion`         | `Property<String>`     | Legacy Forge 版本 |
| `neoFormVersion`       | `Property<String>`     | NeoForm 版本      |
| `mcpVersion`           | `Property<String>`     | MCP 版本          |
| `neoForgeExtension`    | `NeoForgeExtension`    | NeoForge 扩展     |
| `obfuscationExtension` | `ObfuscationExtension` | 混淆扩展          |
| `mixinExtension`       | `MDGMixinExtension`    | Mixin 扩展        |

### 自动配置

应用 ModDevGradle 平台时，Modstitch 会自动：

1. 应用 `net.neoforged.moddev` 或 `net.neoforged.moddev.legacyforge` 插件
2. 配置 NeoForge/LegacyForge 扩展
3. 配置混淆和映射
4. 注册 mixin 配置
5. 配置运行配置（支持 datagen）
6. 将 Class Tweaker 转换为 Access Transformer 格式

### 运行配置

ModDevGradle 平台支持以下运行类型：

```kotlin
modstitch {
    moddevgradle {
        defaultRuns()  // 添加默认的 client/server 运行配置
    }

    runs {
        client {
            side = Side.Client
        }
        server {
            side = Side.Server
        }
        datagen {
            datagen = true
        }
    }
}
```

## 平台检测

在构建脚本中可以根据当前平台进行条件配置：

```kotlin
modstitch {
    // 仅在 Loom 平台执行
    loom {
        fabricLoaderVersion = "0.16.19"
    }

    // 仅在 ModDevGradle 平台执行
    moddevgradle {
        neoForgeVersion = "21.8.0-beta"
    }

    // 检查平台
    if (platform.isLoom) {
        // Loom 特定配置
    }
}
```
