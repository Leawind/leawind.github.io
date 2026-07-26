---
title: 自定义视角
---

# 自定义视角

视角是 Perspective API 的基础组成单元。每个视角通过实现 `PerspectiveBehavior`，在同一次回调中修改位置、旋转和 FOV，因而不需要了解不同 Minecraft 版本的相机注入位置。

## 注册视角

实现类必须添加 `@PerspectiveBehavior.Info`，并通过 Java SPI 注册。推荐使用 [AutoService] 自动生成服务文件：

```java
@AutoService(PerspectiveBehavior.class)
@PerspectiveBehavior.Info(
    id = SideViewPerspective.ID,
    baseType = PerspectiveBehavior.BaseType.THIRD_PERSON_BACK,
    priority = 10,
    nameKey = "perspective.mymod.side_view.name")
public final class SideViewPerspective implements PerspectiveBehavior {
  public static final String ID = "mymod.side_view";

  @Override
  public void applyCameraState(
      PerspectiveState.Mutable state, PerspectiveContext ctx) {
    Entity entity = ctx.entity();
    if (entity == null) return;

    Vec3 eye = entity.getEyePosition(ctx.partialTicks());
    state.position().set(eye.x + 3.0, eye.y, eye.z);
    state.setFovDeg(70.0f);
  }
}
```

若不使用 AutoService，请创建
`META-INF/services/io.github.leawind.perspectiveapi.api.PerspectiveBehavior`，并在文件中逐行填写实现类的完整类名。

## 元数据

`@PerspectiveBehavior.Info` 的主要字段如下：

| 字段             | 说明                                                   |
| ---------------- | ------------------------------------------------------ |
| `id`             | 非空视角 ID，推荐使用 `<modid>.<path>`                 |
| `baseType`       | 未被视角覆盖的状态所采用的原版基础视角                 |
| `nameKey`        | 显示名称的翻译键；留空时为 `perspective.<id>.name`     |
| `descriptionKey` | 可选的描述翻译键                                       |
| `icon`           | 可选的图标资源标识符                                   |
| `switchable`     | 是否允许玩家通过视角切换器选中；关闭后仍可由覆盖链激活 |
| `priority`       | 数值越小，在切换顺序中越靠前；也用于解决重复 ID        |

如需指定启动时的默认视角，可在实现类上再添加 `@PerspectiveBehavior.Default`。
存在多个默认视角时，`priority` 较大的定义优先。

## 修改相机状态

`applyCameraState` 每个渲染帧调用一次。传入的 `state` 初始包含原版相机状态，可以就地修改：

```java
@Override
public void applyCameraState(
    PerspectiveState.Mutable state, PerspectiveContext ctx) {
  state.position().add(0.0, 1.0, 0.0);
  state.rotation().rotateLocalY((float) Math.toRadians(15.0));
  state.setFovDeg(90.0f);
}
```

位置使用世界坐标，旋转使用单位四元数，FOV 的单位是角度。旋转约定见[旋转的表示方式](./convention/rotation)。

`state` 和 `ctx` 都只在本次回调期间有效。不要保存它们，也不要保存
`state.position()` 或 `state.rotation()` 返回对象的引用；若需要跨帧使用，请复制数值。

## 生命周期

| 回调                   | 调用时机                                                     |
| ---------------------- | ------------------------------------------------------------ |
| `init`                 | 视角完成注册和初始化时调用一次                               |
| `onActivate`           | 视角成为当前视角时调用                                       |
| `onDeactivate`         | 视角不再是当前视角时调用                                     |
| `clientTickWhenActive` | 视角激活期间，每个客户端游戏刻调用                           |
| `preApplyWhenActive`   | 每个渲染帧中，在计算相机状态前调用                           |
| `applyCameraState`     | 修改本帧的目标相机状态                                       |
| `postApplyWhenActive`  | 最终状态写入相机后调用，适合依赖实际渲染视点的射线检测等操作 |

通常在 `clientTickWhenActive` 更新游戏逻辑，在 `preApplyWhenActive` 读取逐帧输入，在 `applyCameraState` 中只计算相机状态。

## 可用性与过渡

`isAvailable()` 返回 `false` 时，切换器和覆盖链会跳过该视角。该结果在一个有效客户端游戏刻内最多计算一次，因此实现不应依赖调用次数或副作用。

`allowTransitionIn()` 和 `allowTransitionOut()` 分别控制进入和离开该视角时是否允许平滑过渡。只要任一侧不允许，切换时就不会使用平滑过渡。

## 初始化时机

需要访问注册表、修饰器链或覆盖链时，应通过 `PerspectiveAPI.runWhenReady` 等待 API 初始化完成：

```java
PerspectiveAPI.runWhenReady(
    "mymod.register_camera_features",
    () -> {
      boolean available = PerspectiveAPI.getRegistry().contains(SideViewPerspective.ID);
      // 在这里访问 Perspective API 的运行时服务。
    });
```

如果 API 已就绪，操作会在调用返回前同步执行；否则会在初始化完成时执行一次。

[AutoService]: https://github.com/google/auto/tree/main/service
