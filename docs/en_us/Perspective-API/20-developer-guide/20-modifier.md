---
title: Perspective Modifier
---

# Perspective Modifier

`PerspectiveModifier` layers camera effects—such as explosion shake, breathing motion, or temporary zoom—on top of any base perspective. Modifiers only process camera state; they do not switch perspectives.

Modifiers run after the base perspective and before transition interpolation. Multiple modifiers modify the same target state in ascending `priority` order; equal priorities run in registration order.

## Implementing a modifier

```java
public final class CameraShakeModifier implements PerspectiveModifier {
  private float intensity;

  public void trigger(float intensity) {
    this.intensity = Math.max(this.intensity, intensity);
  }

  @Override
  public boolean isAvailable() {
    return intensity > 0.001f;
  }

  @Override
  public void apply(PerspectiveState.Mutable state, PerspectiveContext ctx) {
    float phase = ctx.partialTicks() * 12.0f;
    float yawRad = (float) Math.sin(phase) * intensity;
    state.rotation().rotateLocalY(yawRad);
    intensity *= 0.9f;
  }
}
```

`apply` may modify `state.position()`, `state.rotation()`, and projection parameters (FOV or orthographic height). As with perspective callbacks, do not retain `state`, `ctx`, or their returned mutable objects outside the callback.

## Registering and removing

Modifiers do not have IDs themselves. The caller supplies a unique `key` when registering one:

```java
CameraShakeModifier shake = new CameraShakeModifier();

PerspectiveAPI.runWhenReady(
    "mymod.camera_shake",
    () -> PerspectiveAPI.getModifierChain().register(
        "mymod.camera_shake", 100, shake));
```

Remove it when it is no longer needed:

```java
PerspectiveAPI.getModifierChain().unregister("mymod.camera_shake");
```

Registering the same `key` again replaces the old entry and establishes a new same-priority insertion order.

## Availability and fault tolerance

When `isAvailable()` returns `false`, the modifier is skipped for the current frame but remains in the chain.

Each modifier runs in an isolated protection boundary. If a modifier throws an exception or writes an invalid position, rotation, or FOV, its changes are rolled back and logged, and later modifiers still run. Do not rely on this for normal control flow; proactively avoid non-finite values and invalid quaternions in `apply`.
