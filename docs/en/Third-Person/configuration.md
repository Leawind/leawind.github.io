---
prev:
  text: 🗒简介
  link: './intro'
next:
  text: 📝Changelog
  link: ./changelog
---

# Configuration

The configuration file for this mod is in JSON format and is located in the game's run directory under `config/leawind_third_person.json`.

This document only covers some important configurations.

## Item Matching Rules

There are two configurable string lists in the configuration:

| ID                   | Name                | Description                                                                         |
| -------------------- | ------------------- | ----------------------------------------------------------------------------------- |
| `aim_item_rules`     | Held Item Rules     | Automatically enters aim mode when the item held in the player's main or off-hand matches any rule in the list. |
| `use_aim_item_rules` | Used Item Rules     | Automatically enters aim mode when the item the player is currently using matches any rule in the list.           |

### Rule Syntax

Matching rules can be of three structures:
| Structure           | Meaning                       | Example                     |
| ------------------- | ------------------------------ | ---------------------------- |
| Item ID             | Matches any item with the same ID | `egg`, `minecraft:egg`       |
| NBT Tag             | Matches any item with the specified NBT tag structure | `{Charged:1b}`               |
| Item ID with NBT Tag | Matches items that satisfy both conditions | `crossbow{Charged:1b}`       |

#### More Examples

| Rule String              | Rule Meaning                                      |
| ------------------------ | ------------------------------------------------- |
| `item.minecraft.egg`     | Matches eggs                                      |
| `minecraft.egg`          | Matches eggs                                      |
| `minecraft:egg`          | Matches eggs                                      |
| `egg`                    | Matches eggs                                      |
| `crossbow`               | Matches crossbows (with any NBT tag)              |
| `crossbow{Charged:1b}`   | Matches charged crossbows                         |
| `{Charged:1b}`           | Matches any item with an NBT tag `Charged` set to 1b |

### Built-in Rules

Built-in rules are hardcoded into the mod and are enabled by default. You can disable them at any time in the configuration.

#### Held Item Rules List

| Item Matching Rule      |
| ----------------------- |
| `crossbow{Charged:1b}`  |
| `ender_pearl`           |
| `snowball`              |
| `egg`                   |
| `splash_potion`         |
| `lingering_potion`      |
| `experience_bottle`     |

#### Used Item Rules List

| Item Matching Rule |
| ------------------ |
| `bow`              |
| `trident`          |
