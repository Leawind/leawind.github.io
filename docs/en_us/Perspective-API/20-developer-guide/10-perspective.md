---
title: Custom Perspective
---

> [!NOTE]
>
> 🚧 Under Construction 🚧

# Custom Perspective

Perspectives are the core concept of Perspective API. Each perspective defines camera behavior by implementing the `PerspectiveBehavior` interface.

## Basic Steps

1. Create a class that implements `PerspectiveBehavior`
2. Add the `@PerspectiveBehavior.Info` annotation with metadata such as the perspective ID
3. Use `@AutoService` for automatic registration (requires the AutoService dependency)
4. Implement the `applyTransform` method to set the camera position and rotation

```java
@AutoService(PerspectiveBehavior.class)
@PerspectiveBehavior.Info(
    id = "mymod.side_view",
    priority = 10,
    nameKey = "perspective.mymod.side_view.name",
    cameraType = CameraType.THIRD_PERSON_BACK)
public class SideViewPerspective implements PerspectiveBehavior {

    public static final String ID = "mymod.side_view";
    private final Vector3d position = new Vector3d();
    private final Quaternionf rotation = new Quaternionf();

    @Override
    public void renderTickWhenActive(PerspectiveContext context) {
        Entity entity = context.entity();
        if (entity == null) return;

        var eyePos = entity.getEyePosition(context.partialTicks());
        var rotVec = entity.getRotationVector();
        PerspectiveMath.eulerDegToQuat(new Vector2f(rotVec.x, rotVec.y), rotation);

        var right = PerspectiveMath.getRight(rotation, new Vector3f());
        position.set(eyePos.x + right.x * 3, eyePos.y, eyePos.z + right.z * 3);

        var lookAt = new Vector3f(
            (float)(eyePos.x - position.x),
            (float)(eyePos.y - position.y),
            (float)(eyePos.z - position.z));
        PerspectiveMath.directionToQuat(lookAt, rotation);
    }

    @Override
    public void applyTransform(
        @NonNull PerspectiveContext ctx,
        @NonNull Vector3d position,
        @NonNull Quaternionf rotation) {
        position.set(this.position);
        rotation.set(this.rotation);
    }
}
```

## Core Methods

### applyTransform()

The passed-in `position` and `rotation` are the vanilla camera's current values — you can modify them:

```java
@Override
public void applyTransform(
    @NonNull PerspectiveContext ctx,
    @NonNull Vector3d position,
    @NonNull Quaternionf rotation) {
    position.set(this.position);
    rotation.set(this.rotation);
}
```

### applyFov()

Returns the target field of view (FOV). The default returns the vanilla value:

```java
@Override
public float applyFov(@NonNull PerspectiveContext ctx, float vanillaFovDeg) {
    return 90.0f;
}
```

## Availability Check

Implement the `isAvailable()` method to define availability check logic. When it returns `false`, the perspective is unavailable.

```java
@Override
public boolean isAvailable() {
    return true;
}
```

> [!WARNING]
> Once `false` is returned, `clientTickWhenActive` and `renderTickWhenActive` will likely no longer be called. Do not update cached availability state in these callbacks, as it will cause a deadlock.
