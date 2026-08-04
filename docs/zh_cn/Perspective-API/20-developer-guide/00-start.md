---
title: 开始
---

# 开始

## 添加依赖

### 通过 Modrinth Maven 添加依赖

添加 Modrinth Maven仓库：

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
```

坐标格式：`maven.modrinth:perspective_api:$perspectiveApiVersion+${loader}-$mcVersion`

也可以指定项目ID：`maven.modrinth:LIqveQm1:$perspectiveApiVersion+${loader}-$mcVersion`

```kotlin
dependencies {
  // Minecraft 26.1 及以上使用 implementation
  implementation("maven.modrinth:perspective_api:${perspectiveApiVersion}+fabric-26.2")
}
```

> [!INFO]
>
> 你可以在 [Modrinth Versions] 或 [Github Releases] 页面查看本模组的所有版本。

### 添加 `com.google.auto.service` 依赖（可选）

```kotlin
dependencies {
  compileOnly("com.google.auto.service:auto-service-annotations:1.1.1")
  annotationProcessor("com.google.auto.service:auto-service:1.1.1")
}
```

它可以为 `PerspectiveBehavior` 自动生成 Java SPI 服务文件，避免手动维护 `META-INF/services`。

## 然后

- [自定义视角](./perspective)：定义一种完整的相机模式
- [投影模式](./convention/projection)：使用透视或正交投影渲染世界
- [视角修饰器](./modifier)：在任意视角上叠加相机效果
- [覆盖链](./override-chain)：根据游戏状态临时强制切换视角
- [迁移指南](./migration/)：从原版相机注入或早期测试版 API 迁移

Perspective API 的位置、旋转和投影参数始终通过统一的 `PerspectiveState` 暴露。开发者不需要针对不同 Minecraft 版本选择不同回调，也不应主动调用原版的 FOV 或投影矩阵计算方法。

视角切换的连续状态过渡由 `PerspectiveAPI.getTransition()` 控制。它提供全局过渡时长和缓动
函数设置；位置、旋转、FOV 与正交视野高度使用同一时间进度，投影模式则是离散切换。该接口
属于实验性 API。

## 示例模组

[视角 API 演示](../example/) 实现了多个自定义视角和修饰器，其[源码]可作为开发参考。

---

[Github Releases]: https://github.com/Leawind/Perspective-API/releases
[Modrinth Versions]: https://modrinth.com/mod/perspective-api/versions
[源码]: https://github.com/Leawind/Perspective-API-Demo
