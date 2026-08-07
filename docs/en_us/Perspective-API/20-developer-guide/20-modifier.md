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

Registration returns a handle that owns the entry:

```java
CameraShakeModifier shake = new CameraShakeModifier();
PerspectiveModifierRegistration registration =
    PerspectiveAPI.getModifierChain().register(
        "mymod.camera_shake", 100, shake);
```

If runtime services might not be ready during initialization, register inside `runWhenReady` and retain the handle in your mod's own state.

Remove it through the handle when it is no longer needed:

```java
registration.unregister();
```

Modifier IDs are globally unique diagnostic identifiers: an ID cannot be registered twice at the same time. Entries with different IDs run in ascending priority order, and equal priorities run in registration order. Every registered entry has its own handle.

## Availability and fault tolerance

When `isAvailable()` returns `false`, the modifier is skipped for the current frame but remains in the chain. The API does not schedule client ticks for modifiers; implementations that need per-tick state updates should subscribe to their own loader's event and return cached values here.

Each modifier runs in an isolated protection boundary. If a modifier throws an exception or writes an invalid position, rotation, or FOV, its changes are rolled back and logged, and later modifiers still run. Do not rely on this for normal control flow; proactively avoid non-finite values and invalid quaternions in `apply`.
