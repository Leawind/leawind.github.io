---
title: 投影模式
---

# 投影模式

`PerspectiveState` 可分别控制相机变换和世界的投影方式。默认使用与原版一致的透视投影（`ProjectionMode.PERSPECTIVE`）；实验性的正交投影（`ProjectionMode.ORTHOGRAPHIC`）则会移除近大远小的透视效果，适合俯视地图、等距视角和二维化的游戏画面。

## 使用正交投影

在 `applyCameraState` 或 `PerspectiveModifier.apply` 中设置投影模式和正交视图高度：

```java
@Override
public void applyCameraState(
    PerspectiveState.Mutable state, PerspectiveContext context) {
  state.setProjectionMode(ProjectionMode.ORTHOGRAPHIC);
  state.setOrthographicHeight(24.0f);
}
```

`orthographicHeight` 是可见区域在世界坐标中的垂直跨度，必须为有限的正数。水平方向跨度由窗口宽高比决定：

```text
horizontal span = orthographicHeight × viewport aspect ratio
```

例如，高度为 `24`、窗口宽高比为 `16:9` 时，可见区域约为 `42.67 × 24` 个方块。该值越小，画面中的物体越大；它相当于正交投影中的缩放级别，而不是 FOV。

正交视图以相机前方轴为中心，仍使用 `state.position()` 和 `state.rotation()` 决定观察位置与方向。相机碰撞、第三人称基础位置等仍由所选 `baseType` 的原版相机状态提供；如有需要，再在回调中修改状态。

## 切回透视投影

```java
state.setProjectionMode(ProjectionMode.PERSPECTIVE);
state.setFovDeg(70.0f);
```

FOV 仅在透视投影时生效，正交高度仅在正交投影时生效。两项数值会保留在状态中，因此切换模式时建议同时明确设置当前模式所需的参数。

## 过渡

在视角切换过渡中，位置、旋转、FOV 和正交高度会插值；投影模式会直接切换，不能在透视和正交之间渐变。
