---
title: Projection Modes
---

# Projection Modes

`PerspectiveState` controls both the camera transform and the projection used to render the world. The default is vanilla-compatible perspective projection (`ProjectionMode.PERSPECTIVE`). Experimental orthographic projection (`ProjectionMode.ORTHOGRAPHIC`) removes perspective foreshortening and is useful for top-down maps, isometric views, and 2D-style scenes.

## Using orthographic projection

Set the projection mode and orthographic view height in `applyCameraState` or `PerspectiveModifier.apply`:

```java
@Override
public void applyCameraState(PerspectiveState.Mutable state, PerspectiveContext context) {
  state.setProjectionMode(ProjectionMode.ORTHOGRAPHIC);
  state.setOrthographicHeight(24.0f);
}
```

`orthographicHeight` is the vertical span visible in world coordinates and must be a finite positive number. The horizontal span is determined by the viewport aspect ratio:

```text
horizontal span = orthographicHeight × viewport aspect ratio
```

For example, with a height of `24` and a `16:9` viewport, the visible area is about `42.67 × 24` blocks. The smaller the value, the larger objects appear. It acts as the orthographic zoom level, not as FOV.

The orthographic view is centered on the camera's forward axis; `state.position()` and `state.rotation()` still determine its position and direction. Camera collision and the base third-person position still come from the vanilla camera state for the selected `baseType`; modify the state further in the callback if needed.

## Returning to perspective projection

```java
state.setProjectionMode(ProjectionMode.PERSPECTIVE);
state.setFovDeg(70.0f);
```

FOV applies only to perspective projection; orthographic height applies only to orthographic projection. Since both values remain in the state, set the parameters needed by the active mode explicitly when switching modes.

## Transitions

During transitions, position, rotation, FOV, and orthographic height are interpolated. The projection mode switches directly and cannot be smoothly interpolated.
