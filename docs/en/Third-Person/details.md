---
prev:
  text: 🗒Introduction
  link: './intro'
next:
  text: 📝Changelog
  link: ./changelog
---

# 📖 Detailed Features

## Configuration File

The configuration file for this mod is in JSON format and is located at `config/leawind_third_person.json` within the game's runtime directory.

## Aim Mode Determination Rules

In the third-person perspective, the mod determines whether to enter aim mode based on the items held and in use by the player.

During the game runtime, the mod maintains two sets of [_item patterns_](#item-patterns):

* **Set of _item patterns_ for holding to aim** - When the player is holding any item that matches any pattern in this set, aim mode is activated.
* **Set of _item patterns_ for using to aim** - When the player is using any item that matches any pattern in this set, aim mode is activated.

The _item patterns_ in the set can come from two sources:

* **Mod Configuration** - _Item patterns_ can be defined in the mod's configuration screen.
* **Resource Packs** - These include built-in resource packs in this mod, resource packs in other mods, and manually installed resource packs by players.

## Resource Packs

### Built-in Resource Packs

This mod includes resource packs with aim mode determination rules suitable for vanilla Minecraft.

:::details Built-in rules for the vanilla version

`assets/minecraft/item_patterns/aiming_check/vanilla.json`

```json
{
	"hold_to_aim": [
		"minecraft:crossbow{Charged:1b}",
		"minecraft:ender_pearl",
		"minecraft:snowball",
		"minecraft:egg",
		"minecraft:splash_potion",
		"minecraft:lingering_potion",
		"minecraft:experience_bottle"
	],
	"use_to_aim": [
		"minecraft:bow",
		"minecraft:trident"
	]
}
```
:::

### Additional Resource Packs

By adding additional resource packs, other items can also automatically enter aim mode in the third-person perspective.

`assets/<namespace>/item_patterns/aiming_check/<any_name>.json`

:::details Type definition
```ts
type AimingCheck = {
	hold_to_aim?: string[];	// Optional
	use_to_aim?: string[];	// Optional
}
```
:::

:::warning
Namespaces and names can be chosen arbitrarily, but JSON files with the same path in different resource packs will conflict with each other, and the one in the resource pack with the highest priority will take effect.
:::

## Item Patterns

_Item patterns_ are rules used to match items with certain characteristics based on NBT tags. They can be used to determine if an item in a player's inventory conforms to a specific rule.

You can use _item pattern expressions_ to describe an _item pattern_. For example, in the NBT tags of a "charged crossbow," the value of the `Charged` attribute is `1b`, while in an "uncharged crossbow," the value of this attribute is `0b`. You can use the following _item pattern_ to match the "charged crossbow":

> An item with the id `minecraft:crossbow` and the `Charged` tag value of `1b`

Its expression is `minecraft:crossbow{Charged:1b}`

Expressions can take one of the following three structures:

| Structure                         | Meaning                                        | Examples               |
| --------------------------------- | ---------------------------------------------- | ---------------------- |
| Item ID                           | Matches any item with the same id              | `egg`, `minecraft:egg` |
| NBT Tag                           | Matches any item with a matching tag structure | `{Charged:1b}`         |
| Item ID concatenated with NBT Tag | Items that match both                          | `crossbow{Charged:1b}` |

Examples

| _Item Pattern_ Expression | Meaning                                            |
| ------------------------- | -------------------------------------------------- |
| `item.minecraft.egg`      | Egg                                                |
| `minecraft.egg`           | Egg                                                |
| `minecraft:egg`           | Egg                                                |
| `egg`                     | Egg                                                |
| `crossbow`                | Crossbow (whether charged or not)                  |
| `crossbow{Charged:1b}`    | Loaded crossbow                                    |
| `{Charged:1b}`            | Any item with the NBT tag `Charged` and value `1b` |
