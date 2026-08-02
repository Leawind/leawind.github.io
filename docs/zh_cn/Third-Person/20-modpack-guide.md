---
title: 整合包指南
---

# 整合包指南

> [!NOTE]
>
> 本文档仅适用于最新版本：<img src="https://img.shields.io/github/v/tag/Leawind/Perspective-API?label=Latest&color=818181" style="display:inline">

## 依赖关系

| 组件                   |  是否必需   | 说明                                                         |
| ---------------------- | :---------: | ------------------------------------------------------------ |
| Perspective API        |     ✅      | 提供视角注册和视角切换；当前构建要求 `1.3.0-beta` 或更高版本 |
| Fabric API             | Fabric 必需 | Fabric 构建的加载依赖                                        |
| Yet Another Config Lib |     ❌      | 只提供配置界面；缺少时核心功能仍可运行                       |
| Mod Menu               |     ❌      |                                                              |

这是客户端模组。服务端不应把它列为必需模组。

模组 ID 是 `leawind_third_person`，Perspective API 的视角 ID 是 `leawind_third_person.third_person`。一般玩家不需要直接使用这些 ID；它们在排查依赖、配置或其他客户端模组兼容性时有用。

## 用资源包添加自动瞄准规则

启用“智能瞄准”后，模组会读取所有客户端资源命名空间中的以下目录：

```text
assets/<namespace>/item_patterns/hold_to_aim/*.json
assets/<namespace>/item_patterns/use_to_aim/*.json
```

每个 JSON 文件都必须是字符串数组。字符串使用当前 Minecraft 版本的[物品谓词]语法，也就是可以用于 `/clear` 物品参数的表达式。例如，一个资源包可以包含：

```text
assets/example_pack/item_patterns/hold_to_aim/ranged.json
```

```json
[
  "minecraft:ender_pearl",
  "example:magic_wand"
]
```

两个目录的含义不同：

- `hold_to_aim`：主手或副手的物品匹配任意一条规则时进入瞄准构图。
- `use_to_aim`：玩家正在使用物品，且当前使用的物品匹配任意一条规则时进入瞄准构图。

资源包规则会与配置界面中填写的规则合并。资源包适合携带随整合包发布的固定规则；玩家个人规则则适合写入 `leawind_third_person.json`。资源包重新加载后，规则会重新解析。

### 注意事项

- [物品谓词]必须符合目标 Minecraft 版本的语法。不同版本的组件/NBT 表达式可能不同，应在目标版本中用 `/clear` 验证
- 无效的 JSON 文件或无效的谓词会被忽略，并在客户端日志中记录
- 多个资源包可以同时提供规则，模组会收集它们；应使用稳定、独特的文件名和命名空间，避免维护时难以定位来源

[物品谓词]: https://zh.minecraft.wiki/w/参数类型#item_predicate
