---
title: Modpack Guide
---

# Modpack Guide

> [!NOTE]
>
> This documentation applies only to the latest version: <img src="https://img.shields.io/github/v/tag/Leawind/Perspective-API?label=Latest&color=818181" style="display:inline">

## Dependencies

| Component              |  Required?  | Description                                                                                   |
| ---------------------- | :---------: | --------------------------------------------------------------------------------------------- |
| Perspective API        |     ✅      | Provides perspective registration and switching; current builds require `1.3.0-beta` or later |
| Fabric API             | Fabric only | Load-time dependency for Fabric builds                                                        |
| Yet Another Config Lib |     ❌      | Provides only the configuration UI; core functionality works without it                       |
| Mod Menu               |     ❌      |                                                                                               |

This is a client-side mod. Servers should not list it as a required mod.

The mod ID is `leawind_third_person`, and the perspective ID registered with Perspective API is `leawind_third_person.third_person`. Most players do not need to use these IDs directly; they are useful when troubleshooting dependencies, configuration, or compatibility with other client-side mods.

## Adding Auto-Aim Rules with Resource Packs

When "Smart Aiming" is enabled, the mod reads the following directories from all client-side resource namespaces:

```text
assets/<namespace>/item_patterns/hold_to_aim/*.json
assets/<namespace>/item_patterns/use_to_aim/*.json
```

Each JSON file must be a string array. Strings use the Minecraft [item predicate] syntax for the current version—the same expressions that can be used as item arguments in `/clear`. For example, a resource pack could contain:

```text
assets/example_pack/item_patterns/hold_to_aim/ranged.json
```

```json
[
  "minecraft:ender_pearl",
  "example:magic_wand"
]
```

The two directories have different meanings:

- `hold_to_aim`: Enters aiming mode when an item in either the main hand or offhand matches any rule.
- `use_to_aim`: Enters aiming mode when the player is actively using an item and the currently used item matches any rule.

Resource pack rules are merged with the rules entered in the configuration UI. Resource packs are suitable for carrying fixed rules distributed with a modpack; personal player rules are better written into `leawind_third_person.json`. Rules are re-parsed when resource packs are reloaded.

### Important Notes

- [Item predicate] must comply with the syntax of the target Minecraft version. Component/NBT expressions may differ between versions; verify them with `/clear` on the target version
- Invalid JSON files or invalid predicates are ignored and logged in the client log
- Multiple resource packs can provide rules simultaneously; the mod collects them all. Use stable, unique filenames and namespaces to avoid maintenance issues when tracking down source locations

[item predicate]: https://minecraft.wiki/w/Argument_types#item_predicate
