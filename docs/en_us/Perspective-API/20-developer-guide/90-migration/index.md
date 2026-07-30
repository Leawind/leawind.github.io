---
title: Migration Guide
---

# Migration Guide

This guide explains how to migrate a perspective mod that directly modifies Minecraft's camera to Perspective API, reducing dependence on vanilla implementation details and improving compatibility between perspective mods.

## Migrating from vanilla camera injections

First, choose the API that matches each feature:

| Existing feature                                    | Recommended API            |
| --------------------------------------------------- | -------------------------- |
| A complete player-selectable camera mode            | `PerspectiveBehavior`      |
| Shake, offset, or FOV effects on every perspective  | `PerspectiveModifier`      |
| Temporarily force a perspective in a specific state | `PerspectiveOverrideChain` |

After migration, do not inject `Camera` or `GameRenderer`, or call vanilla FOV calculations yourself. Perspective API obtains the vanilla camera state at the appropriate injection point for each Minecraft version and gives mods that use the API a unified `PerspectiveState`.

## Combining position, rotation, and FOV handling

The current API uses one callback for the complete camera state:

```java
@Override
public void applyCameraState(
    PerspectiveState.Mutable state, PerspectiveContext ctx) {
  state.position().add(offsetX, offsetY, offsetZ);
  state.rotation().set(targetRotation);
  state.setFovDeg(targetFovDeg);
}
```

Consolidate existing position, rotation, and FOV calculations in `applyCameraState`. This allows the same camera logic to serve every supported Minecraft version.

## Updating initialization code

Do not assume Perspective API runtime services are available when your mod entry point runs. Put modifier registration, override registration, and registry lookups in:

```java
PerspectiveAPI.runWhenReady("mymod.initialize_camera", () -> {
  PerspectiveAPI.getModifierChain().register(KEY, PRIORITY, modifier);
});
```

Fixed perspectives are normally still discovered through Java SPI. For runtime data such as player presets, call `PerspectiveRegistry.register(info, behavior)` here and retain the returned `PerspectiveRegistration`, so `updateInfo` or `unregister` can be called when the preset is edited or deleted.

## Checking temporary-object lifetimes

`PerspectiveState`, `PerspectiveContext`, and mutable vectors and quaternions obtained in callbacks are valid only during the current callback. Copy the values you need when retaining camera data across frames:

```java
cachedPosition.set(state.position());
cachedRotation.set(state.rotation());
cachedFovDeg = state.getFovDeg();
```

## Migration checklist

- Remove vanilla camera method Mixins and manual FOV calculations.
- Add `@PerspectiveInfo.Declaration` and SPI registration to fixed perspective implementations.
- Use `PerspectiveRegistry.register` for runtime-created perspectives and retain their registration handles.
- Consolidate complete camera state in `applyCameraState`.
- Split reusable overlay effects into modifiers.
- Convert temporary forced switches to the override chain.
- Use `runWhenReady` to access runtime services.
- Do not retain temporary state objects across callbacks.
- Verify switching, transitions, and FOV behavior on every target Minecraft version.
