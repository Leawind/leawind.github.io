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

`apply` 可同时修改 `state.position()`、`state.rotation()` 和投影参数（FOV 或正交高度）。和视角回调一样，`state`、`ctx` 及其返回的可变对象均不得保存到回调之外。

## 注册和移除

注册会返回一个拥有该条目的句柄：

```java
CameraShakeModifier shake = new CameraShakeModifier();
PerspectiveModifierRegistration registration =
    PerspectiveAPI.getModifierChain().register(
        "mymod.camera_shake", 100, shake);
```

如果初始化时运行时服务可能尚未就绪，请在 `runWhenReady` 中注册并把句柄保存到模组自己的
状态中。

不再需要时通过句柄移除：

```java
registration.unregister();
```

修饰器 ID 是全局唯一的诊断标识符；同一个 ID 不能同时注册两次。不同 ID 的条目按优先级
从小到大执行，同优先级的条目按注册顺序执行。每个注册条目都有独立句柄。

## 可用性与容错

`isAvailable()` 返回 `false` 时，本帧会跳过该修饰器，但不会将其从链中移除。API 不会为修饰器
调度客户端刻；需要每刻更新状态的实现应订阅自己的加载器事件，并在此返回缓存值。

每个修饰器都在独立的保护边界中执行。若修饰器抛出异常，或写入了无效的位置、旋转或 FOV，本次修改会被撤销并记录日志，后续修饰器仍会继续执行。不要依赖这个机制处理正常分支，应在 `apply` 中主动避免非有限数值和无效四元数。
