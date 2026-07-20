---
title: 自定义视角
---

> [!NOTE]
>
> 🚧 施工中 🚧

# 自定义视角

视角是 Perspective API 的核心概念。每个视角通过实现 `PerspectiveBehavior` 接口来定义相机的行为。

## 基本步骤

1. 创建一个类，实现 `PerspectiveBehavior`
2. 添加 `@PerspectiveBehavior.Info` 注解，指定视角 ID 等元数据
3. 使用 `@AutoService` 自动注册（需要 AutoService 依赖）
4. 实现 `applyTransform` 方法来设置相机位置和旋转

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

## 核心方法

### applyTransform()

传入的 `position` 和 `rotation` 是原版相机的当前值，你可以修改它们：

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

返回目标视场角（FOV），默认返回原版值：

```java
@Override
public float applyFov(@NonNull PerspectiveContext ctx, float vanillaFovDeg) {
    return 90.0f;
}
```

## 可用性检查

实现 `isAvailable()` 方法以定义可用性检查逻辑。当它返回 `false` 时，视角不可用。

```java
@Override
public boolean isAvailable() {
    return true;
}
```

> [!WARNING]
> 一旦返回 `false`，`clientTickWhenActive` 和 `renderTickWhenActive` 将很可能不再被调用。不要在这些回调中更新缓存的可用性状态，否则会导致死锁。
