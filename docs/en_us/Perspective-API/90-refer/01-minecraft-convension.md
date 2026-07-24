---
title: Minecraft Rotation Convention
---

# Minecraft Rotation Convention

## World Coordinate System

| Axis | Positive (+) | Negative (-) |
| ---- | ------------ | ------------ |
| X    | East         | West         |
| Y    | Up           | Down         |
| Z    | South        | North        |

## Euler Angles

The Euler angle format is `(xRot, yRot)` (pitch, yaw), stored as two `float` fields in `Entity`.

### Zero Euler Angle (0, 0)

When `pitch=0, yaw=0`, both the camera and the entity face South (+Z).

### Direction

| Angle        | Axis | Positive Direction   | Negative Direction           |
| ------------ | ---- | -------------------- | ---------------------------- |
| pitch (xRot) | X    | Looking down         | Looking up                   |
| yaw (yRot)   | Y    | Clockwise from above | Counter-clockwise from above |

## Quaternion (Camera)

`net.minecraft.client.Camera` uses quaternions internally.

### Identity Quaternion Orientation

The identity quaternion (`new Quaternionf()`) represents "no rotation", i.e., the default forward direction vector. The default forward direction differs across versions:

| MC Version | Default Forward | Identity Quaternion Orientation |
| ---------- | --------------- | ------------------------------- |
| >= 1.21    | (0, 0, -1)      | North (-Z)                      |
| < 1.21     | (0, 0, 1)       | South (+Z)                      |

### Quaternion Construction

All versions use the YXZ rotation order to construct quaternions, differing only in the input parameters:

| MC Version | Construction                          | Pitch Sign | Yaw Offset |
| ---------- | ------------------------------------- | ---------- | ---------- |
| >= 1.21    | `rotationYXZ(PI - yaw, -pitch, roll)` | Negated    | PI         |
| < 1.21     | `rotationYXZ(-yaw, pitch, roll)`      | Unchanged  | 0          |

The yaw offset compensates for the difference between the OpenGL convention (-Z forward) and the Minecraft convention (yaw=0 faces +Z South).
