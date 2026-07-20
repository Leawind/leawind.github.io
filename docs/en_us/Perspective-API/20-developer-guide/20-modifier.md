---
title: Perspective Modifier
---

> [!NOTE]
>
> 🚧 Under Construction 🚧

# Perspective Modifier

Perspective modifiers (`PerspectiveModifier`) allow layering additional camera effects on top of any perspective, without modifying the perspective itself.

Modifiers execute after the base perspective's `applyTransform` and `applyFov`, but before transition interpolation. All modifiers run sequentially in ascending priority order.

## Basic Usage

```java
public class CameraShakeModifier implements PerspectiveModifier {

    public static final String ID = "mymod.camera_shake";
    private double shakeIntensity = 0.0;

    public void triggerShake(double intensity) {
        this.shakeIntensity = intensity;
    }

    @Override
    public @NonNull String id() { return ID; }

    @Override
    public boolean isAvailable() { return shakeIntensity > 0.01; }

    @Override
    public void applyTransform(
        @NonNull PerspectiveContext ctx,
        @NonNull Vector3d position,
        @NonNull Quaternionf rotation) {

        double time = System.currentTimeMillis() / 1000.0;
        double shake = shakeIntensity * Math.exp(-3.0 * time);

        Quaternionf yawRot = new Quaternionf()
            .rotationAxis((float) Math.toRadians(shake * 45), PerspectiveMath.DOWN);
        Quaternionf pitchRot = new Quaternionf()
            .rotationAxis((float) Math.toRadians(shake * 30), PerspectiveMath.RIGHT);

        rotation.mul(pitchRot, rotation).mul(yawRot, rotation);
    }
}
```

## Registering and Unregistering

```java
PerspectiveAPI.getModifierChain().register("mymod.shake", 100, new CameraShakeModifier());

PerspectiveAPI.getModifierChain().unregister("mymod.shake");
```

## Notes

- Modify the passed-in `position` and `rotation` objects directly; do not store their references
- The value returned by `applyFov` must be within the `[0, 180]` range
- Exceptions are caught and logged without affecting other modifiers
