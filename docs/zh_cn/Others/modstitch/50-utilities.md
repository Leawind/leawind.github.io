---
title: 工具类
---

# 工具类

Modstitch 内部使用了一系列工具类来处理版本解析、格式转换等任务。这些类主要供插件内部使用，但了解它们有助于理解插件的工作原理。

## MinecraftVersion

Minecraft 版本解析和比较工具，支持所有版本格式：

### 版本类型

| 类型             | 格式               | 示例                      |
| ---------------- | ------------------ | ------------------------- |
| `Release`        | `YY.D` 或 `YY.D.P` | `25.1`, `25.1.2`          |
| `Snapshot`       | `YY.D-type-N`      | `25.1-pre-1`, `25.1-rc-1` |
| `LegacyRelease`  | `1.D.P`            | `1.21.4`, `1.20.1`        |
| `LegacySnapshot` | `YYwWWr`           | `24w10a`, `23w40a`        |

### 使用示例

```kotlin
import dev.isxander.modstitch.util.minecraftVersion

val version = minecraftVersion("1.21.4")
val version2 = minecraftVersion("25.1-pre-1")

// 版本比较
if (version2 > version) {
    println("更新的版本")
}
```

### 自动 Java 版本推断

Modstitch 根据 Minecraft 版本自动设置 Java 版本：

| MC 版本范围 | Java 版本 |
| ----------- | --------- |
| >= 26.x     | 25        |
| >= 25.x     | 21        |
| >= 1.21.x   | 17        |
| >= 1.17.x   | 16        |
| < 1.17.x    | 8         |

## ClassTweaker

Class Tweaker 文件的解析、转换和重映射工具。支持多种格式：

### 支持的格式

| 格式  | 说明                                 |
| ----- | ------------------------------------ |
| AT    | Access Transformer（Forge/NeoForge） |
| AW V1 | Access Widener V1（Fabric）          |
| AW V2 | Access Widener V2                    |
| CT    | Class Tweaker（通用格式）            |

### 格式转换

```kotlin
// 内部使用示例
val classTweaker = ClassTweaker.parse(reader)

// 转换为不同格式
val awV1 = classTweaker.convertFormat(ClassTweakerFormat.AW_V1)
val at = classTweaker.convertFormat(ClassTweakerFormat.AT)

// 命名空间转换
val mapped = classTweaker.convertNamespace(ClassTweakerNamespace.Intermediary)

// 使用 TSRG 映射进行重映射
val remapped = classTweaker.remap(mappings, ClassTweakerNamespace.Named)
```

### 访问修饰符

| 修饰符      | 说明   |
| ----------- | ------ |
| `Unset`     | 未设置 |
| `Private`   | 私有   |
| `Default`   | 包私有 |
| `Protected` | 受保护 |
| `Public`    | 公开   |

### 类型

| 类型              | 说明                   |
| ----------------- | ---------------------- |
| `Class`           | 类访问修饰符           |
| `Method`          | 方法访问修饰符         |
| `Field`           | 字段访问修饰符         |
| `InjectInterface` | 注入接口（仅 CT 格式） |

## Platform

支持的构建平台枚举：

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

### 扩展属性

```kotlin
// 在 Project 上的扩展
val Project.platform: Platform      // 当前平台
val Project.platformOrNull: Platform?  // 当前平台（可空）

// 平台类型检查
platform.isLoom                    // 是否为 Loom
platform.isLoomRemap               // 是否为 Loom Remap
platform.isModDevGradle            // 是否为 ModDevGradle
platform.isModDevGradleRegular     // 是否为标准 ModDevGradle
platform.isModDevGradleLegacy      // 是否为 Legacy Forge
```

## Side

游戏端枚举：

```kotlin
enum class Side : Serializable {
    Both,    // 双端
    Client,  // 客户端
    Server   // 服务端
}
```

## MappingOperation

通用的映射/重映射管道，用于处理 TSRG 格式的映射文件：

```kotlin
// 内部使用示例
val operation = MappingOperation<String>()
    .remapClass("old.ClassName", "new.ClassName")
    .remapField("old.ClassName", "oldField", "newField")
    .remapMember("old.ClassName", "oldMethod", "(I)V", "newMethod", "(I)V")

val result = operation.apply(inputString)
```

### 支持的映射格式

| 格式     | 支持   |
| -------- | ------ |
| TSRG     | 支持   |
| ProGuard | 不支持 |
| TinyV1   | 不支持 |
| Tiny     | 不支持 |
| SRG      | 不支持 |

## SyntaxTree

组合子风格的语法树解析框架，用于解析 AT/AW/CT 格式的文件：

```kotlin
// 内部使用示例
val tree = syntaxTree<ClassTweakerEntry> {
    node("access-widener" to "v1") {
        // 解析逻辑
    }
}
```

### 节点类型

| 类型                    | 说明           |
| ----------------------- | -------------- |
| `LiteralSyntaxNodeType` | 精确匹配字符串 |
| `StringNodeType`        | 匹配任意字符串 |
| `MappedSyntaxNodeType`  | 映射解析结果   |

## ProjectUtils

Gradle Project 扩展工具：

```kotlin
// 获取 source sets
val sourceSets = project.sourceSets
val mainSourceSet = project.mainSourceSet

// 获取项目链（包括父项目）
val projectChain = project.projectChain

// 在评估成功后执行
project.afterSuccessfulEvaluate {
    // 配置代码
}
```

## StringUtils

字符串工具：

```kotlin
// 添加驼峰前缀
"implementation".addCamelCasePrefix("modstitchMod")
// 结果: "modstitchModImplementation"

// 按空白分割
"hello world".words()
// 结果: ["hello", "world"]
```
