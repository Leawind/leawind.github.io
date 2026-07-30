---
title: 开发者指南
---

# 开发者指南

> [!WARNING]
> 在发布正式版 `1.0.0` 之前，API 可能随时发生破坏性变更。

## 添加依赖

> [!INFO]
>
> 你可以在 [Modrinth Versions] 或 [Github Releases] 页面查看本模组的所有版本。
>
> 这个徽章应该能显示最新的版本号： <img src="https://img.shields.io/github/v/tag/Leawind/Perspective-API?label=API&color=818181" style="display:inline">

### 通过 Modrinth Maven 添加依赖

坐标格式：`maven.modrinth:LIqveQm1:<API 版本>+<加载器>-<Minecraft 版本>`。
请从版本页面选择与你的加载器和 Minecraft 版本完全对应的构件。

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
  // Minecraft 26.1 及以上使用 implementation
  modImplementation("maven.modrinth:LIqveQm1:1.0.0-beta.9+fabric-26.2")
}
```

### 添加 `com.google.auto.service` 依赖（可选）

```kotlin
dependencies {
  compileOnly("com.google.auto.service:auto-service-annotations:1.1.1")
  annotationProcessor("com.google.auto.service:auto-service:1.1.1")
}
```

它可以为 `PerspectiveBehavior` 自动生成 Java SPI 服务文件，避免手动维护 `META-INF/services`。

## 开始开发

- [自定义视角](./perspective)：定义一种完整的相机模式
- [投影模式](./convention/projection)：使用透视或正交投影渲染世界
- [视角修饰器](./modifier)：在任意视角上叠加相机效果
- [覆盖链](./override-chain)：根据游戏状态临时强制切换视角
- [迁移指南](./migration/)：从原版相机注入或早期测试版 API 迁移

Perspective API 的位置、旋转和投影参数始终通过统一的 `PerspectiveState` 暴露。开发者不需要针对不同 Minecraft 版本选择不同回调，也不应主动调用原版的 FOV 或投影矩阵计算方法。

## 示例模组

[视角 API 演示](../example/) 实现了多个自定义视角和修饰器，其[源码]可作为开发参考。

---

[Github Releases]: https://github.com/Leawind/Perspective-API/releases
[Modrinth Versions]: https://modrinth.com/mod/perspective-api/versions
[源码]: https://github.com/Leawind/Perspective-API-Demo
