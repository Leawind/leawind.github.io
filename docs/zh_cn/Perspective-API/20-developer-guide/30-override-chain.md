---
title: 覆盖链
---

# 覆盖链

覆盖链（`PerspectiveOverrideChain`）用于临时强制选择视角，例如过场动画、载具驾驶或特殊瞄准状态。它只决定当前应使用哪个视角，不直接修改相机状态。

## 注册覆盖项

```java
PerspectiveOverrideRegistration registration =
    PerspectiveAPI.getOverrideChain().register(
        1000,
        () -> isCutsceneActive ? "mymod.cutscene_camera" : null);
```

供应商返回视角 ID 时尝试覆盖当前视角，返回 `null` 时跳过该项。覆盖项按优先级从大到小求值，第一个指向“已注册且当前可用”视角的结果生效；无效或不可用的候选项不会阻止后续条目继续求值。

每次主相机渲染更新时，访问到的每个供应商最多求值一次。供应商应快速完成，不应修改游戏状态，也不应依赖具体的调用次数；若选择状态在客户端刻中更新，应在此返回缓存值。

注册会返回一个拥有该覆盖项的句柄。若初始化时运行时服务可能尚未就绪，请在
`runWhenReady` 中注册并把句柄保存到模组自己的状态中。

## 移除

```java
registration.unregister();
```

每次注册都是独立条目，并拥有独立句柄。优先级相同时按注册顺序求值。
