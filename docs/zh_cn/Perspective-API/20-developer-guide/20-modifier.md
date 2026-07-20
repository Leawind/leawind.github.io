---
title: 视角修饰器
---

> [!NOTE]
>
> 🚧 施工中 🚧

# 视角修饰器

视角修饰器（`PerspectiveModifier`）允许在任何视角之上叠加额外的相机效果，而无需修改视角本身。

修饰器在基础视角的 `applyTransform` 和 `applyFov` 之后、过渡插值之前执行。所有修饰器按优先级升序依次执行。

## 基本用法

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

## 添加和移除

```java
PerspectiveAPI.getModifierChain().register("mymod.shake", 100, new CameraShakeModifier());

PerspectiveAPI.getModifierChain().unregister("mymod.shake");
```

## 注意事项

- 直接修改传入的 `position` 和 `rotation` 对象，不要存储它们的引用
- `applyFov` 返回的值必须在 `[0, 180]` 范围内
- 异常会被捕获并记录日志，不影响其他修饰器
