---
title: DSL 参考
---

# DSL 参考

`modstitch { }` 是 Modstitch 的核心 DSL 入口，提供对所有构建配置的统一访问。

## ModstitchExtension

主扩展接口，提供以下属性和方法：

### 属性

| 属性                   | 类型       | 说明                             |
| ---------------------- | ---------- | -------------------------------- |
| `minecraftVersion`     | `String`   | Minecraft 版本（必填）           |
| `modLoaderVersion`     | `String`   | 模组加载器版本（委托给平台扩展） |
| `javaVersion`          | `Int`      | Java 版本，根据 MC 版本自动推断  |
| `isUnobfuscated`       | `Boolean`  | 是否为未混淆环境                 |
| `platform`             | `Platform` | 当前激活的平台                   |
| `isLoom`               | `Boolean`  | 是否为 Loom 平台                 |
| `isModDevGradle`       | `Boolean`  | 是否为 ModDevGradle 平台         |
| `classTweaker`         | `File?`    | Class Tweaker 文件路径           |
| `classTweakerName`     | `String`   | Class Tweaker 文件名             |
| `validateClassTweaker` | `Boolean`  | 是否验证 Class Tweaker 格式      |

### 方法

| 方法                   | 说明                               |
| ---------------------- | ---------------------------------- |
| `loom(action)`         | 仅在 Loom 平台时执行配置块         |
| `moddevgradle(action)` | 仅在 ModDevGradle 平台时执行配置块 |
| `unitTesting()`        | 启用单元测试支持                   |
| `onEnable(action)`     | 在平台设置完成后执行               |

## MetadataBlock

模组元数据配置块：

```kotlin
modstitch {
    metadata {
        modId = "my_mod"                    // 模组 ID，默认 "unnamed_mod"
        modName = "My Mod"                  // 模组名称，默认 "Unnamed Mod"
        modVersion = "1.0.0"               // 版本，默认 "1.0.0"
        modDescription = "A mod"           // 描述
        modLicense = "MIT"                 // 许可证，默认 "All Rights Reserved"
        modGroup = "com.example"           // Maven Group，默认 "com.example"
        modAuthor = "Author"               // 作者
        modCredits = "Thanks"              // 致谢
        overwriteProjectVersionAndGroup = true  // 是否覆盖 project.version 和 project.group
    }
}
```

### 自动替换

在 `src/main/resources/templates/` 目录下的文件中，可以使用以下占位符：

| 占位符               | 说明        |
| -------------------- | ----------- |
| `${mod_id}`          | 模组 ID     |
| `${mod_version}`     | 模组版本    |
| `${mod_name}`        | 模组名称    |
| `${mod_description}` | 模组描述    |
| `${mod_license}`     | 许可证      |
| `${mod_group}`       | Maven Group |
| `${mod_author}`      | 作者        |
| `${mod_credits}`     | 致谢        |

## MixinBlock

Mixin 配置块：

```kotlin
modstitch {
    mixins {
        // 注册 mixin 配置
        register("my_mod")

        // 自定义 mixin 配置
        my_mod {
            config = "my_mod.mixins.json"  // 默认为 ${name}.mixins.json
            side = Side.Both                // Both, Client, Server
        }

        // 添加已有 source set 的 mixin
        registerSourceSet("test")

        // 是否在 mod 元数据中自动注册 mixin
        addMixinsToModManifest = true
    }
}
```

### MixinConfigurationSettings

| 属性     | 类型               | 默认值                | 说明       |
| -------- | ------------------ | --------------------- | ---------- |
| `config` | `Property<String>` | `${name}.mixins.json` | 配置文件名 |
| `side`   | `Property<Side>`   | `Side.Both`           | 适用端     |

## RunConfig

运行配置定义：

```kotlin
modstitch {
    runs {
        client {
            mainClass = "net.fabricmc.loader.impl.launch.knot.KnotClient"
            jvmArgs("-Dfabric.development=true")
            programArgs("--username", "Dev")
            side = Side.Client
            gameDirectory = file("run")
        }

        server {
            side = Side.Server
        }

        datagen {
            datagen = true
        }

        // 继承其他运行配置
        custom {
            inherit("client")
            programArgs("--custom")
        }
    }
}
```

### RunConfig 属性

| 属性                   | 类型                         | 说明              |
| ---------------------- | ---------------------------- | ----------------- |
| `mainClass`            | `String?`                    | 主类名            |
| `jvmArgs`              | `MutableList<String>`        | JVM 参数          |
| `programArgs`          | `MutableList<String>`        | 程序参数          |
| `environmentVariables` | `MutableMap<String, String>` | 环境变量          |
| `gameDirectory`        | `File?`                      | 游戏目录          |
| `side`                 | `Side?`                      | 适用端            |
| `datagen`              | `Boolean`                    | 是否为数据生成    |
| `sourceSet`            | `String?`                    | 关联的 Source Set |
| `ideRunName`           | `String?`                    | IDE 中显示的名称  |
| `ideRun`               | `Boolean`                    | 是否在 IDE 中显示 |

## ParchmentBlock

Parchment 参数名映射配置：

```kotlin
modstitch {
    parchment {
        version = "2025.12.12"  // 映射版本
    }
}
```

| 属性                | 类型      | 说明                          |
| ------------------- | --------- | ----------------------------- |
| `version`           | `String`  | Parchment 映射版本            |
| `enabled`           | `Boolean` | 是否启用（默认 true）         |
| `parchmentArtifact` | `String`  | 完整的 Maven 坐标（自动生成） |

## Class Tweaker

Modstitch 自动搜索项目中的 Class Tweaker 文件（按优先级）：

1. `modstitch.ct`
2. `.classTweaker`
3. `accesstransformer.cfg`

支持的格式：

| 格式  | 说明                                 |
| ----- | ------------------------------------ |
| AT    | Access Transformer（Forge/NeoForge） |
| AW V1 | Access Widener V1（Fabric）          |
| AW V2 | Access Widener V2                    |
| CT    | Class Tweaker（通用格式）            |

在构建时，Modstitch 会自动将 Class Tweaker 转换为对应平台的格式：

- Loom 平台：转换为 Access Widener V1
- ModDevGradle 平台：转换为 Access Transformer

## 代理配置

Modstitch 创建代理配置以便跨平台依赖声明：

| 配置名                       | 说明                  |
| ---------------------------- | --------------------- |
| `modstitchImplementation`    | 代理 `implementation` |
| `modstitchCompileOnly`       | 代理 `compileOnly`    |
| `modstitchRuntimeOnly`       | 代理 `runtimeOnly`    |
| `modstitchModImplementation` | 平台特定的 mod 依赖   |
| `modstitchJiJ`               | Jar-in-Jar 依赖       |
