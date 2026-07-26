---
title: 视角修饰器
---

# 视角修饰器

视角修饰器（`PerspectiveModifier`）用于在任意基础视角之上叠加相机效果，例如爆炸抖动、呼吸起伏或临时缩放。修饰器只处理相机状态，不负责切换视角。

修饰器在基础视角之后、过渡插值之前执行。多个修饰器按 `priority` 从小到大依次修改同一个目标状态；优先级相同时按注册顺序执行。

## 实现修饰器

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

`apply` 可同时修改 `state.position()`、`state.rotation()` 和 FOV。和视角回调一样，`state`、`ctx` 及其返回的可变对象均不得保存到回调之外。

## 注册和移除

修饰器本身没有 ID。注册时由调用方提供唯一的 `key`：

```java
CameraShakeModifier shake = new CameraShakeModifier();

PerspectiveAPI.runWhenReady(
    "mymod.camera_shake",
    () -> PerspectiveAPI.getModifierChain().register(
        "mymod.camera_shake", 100, shake));
```

不再需要时可移除：

```java
PerspectiveAPI.getModifierChain().unregister("mymod.camera_shake");
```

使用相同 `key` 再次注册会替换旧条目，并按一次新注册重新确定同优先级下的顺序。

## 可用性与容错

`isAvailable()` 返回 `false` 时，本帧会跳过该修饰器，但不会将其从链中移除。

每个修饰器都在独立的保护边界中执行。若修饰器抛出异常，或写入了无效的位置、旋转或 FOV，本次修改会被撤销并记录日志，后续修饰器仍会继续执行。不要依赖这个机制处理正常分支，应在 `apply` 中主动避免非有限数值和无效四元数。
