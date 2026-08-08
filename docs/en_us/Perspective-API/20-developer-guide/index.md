---
title: Developer Guide
---

# Developer Guide

> [!WARNING]
>
> <img src="https://img.shields.io/github/v/tag/Leawind/Perspective-API?label=Latest&color=818181" style="display:inline">
>
> Before the official release, the API is subject to breaking changes at any time.

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
- Perspective behavior includes updating the camera state in render frames, reporting availability during resolution, and various lifecycle event callbacks

## How It Works

Perspective API separates choosing a perspective from calculating camera state into two cooperating stages. The resolution stage only decides which perspective should be current and does not write to the camera directly; the render stage computes the final camera state on top of the resolution result.

### Resolving the current perspective

Before every main-camera render update, the API resolves the current perspective according to override-chain priority:

1. The override chain is evaluated from highest to lowest priority.
2. Each override returns a perspective ID, or `null` to skip itself.
3. Unregistered or unavailable perspectives are skipped, and evaluation continues with later overrides.
4. If there is no valid candidate, the default perspective is used as a safe fallback.

When the current perspective changes, the API deactivates the old perspective, activates the new one, and uses both perspectives' `allowTransitionOut()` and `allowTransitionIn()` to decide whether to begin a transition. At the same time, the current perspective's `BaseType` is mapped to vanilla `CameraType`, allowing vanilla behavior that depends on camera type to continue.

Availability checks (`isAvailable()`) and override evaluation run during resolution; the API does not schedule them per client game tick. If your implementation needs per-tick state updates, subscribe to your own loader's client-tick event and return cached values from the callbacks.

### Render frame: calculating the final camera state

After vanilla completes its basic camera setup, the API reads vanilla position and rotation and uses the most recently valid vanilla FOV as the initial state. It then processes the following sequence:

```text
Vanilla camera state
  -> Current perspective computeCameraState
  -> PerspectiveModifier chain
  -> Perspective transition
  -> Write to the camera and provide final settings to world projection
  -> Final-state callback afterCameraStateResolved
```

The process in detail:

1. `computeCameraState` builds the current perspective's target state from vanilla state.
2. The result of the perspective and of every modifier passes a validity check. A failed callback or invalid state restores the state from before that stage and does not prevent the rest of the pipeline from running.
3. Modifiers apply to the same target state in ascending priority order.
4. If the current switch allows a transition, the transition algorithm uses a fixed time window for position, rotation, FOV, and orthographic view height; projection mode directly uses the target value.
5. The final position and rotation are written to the vanilla `Camera`. World rendering then reads the final projection settings to use orthographic projection or retain perspective projection.
6. `afterCameraStateResolved` runs with the state after modifiers and transitions have completed and been written to the camera. It is suitable for raycasts and hit tests that depend on the final viewpoint.
7. After the main camera has updated, the API publishes an independent final state snapshot for `PerspectiveAPI.getPreviousCameraState()` and the next transition.

Vanilla FOV calculation may occur before or after the camera transform. At the FOV injection point, the API caches this frame's valid vanilla value for the next camera-state calculation; the current FOV call returns the final value already calculated by this frame's pipeline. Orthographic-projection settings from the final state are written to the world-rendering, culling, and camera-projection contexts. Non-world projections such as the user interface and held items are unaffected.

### Callback failures and API disablement

Ordinary exceptions from extension callbacks are isolated and logged. Invalid states from perspectives, modifiers, and transitions are restored from a safe snapshot. When Perspective API is disabled, perspective resolution and camera, FOV, and projection modifications all stop; registered perspectives, overrides, and modifiers remain and participate in resolution again when it is re-enabled.
