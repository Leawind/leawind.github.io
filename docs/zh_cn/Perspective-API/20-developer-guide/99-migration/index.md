---
title: 迁移指南
---

# 迁移指南

本页介绍如何把直接修改 Minecraft 相机的视角类模组迁移到 Perspective API，以减少对原版实现的依赖，并改善不同视角类模组之间的兼容性。

## 从原版相机注入迁移

先按功能选择对应的 API：

| 原有功能                              | 推荐 API                   |
| ------------------------------------- | -------------------------- |
| 定义一种可由玩家选择的完整相机模式    | `PerspectiveBehavior`      |
| 在所有视角上叠加抖动、偏移或 FOV 效果 | `PerspectiveModifier`      |
| 在特定状态下临时强制使用某个视角      | `PerspectiveOverrideChain` |

迁移后不应再注入 `Camera`、`GameRenderer` 或主动调用原版 FOV 计算方法。Perspective API 会在各 Minecraft 版本合适的注入位置取得原版相机状态，并以统一的 `PerspectiveState` 交给接入 API 的模组。

## 合并位置、旋转和 FOV 处理

当前 API 使用一个回调处理完整相机状态：

```java
@Override
public void applyCameraState(
    PerspectiveState.Mutable state, PerspectiveContext ctx) {
  state.position().add(offsetX, offsetY, offsetZ);
  state.rotation().set(targetRotation);
  state.setFovDeg(targetFovDeg);
}
```

将原有的位置、旋转和 FOV 计算集中到 `applyCameraState`。这样同一份相机逻辑可以用于所有受支持的 Minecraft 版本。

## 调整初始化代码

不要假设模组入口执行时 Perspective API 的运行时服务已经可用。把注册修饰器、注册覆盖项或读取注册表的代码放入：

```java
PerspectiveAPI.runWhenReady("mymod.initialize_camera", () -> {
  PerspectiveAPI.getModifierChain().register(KEY, PRIORITY, modifier);
});
```

固定的视角通常仍通过 Java SPI 发现；玩家预设等运行时数据则可在这里调用
`PerspectiveRegistry.register(info, behavior)`，并保存返回的 `PerspectiveRegistration`，以便在预设
被编辑或删除时调用 `updateInfo` 或 `unregister`。

## 检查临时对象的生命周期

`PerspectiveState`、`PerspectiveContext` 以及回调中取得的可变向量和四元数都只在当前回调内有效。如果需要跨帧保存相机数据，应复制所需数值：

```java
cachedPosition.set(state.position());
cachedRotation.set(state.rotation());
cachedFovDeg = state.getFovDeg();
```

## 迁移检查清单

- 删除对原版相机方法的 Mixin 和主动 FOV 计算
- 为 SPI 视角实现添加 `@PerspectiveInfo.Declaration` 和 SPI 注册
- 对运行时创建的视角使用 `PerspectiveRegistry.register`，并保存注册句柄
- 将完整相机状态集中到 `applyCameraState`
- 将通用叠加效果拆分为修饰器
- 将临时强制切换改为覆盖链
- 使用 `runWhenReady` 访问运行时服务
- 不跨回调保存临时状态对象
- 在所有目标 Minecraft 版本上验证切换、过渡和 FOV 效果
