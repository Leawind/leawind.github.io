---
title: 覆盖链
---

> [!NOTE]
>
> 🚧 施工中 🚧

# 覆盖链

覆盖链（Override Chain）用于基于优先级临时强制切换视角。评估时从最高优先级开始，第一个返回非 null 且已注册的视角 ID 的条目生效。

## 基本用法

```java
PerspectiveAPI.getOverrideChain().push(
    "mymod.cutscene",
    1000,
    () -> isCutsceneActive ? "mymod.cutscene_perspective" : null
);

PerspectiveAPI.getOverrideChain().pop("mymod.cutscene");
```

## 注意事项

- 相同 key 会替换旧条目
- 供应商在评估时才调用，不是 push 时
- 返回的视角 ID 必须是已注册的，否则会被跳过
