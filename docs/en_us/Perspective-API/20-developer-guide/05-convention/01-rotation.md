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
> In the public API of this mod, the Euler angle convention is identical to the Euler angles used for entities and the camera in Minecraft source code — at least as of Minecraft 26.2, and likely for future versions as well.

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
> In Minecraft, the camera (`net.minecraft.client.Camera`) computes a quaternion from its Euler angles for rendering. Before 1.21, it uses South (+Z) as the identity quaternion orientation; from 1.21 onward, it uses North (-Z).
>
> The public API of this mod uses +Z as the initial rotation orientation to align with the Euler angle origin convention.

### Rotation Order

When constructing a quaternion from Euler angles, the `Y X Z` order is used.

## Unit Vector

A unit vector pointing from the origin to a target can represent orientation, but cannot represent roll.

Converting from Euler angles or quaternions to this format will lose the roll information.

# Identifier Naming Convention

- When using Euler angles, use suffixes in identifiers to indicate the unit
  - `Rad` for radians
  - `Deg` for degrees
