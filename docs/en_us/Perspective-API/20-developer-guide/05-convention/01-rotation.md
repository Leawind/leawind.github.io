---
title: Rotation Representation
---

# Rotation Representation

In the public API of this mod, the rotation representation is always consistent, regardless of the Minecraft version.

## Euler Angles

When using a vector to represent Euler angles, each dimension is defined as follows:

| Dimension | Meaning | Positive Direction                                                      |
| --------- | ------- | ----------------------------------------------------------------------- |
| x         | Pitch   | Rotating downward                                                       |
| y         | Yaw     | Clockwise when viewed from above                                        |
| z         | Roll    | Clockwise around the view direction (i.e., counter-clockwise on screen) |

For a 2D vector, treat z as 0.

### Origin

The zero Euler angle `(pitch, yaw, roll) = (0, 0, 0)` represents the following orientation:

| Direction | Direction Vector |
| --------- | ---------------- |
| Forward   | `(0, 0, 1)`      |
| Up        | `(0, 1, 0)`      |
| Left      | `(-1, 0, 0)`     |

> [!TIP]
>
> This API's Euler-angle convention matches the one currently used by Minecraft entities and cameras. Even if vanilla's internal implementation changes in the future, the public API will retain the convention defined here.

## Quaternion

### Origin

The identity quaternion (zero imaginary part, real part of 1) represents the same orientation as the zero Euler angle:

| Direction | Direction Vector |
| --------- | ---------------- |
| Forward   | `(0, 0, 1)`      |
| Up        | `(0, 1, 0)`      |
| Left      | `(-1, 0, 0)`     |

Unit quaternions are always used.

> [!TIP]
>
> Minecraft's camera identity quaternion orientation changes across versions. Perspective API handles this difference in its bridge layer; API users should not compensate for it themselves. See [Minecraft Rotation Convention](../refer/minecraft-convension).
>
> This API always uses `+Z` as the initial rotation orientation to align with the Euler-angle origin convention.

### Rotation Order

When constructing a quaternion from Euler angles, the `Y-X-Z` rotation order is used. Use `PerspectiveMath.eulerDegToQuat` or `PerspectiveMath.eulerRadToQuat` to avoid reimplementing the conversion details.

## Unit Vector

A unit vector pointing from the origin to a target can represent orientation, but cannot represent roll.

Converting from Euler angles or quaternions to this format will lose the roll information.

## Identifier Naming Convention

Parameters and variables that represent angles must use a suffix that indicates the unit:

- `Deg` for degrees, for example `fovDeg` and `yawDeg`
- `Rad` for radians, for example `rollRad`
