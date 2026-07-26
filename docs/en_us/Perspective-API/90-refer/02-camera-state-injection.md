---
title: Camera State Injection Points
---

# Camera State Injection Points

Perspective API supports multiple Minecraft versions. Different versions calculate camera position, rotation, and field of view (FOV) at different times, so the mod selects different injection points for each version in the `bridge` layer, then passes them to the `logic` layer via a unified event.

These version differences are not exposed to the public API. `PerspectiveBehavior` and `PerspectiveModifier` consistently read and modify camera position, rotation, and FOV through the complete `PerspectiveState` across all versions.

## Camera State Pipeline

In each render frame, Perspective API executes a complete camera state pipeline after the vanilla camera has completed its basic setup:

```text
Vanilla camera state
  -> Current perspective
  -> Modifier chain
  -> Perspective transition
  -> Validity check
  -> Write back to vanilla camera
```

Mixins and loader events are only responsible for observing vanilla invocations and dispatching generic events. They do not execute perspective logic nor proactively call vanilla FOV calculation methods.

## Position and Rotation

Position and rotation are uniformly modified after the vanilla camera completes its basic setup.

| Minecraft Version | Vanilla Class | Injection Method  | Injection Point |
| ----------------- | ------------- | ----------------- | --------------- |
| `< 26.1`          | `Camera`      | `setup`           | `RETURN`        |
| `>= 26.1`         | `Camera`      | `alignWithEntity` | `RETURN`        |

In `>= 26.1`, only initialized cameras fire events. This avoids the stage where vanilla creates the camera object but has not yet prepared the entity and world state.

The injection point dispatches the `SETUP_CAMERA` event to the `logic` layer. Subsequently, the unified camera state pipeline computes the final `PerspectiveState` using vanilla position, rotation, and cached vanilla FOV as the initial state, then writes the final position and rotation back to the `Camera`.

## Field of View

FOV is intercepted after vanilla has naturally completed its calculation. The injection code obtains the vanilla return value, passes it to the `logic` layer via the `MODIFY_FIELD_OF_VIEW` event, and then returns the final FOV already computed by Perspective API.

| Minecraft Version and Loader | Vanilla Source             | Access Method                      |
| ---------------------------- | -------------------------- | ---------------------------------- |
| `1.20.1 Forge`               | `ViewportEvent.ComputeFov` | Forge client event                 |
| `< 1.21.11`, excluding Forge | `GameRenderer#getFov`      | Modify method return value         |
| `1.21.11`                    | `GameRenderer#getFov`      | Modify `float` method return value |
| `>= 26.1`                    | `Camera#calculateFov`      | Modify method return value         |

The older `GameRenderer#getFov` is also used for projections with fixed FOV, such as held items. Perspective API only handles invocations that enable the player's FOV setting, avoiding interference with these additional projections.

## Vanilla FOV Cache

The order in which vanilla computes camera transforms and FOV differs across versions. For example, some older versions compute FOV before calling `Camera#setup`, while others set up the camera first and compute FOV afterward; newer versions have moved these steps inside `Camera`.

To ensure all versions share the same unified camera state pipeline, Perspective API does not require the transform injection point to also obtain the current frame's vanilla FOV. The FOV injection point caches the vanilla naturally-produced value for initializing `PerspectiveState` in the next render frame; the current call returns the final FOV already computed for this frame.

Therefore, what is delayed is the vanilla FOV as the initial value, not the perspective or FOV explicitly set by modifiers. For example, the following fixed value will still immediately become the target value in the current pipeline:

```java
state.setFovDeg(30.0f);
```

Only computations that depend on the vanilla initial value will use the previous render frame's vanilla FOV:

```java
state.setFovDeg(state.getFovDeg() * 0.8f);
```

Typically, the interval between adjacent render frames is very short, and vanilla sprint, death, and fluid FOV effects themselves change continuously, so this difference is usually imperceptible. This strategy avoids repeatedly executing the full camera pipeline, duplicating vanilla FOV algorithms, or splitting the public API for older versions, while maintaining consistent behavior across all Minecraft versions.
