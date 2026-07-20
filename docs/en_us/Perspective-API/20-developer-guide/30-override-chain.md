---
title: Override Chain
---

> [!NOTE]
>
> 🚧 Under Construction 🚧

# Override Chain

The Override Chain is used to temporarily force a perspective switch based on priority. Evaluation starts from the highest priority; the first entry that returns a non-null, registered perspective ID takes effect.

## Basic Usage

```java
PerspectiveAPI.getOverrideChain().push(
    "mymod.cutscene",
    1000,
    () -> isCutsceneActive ? "mymod.cutscene_perspective" : null
);

PerspectiveAPI.getOverrideChain().pop("mymod.cutscene");
```

## Notes

- The same key replaces the previous entry
- The supplier is called at evaluation time, not at push time
- The returned perspective ID must be registered; otherwise it will be skipped
