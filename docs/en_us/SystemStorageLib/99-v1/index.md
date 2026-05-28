---
title: v1
---

# System Storage Lib v1

- **Standardized Storage Locations** — Following XDG/Windows/macOS conventions via [directories-jvm](https://github.com/dirs-dev/directories-jvm)
- **Five Storage Types** — Cache, Config, Credentials, Data, Local Data
- **Cross-process Locking** — File-based cross-process read-write locks
- **Encrypted Key-Value Storage** — AES-256-GCM with PBKDF2 key derivation, bound to current system

Recommended reading:

- [Storage Locations](./location)
- [Getting Started](./getting-started)
