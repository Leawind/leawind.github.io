---
title: 覆盖链
---

# 覆盖链

覆盖链（`PerspectiveOverrideChain`）用于临时强制选择视角，例如过场动画、载具驾驶或特殊瞄准状态。它只决定当前应使用哪个视角，不直接修改相机状态。

## 注册覆盖项

```java
PerspectiveAPI.runWhenReady(
    "mymod.cutscene_override",
    () -> PerspectiveAPI.getOverrideChain().push(
        "mymod.cutscene",
        1000,
        () -> isCutsceneActive ? "mymod.cutscene_camera" : null));
```

供应商返回视角 ID 时尝试覆盖当前视角，返回 `null` 时跳过该项。覆盖项按优先级从大到小求值，第一个指向“已注册且当前可用”视角的结果生效；无效或不可用的候选项不会阻止后续条目继续求值。

每个供应商在 Perspective API 启用期间每个客户端游戏刻最多求值一次。供应商应快速完成，不应修改游戏状态，也不应依赖具体的调用次数。

## 移除和查询

```java
PerspectiveOverrideChain overrides = PerspectiveAPI.getOverrideChain();

if (overrides.has("mymod.cutscene")) {
  overrides.pop("mymod.cutscene");
}
```

使用相同 `key` 再次 `push` 会替换原条目。优先级相同时按插入顺序求值；替换条目视为一次新的插入。
