---
title: 示例模组
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

# 视角 API 演示

<img src="/perspective_api_demo/wheel.gif" class="demo-img"/>

这是一个单独的模组，基于 [视角 API](../index.md) 实现了一些简单的功能。

![API version](https://img.shields.io/github/v/tag/Leawind/Perspective-API-Demo?label=Version&color=818181)

</div>

> [!TIP]
> 本模组并非用于实际游玩，所以功能并不完美，例如自由相机下仍可用鼠标破坏/放置方块，这不被视为幺蛾子。

## 视角：自由第三人称

类似于原版的第三人称视角，但鼠标移动时仅转动相机，玩家实体不会随之转动，玩家实体会自动转向移动方向。

<img src="/perspective_api_demo/free_third_person-rotate.gif" class="demo-img"/>

用鼠标滚轮可以同时调整相机与玩家间的距离与视野大小，实现以玩家实体为主体的希区柯克式变焦（Dolly Zoom）效果。

<img src="/perspective_api_demo/free_third_person-dolly.gif" class="demo-img"/>

## 视角：自由相机

相机脱离玩家实体，可独立控制。

<img src="/perspective_api_demo/free_camera.gif" class="demo-img"/>

操控方式：

- 鼠标移动控制相机转动
- 移动键控制相机移动
- 空格/潜行键可以上升/下降
- 丢弃/物品栏（默认 `Q`/`E`）键可以让相机滚转，即以垂直于画面的线为轴旋转
- 鼠标滚轮可以调整飞行速度

这些移动操作都基于相机的局部参考系，而非世界参考系。

## 视角：简单第三人称

与原版的第三人称背面视角几乎相同，只是修改了相机位置，让玩家位于画面左下部。

<img src="/perspective_api_demo/simple_third_person.gif" class="demo-img"/>

## 修饰器：爆炸抖动

<img src="/perspective_api_demo/explode_shake.gif" class="demo-img"/>

这是一个视角修饰器，根据爆炸的发生时间、爆炸半径、与相机的距离计算其对相机的影响程度，从而为相机施加抖动效果。

## 相关链接

|            |              |
| ---------- | ------------ |
| 源码       | [Github]     |
| Modrinth   | [Modrinth]   |
| CurseForge | [CurseForge] |

---

[Github]: https://github.com/Leawind/Perspective-API-Demo
[Modrinth]: https://modrinth.com/mod/perspective-api-demo
[CurseForge]: https://www.curseforge.com/minecraft/mc-mods/perspective-api-demo
