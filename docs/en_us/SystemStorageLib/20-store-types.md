---
title: Store Types
---

# Store Types

SystemStorageLib defines five store types, each with distinct semantics and platform-aware default storage paths.

## The Five Store Types

| Store Type    | Purpose                                    | Customizable | Typical Contents             |
| ------------- | ------------------------------------------ | :----------: | ---------------------------- |
| `CREDENTIALS` | Encrypted sensitive data                   |      ❌      | API tokens, OAuth secrets    |
| `CONFIG`      | User-editable configuration files          |      ✅      | JSON/TOML config files       |
| `DATA`        | Persistent data, shareable across machines |      ✅      | Database files, saved states |
| `CACHE`       | Machine-local or costly-to-regenerate data |      ✅      | Compiled shaders, thumbnails |
| `DATA_LOCAL`  | Renewable, cheap-to-regenerate data        |      ✅      | Session data, temp states    |

## Default Storage Paths

All paths are under the root directory `mc_system_storage/` within platform-appropriate locations.

| Variable         | Linux                                | Windows                     | macOS                           |
| ---------------- | ------------------------------------ | --------------------------- | ------------------------------- |
| `{dataDir}`      | `$XDG_DATA_HOME` or `~/.local/share` | `{FOLDERID_RoamingAppData}` | `~/Library/Application Support` |
| `{configDir}`    | `$XDG_CONFIG_HOME` or `~/.config`    | `{FOLDERID_RoamingAppData}` | `~/Library/Application Support` |
| `{cacheDir}`     | `$XDG_CACHE_HOME` or `~/.cache`      | `{FOLDERID_LocalAppData}`   | `~/Library/Caches`              |
| `{dataLocalDir}` | `$XDG_DATA_HOME` or `~/.local/share` | `{FOLDERID_LocalAppData}`   | `~/Library/Application Support` |

### Full Paths

| Store Type    | Default Path                                           |
| ------------- | ------------------------------------------------------ |
| `CREDENTIALS` | `{dataDir}/mc_system_storage/credentials/{scope}/`     |
| `CONFIG`      | `{configDir}/mc_system_storage/config/{scope}/`        |
| `DATA`        | `{dataDir}/mc_system_storage/data/{scope}/`            |
| `CACHE`       | `{cacheDir}/mc_system_storage/cache/{scope}/`          |
| `DATA_LOCAL`  | `{dataLocalDir}/mc_system_storage/data_local/{scope}/` |

### Examples (Linux, user _Steve_)

```
/home/steve/.local/share/mc_system_storage/credentials/my-mod/
/home/steve/.config/mc_system_storage/config/my-mod/
/home/steve/.local/share/mc_system_storage/data/my-mod/
/home/steve/.cache/mc_system_storage/cache/my-mod/
/home/steve/.local/share/mc_system_storage/data_local/my-mod/
```

## Choosing the Right Store Type

- Use `CREDENTIALS` for secrets: API keys, OAuth tokens, passwords. Data is **encrypted at rest**.
- Use `CONFIG` for files users might want to edit manually or sync across machines.
- Use `DATA` for important persistent state that should survive across machines (e.g., user preferences synchronized via cloud).
- Use `CACHE` for expensive-to-regenerate data that is machine-specific.
- Use `DATA_LOCAL` for cheap-to-regenerate data; this data may be lost without consequence.

## Customizing Paths

Four store types support custom paths via meta config:

```java
MetaConfig config = lib.metaConfig().get();
PerScopeConfig perScope = config.getOrCreateScopeConfig("my-mod");

// Override cache directory for this scope
perScope.customDirs().put(StoreType.CACHE, Path.of("/ssd/cache/my-mod"));

lib.metaConfig().set(config);
```

`CREDENTIALS` cannot be customized — its path is fixed relative to `{dataDir}` to prevent accidental misconfiguration that could expose sensitive data.

## StoreType API Reference

```java
// Iterate all types
for (StoreType<?> type : StoreType.values()) {
    System.out.println(type.identifier());
}

// Lookup by identifier string
StoreType<?> type = StoreType.of("config"); // returns StoreType.CONFIG

// Check customizability
boolean canCustomize = type.customizable();

// Get identifier string
String id = type.identifier(); // e.g. "credentials", "config", "data", "cache", "data_local"
```

## Path Uniqueness Constraint

Each store type within a scope must have a **unique** directory path. The library enforces this at initialization:

- If two store types resolve to the same directory, an `IllegalArgumentException` is thrown.

## Directory Requirements

Each store type's directory for a scope must be **unique**. The library enforces this at initialization. If a custom path override causes a collision with another store type's path, the library will reject the configuration.

::: warning
A store type's scoped directory **must not** overlap with another store type's directory path.
Custom path overrides via meta config are validated at construction time.
:::
