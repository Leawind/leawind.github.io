---
title: Meta Configuration
---

# Meta Configuration

The **Meta Configuration** system provides a centralized way to configure storage paths per scope without modifying mod code. It is serialized as JSON using Mojang's DataFixerUpper codec system.

## Overview

- Stored in `{configDir}/mc_system_storage/metaconfig/config.json`
- Serialized as pretty-printed JSON via a codec
- Watched for **external file changes** with automatic reload
- Supports per-scope custom directory overrides for four customizable store types

## Data Structure

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

### Java Model

```java
// MetaConfig — top-level container
public final class MetaConfig {
    Set<String> scopeSet();
    Set<Map.Entry<String, PerScopeConfig>> entrySet();
    PerScopeConfig getScopeConfig(String scopeName);
    PerScopeConfig getOrCreateScopeConfig(String scopeName);
    void removeScopeConfig(String scopeName);
}

// PerScopeConfig — per-scope settings
public final class PerScopeConfig {
    Map<StoreType<?>, Path> customDirs();
}
```

## API

### Reading Configuration

```java
MetaConfigManager meta = lib.metaConfig();

// Get current config (cached, reads from disk if not cached)
MetaConfig config = meta.get();

// Check if a scope has custom settings
PerScopeConfig perScope = config.getScopeConfig("my-mod");
if (perScope != null) {
    Map<StoreType<?>, Path> customDirs = perScope.customDirs();
    // ...
}
```

### Writing Configuration

```java
MetaConfig config = meta.get();

// Get or create per-scope config
PerScopeConfig perScope = config.getOrCreateScopeConfig("my-mod");

// Set custom directories
perScope.customDirs().put(StoreType.CACHE, Path.of("/ssd/cache/my-mod"));
perScope.customDirs().put(StoreType.DATA, Path.of("/mnt/shared/data/my-mod"));

// Write to disk
meta.set(config);
```

::: tip
`meta.set()` only writes to disk if the new config differs from the old one. Equality is checked via `MetaConfig.equals()`.
:::

## File Watching

The meta config manager starts a background daemon thread that watches `config.json` for changes:

- Uses Java's `WatchService` API to monitor the config directory
- Detects file modifications and creations
- Re-reads the config file when changed externally
- Emits `onChanged` events when the parsed config differs from the cached value

### Listening for Changes

```java
meta.onChanged().on(newConfig -> {
    System.out.println("Meta config updated: " + newConfig.scopeSet());
    // React to configuration changes
});
```

## Path Resolution Priority

When a scope's storage directory is resolved, the library follows this priority:

1. **Custom path** from `PerScopeConfig.customDirs()` for the specific store type
2. **Default path** based on the platform-appropriate directory

Custom paths from meta config override the default platform paths.

::: warning
`CREDENTIALS` store type **cannot** be customized via meta config. Its path is always fixed relative to `{dataDir}` to prevent accidental misconfiguration.
:::

## Constraints

| Constraint    | Description                                                            |
| ------------- | ---------------------------------------------------------------------- |
| `CREDENTIALS` | Path cannot be overridden via meta config                              |
| Uniqueness    | Each store type within a scope must resolve to a unique directory path |
| No deletion   | `MetaConfigManager.delete()` throws `UnsupportedOperationException`    |

## File Format

The config file is stored as pretty-printed JSON at:

```
{configDir}/mc_system_storage/metaconfig/config.json
```

Example full path (Linux):

```
/home/steve/.config/mc_system_storage/metaconfig/config.json
```

Writes are atomic — using the same write-to-temp-then-rename pattern as `CredentialStore`.
