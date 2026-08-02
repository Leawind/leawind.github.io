---
title: Player Guide
---

# Player Guide

## Things to Know Before Installing

This is a **client-side only** mod—the server does not need to install it. Please download the file that exactly matches your Minecraft version and loader, and also install the required [Perspective API]. The Fabric version additionally requires Fabric API.

The configuration interface depends on [Yet Another Config Lib (YACL)], but YACL is an optional dependency; without YACL, core features such as the camera and keybindings still work. Fabric users may additionally install [Mod Menu] for easy access to the configuration screen from the mod list.

## Entering the Perspective

Perspective selection is handled by Perspective API. By default, the vanilla perspective switch key (usually `F5`) is used: a short press cycles through available perspectives, and a long press opens the perspective wheel.

After switching to the _Leawind's Third Person_ perspective, this mod's camera and interaction features become active. When returning to first-person or vanilla third-person, this mod will no longer take over these behaviors.

## Configuration File

The configuration file is located at:

```text
.minecraft/config/leawind_third_person.json
```

Please exit the game before manually editing the configuration file; a running client saves settings periodically and may overwrite the file you are editing. If the file becomes corrupted or comes from an incompatible beta version, the mod will fall back to default settings.

## Frequently Asked Questions

- Pressing F5 does not show this perspective: Check whether the perspective has been disabled in Perspective API's switcher.
- No configuration button: Install YACL; the absence of YACL does not mean the mod's core functionality is broken.
- The crosshair or interaction target is not as expected in third-person: Confirm that you are currently in this mod's perspective, and check the "Third-Person Crosshair" and "Raycast Origin" settings. The mod respects the player's interaction distance and will not expand the interactable range.

[Perspective API]: https://modrinth.com/mod/perspective-api
[Yet Another Config Lib (YACL)]: https://modrinth.com/mod/yacl
[Mod Menu]: https://modrinth.com/mod/modmenu
