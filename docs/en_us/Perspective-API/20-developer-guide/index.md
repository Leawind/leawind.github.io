---
title: Developer Guide
---

# Developer Guide

> [!WARNING]
>
> <img src="https://img.shields.io/github/v/tag/Leawind/Perspective-API?label=Latest&color=818181" style="display:inline">
>
> Before the official release, the API is subject to breaking changes at any time.
>
> After the official release, APIs annotated with `@ApiStatus.Experimental` may still undergo breaking changes without incrementing the major version.

## Why Would I Use This?

A unified camera state management mechanism allows multiple mods that modify camera states to coexist harmoniously:

- Players no longer have to choose between two third-person perspective mods when installing mods
- No single mod can aggressively override camera state changes made by others

Additionally:

- For simple perspectives or visual effects, you no longer need to figure out how to inject into Minecraft to modify camera states
- Supports most mainstream Minecraft versions starting from 1.20.1 simultaneously

## Basic Concepts

### Camera State

Includes position, rotation, projection type, perspective FOV, orthographic view height, etc.

### Perspective

- Perspectives can be registered via SPI or dynamically registered/unregistered at runtime
- Perspectives have constant metadata such as ID and name
- Perspective behavior includes updating the camera state during render ticks, updating availability during client ticks, and various event callbacks

## How It Works

Perspective API essentially does two things:

1. Determines which perspective is currently active during the client tick
2. Computes the camera state based on the relevant information during the render tick

> 🚧🚧🚧🚧 Under Construction
