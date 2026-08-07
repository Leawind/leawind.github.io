---
title: Projection Modes
---

# Projection Modes

This page defines the units, valid ranges, and scope of projection-related values. Camera position and rotation are separate state; projection parameters do not change their coordinate meanings.

## Perspective field of view

Perspective field of view is measured in degrees. Valid values must satisfy:

$$
0 < \mathrm{FOV} < 180
$$

Both bounds are exclusive. The field of view must also be finite, not NaN or positive or negative infinity. Field of view is meaningful only for perspective projection; when orthographic projection is active, the value can remain in the camera state but does not participate in world-projection calculations.

## Orthographic view height

Orthographic view height is the vertical span of the visible area, measured in world-coordinate units. Valid values must satisfy:

$$
\mathrm{height} \geq 0.0001
$$

The value must also be finite; there is no specified upper bound. The viewport's horizontal span is determined by the vertical span and the viewport aspect ratio:

$$
\mathrm{width}=\mathrm{height}\times\frac{\mathrm{viewport\ width}}
{\mathrm{viewport\ height}}
$$

The smaller the orthographic view height, the more screen space a unit of world distance occupies. It is the scale of orthographic projection, not an angle, and must not be converted to or from perspective field of view.

Orthographic projection is centered on the camera position and looks along the camera direction. Camera position, rotation, and orthographic view height respectively control the view center, view direction, and visible range.

## Invalid values

An invalid field of view or orthographic view height cannot become the final camera state. The camera-state pipeline rejects that field and restores the valid value from before the current stage began; callers therefore cannot disable a projection parameter with a non-finite or out-of-range value.

## Transitions

During perspective-switch transitions, field of view and orthographic view height are treated as separate continuous values. Projection mode itself is a discrete selection: switching between perspective and orthographic projection happens directly, and the two projections cannot be numerically interpolated.
