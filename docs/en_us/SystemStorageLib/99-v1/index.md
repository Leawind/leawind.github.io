---
title: v1
---

# System Storage Lib v1

## Quick Overview

```java
Scope scope = SystemStorageLib.getInstance().scope("example_mod");

Storage storage = scope.storage(StoreType.CREDENTIALS);
CredentialStore credentials = CredentialStore.of(storage);
credentials.set("some_token", "secret_value_123");

String token = credentials.get("some_token"); // "secret_value_123"
```

## Core Features

- **Scope-based Isolation** — Each mod has its own scope to avoid conflicts
- **Five Storage Types** — `CREDENTIALS`, `CONFIG`, `DATA`, `CACHE`, `DATA_LOCAL`, each with different semantics
- **Encrypted Credential Storage** — AES-256-GCM with PBKDF2 key derivation, bound to the current system
- **Cross-process Locking** — File-based reentrant read-write locks
- **Platform-aware Paths** — Follow XDG/Windows/macOS conventions via [directories-jvm](https://github.com/dirs-dev/directories-jvm)
- **Meta Configuration** — Custom directory overrides for each scope

## Storage Types

| Storage Type    | Purpose                                                      | Customizable Path |
| --------------- | ------------------------------------------------------------ | :---------------: |
| `CACHE`         | Regenerable cache data                                       |        ✅         |
| `CONFIG`        | Configuration files                                          |        ✅         |
| `CREDENTIALS`   | Sensitive data requiring encryption (tokens, keys, etc.)     |        ❌         |
| `DATA`          | Persistent data that can be shared across machines           |        ✅         |
| `DATA_LOCAL`    | Machine-specific persistent data, or expensive-to-regenerate cache data |        ✅         |
