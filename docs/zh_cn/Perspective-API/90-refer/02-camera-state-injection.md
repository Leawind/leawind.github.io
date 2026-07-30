---
title: 相机状态注入位置
---

# 相机状态注入位置

Perspective API 支持多个 Minecraft 版本。不同版本计算相机位置、旋转、视场角（FOV）和投影矩阵的时机并不相同，因此模组在 `bridge` 层为各版本选择不同的注入位置，再通过统一事件交给 `logic` 层处理。

这些版本差异不会暴露到公共 API。`PerspectiveBehavior` 和 `PerspectiveModifier` 在所有版本中始终通过完整的 `PerspectiveState` 读取和修改相机位置、旋转与投影参数。

## 相机状态管线

每个渲染帧中，Perspective API 会在原版相机完成基础设置后执行一次完整的相机状态管线：

```text
原版相机状态
  -> 当前视角
  -> Modifier 链
  -> 视角切换过渡
  -> 有效性检查
  -> 写回原版相机和世界投影
```

Mixin 和加载器事件只负责观察原版调用并发射通用事件，不执行视角业务，也不会主动调用原版的 FOV 计算方法。

## 位置和旋转

位置和旋转统一在原版完成相机基础设置后修改。

| Minecraft 版本 | 原版类   | 注入方法          | 注入点   |
| -------------- | -------- | ----------------- | -------- |
| `< 26.1`       | `Camera` | `setup`           | `RETURN` |
| `>= 26.1`      | `Camera` | `alignWithEntity` | `RETURN` |

在 `>= 26.1` 中，只有已经初始化的相机才会发射事件。这可以避开原版创建相机对象但尚未准备实体和世界状态的阶段。

注入点向 `logic` 层发射 `SETUP_CAMERA` 事件。随后，统一的相机状态管线会以原版位置、旋转和缓存的原版 FOV 为初始状态，计算最终的 `PerspectiveState`，再将最终位置和旋转写回 `Camera`。

## 视场角

FOV 在原版自然完成计算后拦截。注入代码取得原版返回值，将其通过
`MODIFY_FIELD_OF_VIEW` 事件传给 `logic` 层，然后返回 Perspective API 已经
计算好的最终 FOV。

| Minecraft 版本及加载器      | 原版来源                   | 接入方式                |
| --------------------------- | -------------------------- | ----------------------- |
| `1.20.1 Forge`              | `ViewportEvent.ComputeFov` | Forge 客户端事件        |
| `< 1.21.11`，但不包括 Forge | `GameRenderer#getFov`      | 修改方法返回值          |
| `1.21.11`                   | `GameRenderer#getFov`      | 修改 `float` 方法返回值 |
| `>= 26.1`                   | `Camera#calculateFov`      | 修改方法返回值          |

旧版 `GameRenderer#getFov` 还会用于手持物等固定 FOV 的投影。Perspective API 只处理启用了玩家 FOV 设置的调用，避免影响这些额外投影。

## 原版 FOV 缓存

原版在各版本中计算相机变换和 FOV 的先后顺序不同。例如，部分旧版本先计算 FOV 再调用 `Camera#setup`，另一些版本则先设置相机，之后才计算 FOV；较新的版本又将这些步骤移动到了 `Camera` 内部。

为了让所有版本共享同一套完整相机状态管线，Perspective API 不要求变换注入点同时取得本帧的原版 FOV。FOV 注入点会缓存原版自然产生的值，供下一渲染帧初始化 `PerspectiveState`；当前调用则返回本帧已经计算好的最终 FOV。

因此，延迟的是作为初始值的原版 FOV，而不是视角或 Modifier 明确设置的 FOV。例如，下面的固定值仍会在当前管线中立即成为目标值：

```java
state.setFovDeg(30.0f);
```

只有依赖原版初始值的计算会使用上一渲染帧的原版 FOV：

```java
state.setFovDeg(state.getFovDeg() * 0.8f);
```

通常相邻渲染帧的间隔很短，而原版的疾跑、死亡和流体 FOV 效果本身也是连续变化的，因此这种差异通常不可见。该策略避免了重复执行完整相机管线、复制原版 FOV 算法或为旧版本拆分公共 API，同时使各 Minecraft 版本保持一致的行为。

## 正交投影

当最终 `PerspectiveState.projectionMode()` 为 `ProjectionMode.ORTHOGRAPHIC` 时，`bridge` 层会以 `getOrthographicHeight()` 构建以相机前方轴为中心的世界正交投影矩阵，并同步替换世界渲染、剔除和相机近裁剪面的相关投影。界面和手持物等非世界投影不使用该设置。

正交投影的水平跨度由窗口宽高比计算。有关公共 API 的用法和参数含义，见[投影模式](../developer-guide/convention/projection)。
