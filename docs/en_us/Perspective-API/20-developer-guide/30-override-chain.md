---
title: Override Chain
---

# Override Chain

`PerspectiveOverrideChain` temporarily forces a perspective for cutscenes, vehicles, or special aiming states. It only determines which perspective should be current; it does not directly modify camera state.

## Registering an override

```java
PerspectiveAPI.runWhenReady(
    "mymod.cutscene_override",
    () -> PerspectiveAPI.getOverrideChain().register(
        "mymod.cutscene",
        1000,
        () -> isCutsceneActive ? "mymod.cutscene_camera" : null));
```

When a provider returns a perspective ID, it attempts to override the current perspective; returning `null` skips that entry. Entries are evaluated in descending priority order. The first result that names a registered and currently available perspective takes effect; invalid or unavailable candidates do not prevent subsequent entries from being evaluated.

Each provider is evaluated at most once per client game tick while Perspective API is enabled. Providers should complete quickly, not modify game state, and not depend on their exact invocation count.

## Removing and querying

```java
PerspectiveOverrideChain overrides = PerspectiveAPI.getOverrideChain();

if (overrides.contains("mymod.cutscene")) {
  overrides.unregister("mymod.cutscene");
}
```

Registering the same `key` again replaces the old entry. Equal priorities are evaluated in insertion order; replacing an entry counts as a new insertion.
