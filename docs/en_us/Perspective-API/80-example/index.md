---
title: Demo Mod
---

<style>
img.demo-img  {
  width: 90%;
  margin: 1.6em auto;
}
</style>

<div align="center">

<img src="/icons/perspective-api-demo.png" alt="Perspective API" style="image-rendering:pixelated;height:10em;">

---

# Perspective API Demo

<img src="/perspective_api_demo/wheel.gif" class="demo-img"/>

A standalone mod that implements several simple features on top of [Perspective API](../index.md).

![API version](https://img.shields.io/github/v/tag/Leawind/Perspective-API-Demo?label=Version&color=818181)

</div>

> [!TIP]
> This mod is not intended for actual gameplay, so the features are not perfect — for example, you can still break/place blocks with the mouse in free camera mode. This is not considered a bug.

## Perspective: Free Third Person

Similar to vanilla third-person view, but mouse movement only rotates the camera — the player entity does not rotate with it. The player entity automatically turns toward the movement direction.

<img src="/perspective_api_demo/free_third_person-rotate.gif" class="demo-img"/>

Using the mouse scroll wheel, you can simultaneously adjust the distance between the camera and the player and the field of view, achieving a Hitchcock-style Dolly Zoom effect centered on the player entity.

<img src="/perspective_api_demo/free_third_person-dolly.gif" class="demo-img"/>

## Perspective: Free Camera

The camera detaches from the player entity and can be controlled independently.

<img src="/perspective_api_demo/free_camera.gif" class="demo-img"/>

Controls:

- Mouse movement controls camera rotation
- Movement keys control camera movement
- Space / Sneak keys to ascend / descend
- Drop / Inventory keys (default `Q` / `E`) to roll the camera — rotating around the axis perpendicular to the screen
- Mouse scroll wheel to adjust flight speed

All movement is based on the camera's local reference frame, not the world reference frame.

## Perspective: Simple Third Person

Nearly identical to vanilla third-person back view, except the camera position is modified so the player appears in the lower-left of the screen.

<img src="/perspective_api_demo/simple_third_person.gif" class="demo-img"/>

## Modifier: Explosion Shake

<img src="/perspective_api_demo/explode_shake.gif" class="demo-img"/>

A perspective modifier that calculates the effect of explosions on the camera based on the explosion timing, radius, and distance from the camera, applying a shake effect.

## Links

|            |              |
| ---------- | ------------ |
| Source     | [GitHub]     |
| Modrinth   | [Modrinth]   |
| CurseForge | [CurseForge] |

---

[GitHub]: https://github.com/Leawind/Perspective-API-Demo
[Modrinth]: https://modrinth.com/mod/perspective-api-demo
[CurseForge]: https://www.curseforge.com/minecraft/mc-mods/perspective-api-demo
