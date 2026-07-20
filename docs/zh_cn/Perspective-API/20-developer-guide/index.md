---
title: 开发者指南
---

# 开发者指南

## 添加依赖

> [!INFO]
>
> 你可以在 [Modrinth Versions] 或 [Github Releases] 页面查看本模组的所有版本。
>
> 这个徽章应该能显示最新的版本号： <img src="https://img.shields.io/github/v/tag/Leawind/Perspective-API?label=API&color=818181" style="display:inline">

### 通过 Modrinth Maven 添加依赖

格式：`"maven.modrinth:perspective-api:${version}+${loader}-${minecraft_version}"`

```kotlin
repositories {
  exclusiveContent {
    forRepository {
      maven {
        name = "Modrinth"
        url = uri("https://api.modrinth.com/maven")
      }
    }
    filter {
      includeGroup("maven.modrinth")
    }
  }
}

dependencies {
  // Use `implementation` for >=26.1
  modImplementation("maven.modrinth:LIqveQm1:1.0.0-beta.9+fabric-26.2")
}
```

> [!TIP] 提示
>
> 如果你使用 stonecutter，可以定义一个通用的用于添加模组依赖的函数：
>
> ```kotlin
> fun DependencyHandlerScope.modImplAlias(dependencyNotation: String) {
>   if (VersionNumber.parse(mod.minecraftVersion) >= VersionNumber.parse("26.1")) {
>     implementation(dependencyNotation)
>   } else {
>     add("modImplementation", dependencyNotation)
>   }
> }
>
> dependencies {
>   modImplAlias("maven.modrinth:LIqveQm1:${props["mod.perspective_api_version"]}+${mod.loader}-${mod.minecraftVersion}")
> }
> ```

### 添加 `com.google.auto.service` 依赖（可选）

```kotlin
dependencies {
  compileOnly("com.google.auto.service:auto-service-annotations:1.1.1")
  annotationProcessor("com.google.auto.service:auto-service:1.1.1")
}
```

利用它可以更加方便地实现 SPI，而无需手动编辑 service 文件。

## 示例模组

[视角 API 演示](https://github.com/Leawind/Perspective-API-Demo) 实现了一些自定义视角，可作为开发参考。

---

[Github Releases]: https://github.com/Leawind/Perspective-API/releases
[Modrinth Versions]: https://modrinth.com/mod/perspective-api/versions
