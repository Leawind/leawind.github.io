---
title: SystemStorageLib
---

# SystemStorageLib

A Minecraft library mod that provides **system-level persistent storage** for other mods.

It handles cross-process file locking, encrypted credential storage, and follows platform conventions for data directories (XDG on Linux, AppData on Windows, Library on macOS).

## Quick Overview

```java
// Get the singleton instance
SystemStorageLib lib = SystemStorageLib.getInstance();

// Create or get a scope (isolated storage namespace for your mod)
ScopeStorage scope = lib.scope("my-mod");

// Access different store types
StorageManager config = scope.storage(StoreType.CONFIG);
StorageManager data = scope.storage(StoreType.DATA);
CredentialStore credentials = scope.storage(StoreType.CREDENTIALS);
```

## Key Features

- **Scope-based isolation** — each mod gets its own scope, preventing conflicts
- **Five store types** — `CREDENTIALS`, `CONFIG`, `DATA`, `CACHE`, `DATA_LOCAL` with distinct semantics
- **Encrypted credential storage** — AES-256-GCM with PBKDF2 key derivation bound to the local machine
- **Cross-process locking** — file-based read-write lock with reentrant semantics
- **Platform-aware paths** — follows XDG/Windows/macOS conventions via [directories-jvm](https://github.com/dirs-dev/directories-jvm)
- **Codec-based meta config** — serialized via Mojang DataFixerUpper; supports per-scope custom directory overrides
- **Multi-loader support** — Fabric, Forge, NeoForge
- **Java 8 compatible**

## Storage Locations

All data is stored under a root directory named `mc_system_storage` within platform-appropriate locations:

| Store Type    | Purpose                                    | Customizable |
| ------------- | ------------------------------------------ | :----------: |
| `CREDENTIALS` | Encrypted sensitive data (tokens, secrets) |      ❌      |
| `CONFIG`      | User-editable configuration files          |      ✅      |
| `DATA`        | Persistent data, shareable across machines |      ✅      |
| `CACHE`       | Machine-local or costly-to-regenerate data |      ✅      |
| `DATA_LOCAL`  | Renewable, cheap-to-regenerate data        |      ✅      |

- **License**: [MIT](https://github.com/Leawind/SystemStorageLib/blob/main/LICENSE)
- **Source**: [GitHub](https://github.com/Leawind/SystemStorageLib)
