---
title: Custom Perspective
---

# Custom Perspective

Perspectives are the core units of Perspective API. Each perspective implements `PerspectiveBehavior` and modifies position, rotation, and FOV in one callback, so it does not need to know the camera injection point for each Minecraft version.

## Registering a perspective

Implementations must add `@PerspectiveInfo.Declaration` and be registered through Java SPI. We recommend using [AutoService] to generate the service file automatically:

```java
@AutoService(PerspectiveBehavior.class)
@PerspectiveInfo.Declaration(
    id = SideViewPerspective.ID,
    baseType = PerspectiveBehavior.BaseType.THIRD_PERSON_BACK,
    priority = 10,
    nameKey = "perspective.mymod.side_view.name")
public final class SideViewPerspective implements PerspectiveBehavior {
  public static final String ID = "mymod.side_view";

  @Override
  public void applyCameraState(
      PerspectiveState.Mutable state, PerspectiveContext context) {
    Entity entity = context.cameraEntity();
    if (entity == null) return;

    Vec3 eye = entity.getEyePosition(context.partialTicks());
    state.position().set(eye.x + 3.0, eye.y, eye.z);
    state.setFovDeg(70.0f);
  }
}
```

Without AutoService, create `META-INF/services/io.github.leawind.perspectiveapi.api.PerspectiveBehavior` and list each implementation's fully qualified class name on its own line.

## Metadata

The main fields of `@PerspectiveInfo.Declaration` are:

| Field            | Description                                                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `id`             | A non-empty perspective ID; `<modid>.<path>` is recommended.                                                                   |
| `baseType`       | The vanilla base perspective used for state not overridden by the perspective.                                                 |
| `nameKey`        | Translation key for the display name; defaults to `perspective.<id>.name` when empty.                                          |
| `descriptionKey` | Optional translation key for a description.                                                                                    |
| `icon`           | Optional icon resource identifier.                                                                                             |
| `switchable`     | Whether players may select it in the perspective switcher; it may still be activated through the override chain when disabled. |
| `priority`       | Lower values appear earlier in switch order; also resolves duplicate IDs.                                                      |

To select a perspective by default at startup, also add `@PerspectiveInfo.Default` to its implementation. When multiple default perspectives exist, the definition with the higher `priority` takes precedence.

## Registering runtime perspectives

For runtime data such as player-saved presets, construct `PerspectiveInfo` directly and call the registry. This does not read annotations from the `PerspectiveBehavior` class:

```java
PerspectiveInfo info =
    PerspectiveInfo.builder("mymod.preset.combat", Component.literal("Combat View"))
        .baseType(PerspectiveBehavior.BaseType.THIRD_PERSON_BACK)
        .priority(100)
        .build();

PerspectiveRegistration registration =
    PerspectiveAPI.getRegistry().register(info, new CombatPresetPerspective());
```

Every registered ID and `PerspectiveBehavior` **instance** must be unique. Retain the returned `PerspectiveRegistration`: it is the handle for this registration, and only it can update or remove its perspective. Therefore, even if the ID is later reused, an old handle cannot accidentally remove the new perspective.

```java
registration.updateInfo(
    PerspectiveInfo.builder("mymod.preset.combat", Component.literal("Combat View (Updated)"))
        .baseType(PerspectiveBehavior.BaseType.THIRD_PERSON_BACK)
        .priority(200)
        .build());

registration.unregister();
```

`updateInfo` cannot change the ID, and a removed handle cannot be updated. `registration.perspective().info()` returns the current metadata; the `Perspective` instance itself remains unchanged after an update.

To include a runtime perspective in default-perspective selection, use `PerspectiveAPI.getRegistry().registerDefault(info, defaultPriority, behavior)`. The last default perspective cannot be removed, ensuring that the API always has a fallback default.

## Modifying camera state

`applyCameraState` is called once per render frame. The supplied `state` initially contains the vanilla camera state and can be modified in place:

```java
@Override
public void applyCameraState(
    PerspectiveState.Mutable state, PerspectiveContext ctx) {
  state.position().add(0.0, 1.0, 0.0);
  state.rotation().rotateLocalY((float) Math.toRadians(15.0));
  state.setFovDeg(90.0f);
}
```

Position uses world coordinates, rotation uses a unit quaternion, and FOV is measured in degrees. Perspective projection is used by default; orthographic projection is also available—see [Projection Modes]. For rotation conventions, see [Rotation Representation].

`state` and `ctx` are valid only during this callback. Do not retain them, or references returned by `state.position()` or `state.rotation()`; copy their values when they are needed across frames.

## Lifecycle

| Callback                | When it is called                                                                                                                 |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `init`                  | Once when the perspective has been registered and initialized.                                                                    |
| `onActivate`            | When the perspective becomes current.                                                                                             |
| `onDeactivate`          | When the perspective is no longer current.                                                                                        |
| `clientTickWhenActive`  | Every client game tick while the perspective is active.                                                                           |
| `applyCameraState`      | To modify the target camera state for this frame.                                                                                 |
| `afterApplyCameraState` | After the final state is written to the camera; suitable for work such as raycasting that depends on the actual render viewpoint. |

Typically, update game logic in `clientTickWhenActive`, and read per-frame input and calculate camera state in `applyCameraState`. Use `afterApplyCameraState` when work depends on the final state written to the camera.

## Availability and transitions

When `isAvailable()` returns `false`, the switcher and override chain skip the perspective. The result is evaluated at most once per valid client game tick, so implementations must not depend on invocation count or side effects.

`allowTransitionIn()` and `allowTransitionOut()` control whether smooth transitions are allowed when entering and leaving the perspective. A smooth transition is not used if either side disallows it.

## Initialization timing

When registry, modifier-chain, or override-chain access is needed, wait for Perspective API initialization with `PerspectiveAPI.runWhenReady`:

```java
PerspectiveAPI.runWhenReady(
    "mymod.register_camera_features",
    () -> {
      boolean available = PerspectiveAPI.getRegistry().contains(SideViewPerspective.ID);
      // Access Perspective API runtime services here.
    });
```

If the API is already ready, the operation runs synchronously before the method returns. Otherwise, it runs once initialization has completed.

[AutoService]: https://github.com/google/auto/tree/main/service
[Projection Modes]: ./convention/projection
[Rotation Representation]: ./convention/rotation
