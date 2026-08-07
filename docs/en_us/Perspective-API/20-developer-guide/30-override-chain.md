---
title: Override Chain
---

# Override Chain

`PerspectiveOverrideChain` temporarily forces a perspective for cutscenes, vehicles, or special aiming states. It only determines which perspective should be current; it does not directly modify camera state.

## Registering an override

```java
PerspectiveOverrideRegistration registration =
    PerspectiveAPI.getOverrideChain().register(
        1000,
        () -> isCutsceneActive ? "mymod.cutscene_camera" : null);
```

When a provider returns a perspective ID, it attempts to override the current perspective; returning `null` skips that entry. Entries are evaluated in descending priority order. The first result that names a registered and currently available perspective takes effect; invalid or unavailable candidates do not prevent subsequent entries from being evaluated.

Each provider that is accessed is evaluated at most once per main-camera render update. Providers should complete quickly, not modify game state, and not depend on their exact invocation count. If the selection state changes during client ticks, return a cached value here.

Registration returns a handle that owns the override. If runtime services might not be ready during initialization, register inside `runWhenReady` and retain the handle in your mod's own state.

## Removing

```java
registration.unregister();
```

Each registration is an independent entry with its own handle. Equal priorities are evaluated in registration order.
