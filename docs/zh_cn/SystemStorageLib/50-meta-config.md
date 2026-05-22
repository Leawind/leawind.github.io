---
title: 元配置
---

# 元配置

**元配置**系统提供了一种集中式的方式，无需修改模组代码即可按 scope 配置存储路径。它使用 Mojang 的 DataFixerUpper 编解码器系统序列化为 JSON。

## 概述

- 存储在 `{configDir}/mc_system_storage/metaconfig/config.json`
- 通过编解码器序列化为 pretty-printed JSON
- 监控**外部文件更改**并自动重新加载
- 支持对四种可自定义的存储类型进行按 scope 的自定义目录覆写

## 数据结构

### `MetaConfig`

```json
{
  "scopes": {
    "my-mod": {
      "custom_dirs": {
        "cache": "/home/steve/ssd/mc-cache/my-mod",
        "data": "/mnt/shared/mc-data/my-mod"
      }
    },
    "another-mod": {
      "custom_dirs": {}
    }
  }
}
```

### Java 模型

```java
// MetaConfig — 顶层容器
public final class MetaConfig {
    Set<String> scopeSet();
    Set<Map.Entry<String, PerScopeConfig>> entrySet();
    PerScopeConfig getScopeConfig(String scopeName);
    PerScopeConfig getOrCreateScopeConfig(String scopeName);
    void removeScopeConfig(String scopeName);
}

// PerScopeConfig — 每个 scope 的设置
public final class PerScopeConfig {
    Map<StoreType<?>, Path> customDirs();
}
```

## API

### 读取配置

```java
MetaConfigManager meta = lib.metaConfig();

// 获取当前配置（已缓存，若未缓存则从磁盘读取）
MetaConfig config = meta.get();

// 检查 scope 是否有自定义设置
PerScopeConfig perScope = config.getScopeConfig("my-mod");
if (perScope != null) {
    Map<StoreType<?>, Path> customDirs = perScope.customDirs();
    // ...
}
```

### 写入配置

```java
MetaConfig config = meta.get();

// 获取或创建 scope 配置
PerScopeConfig perScope = config.getOrCreateScopeConfig("my-mod");

// 设置自定义目录
perScope.customDirs().put(StoreType.CACHE, Path.of("/ssd/cache/my-mod"));
perScope.customDirs().put(StoreType.DATA, Path.of("/mnt/shared/data/my-mod"));

// 写入磁盘
meta.set(config);
```

::: tip
仅当新配置与旧配置不同时，`meta.set()` 才会写入磁盘。相等性通过 `MetaConfig.equals()` 检查。
:::

## 文件监控

元配置管理器启动一个后台守护线程，监控 `config.json` 的更改：

- 使用 Java 的 `WatchService` API 监控配置目录
- 检测文件修改和创建
- 外部更改时重新读取配置文件
- 当解析后的配置与缓存值不同时，发出 `onChanged` 事件

### 监听更改

```java
meta.onChanged().on(newConfig -> {
    System.out.println("Meta config updated: " + newConfig.scopeSet());
    // 响应配置更改
});
```

## 路径解析优先级

解析 scope 的存储目录时，库遵循以下优先级：

1. **自定义路径**：来自 `PerScopeConfig.customDirs()` 中特定存储类型的路径
2. **默认路径**：基于平台适当目录的路径

元配置中的自定义路径会覆写默认的平台路径。

::: warning
`CREDENTIALS` 存储类型**不能**通过元配置自定义。其路径始终相对于 `{dataDir}` 固定，以防止意外配置错误。
:::

## 约束

| 约束          | 说明                                                              |
| ------------- | ----------------------------------------------------------------- |
| `CREDENTIALS` | 路径不能通过元配置覆写                                            |
| 唯一性        | 每个 scope 内的每种存储类型必须解析到唯一目录路径                 |
| 不可删除      | `MetaConfigManager.delete()` 抛出 `UnsupportedOperationException` |

## 文件格式

配置文件以 pretty-printed JSON 存储在：

```
{configDir}/mc_system_storage/metaconfig/config.json
```

完整路径示例（Linux）：

```
/home/steve/.config/mc_system_storage/metaconfig/config.json
```

写入是原子的 — 使用与 `CredentialStore` 相同的先写临时文件再重命名模式。
