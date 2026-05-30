---
title: v1
---

# System Storage Lib v1

- **Standardized Storage Locations** — Following XDG/Windows/macOS conventions via [directories-jvm](https://github.com/dirs-dev/directories-jvm)
- **Five Storage Types** — Cache, Config, Secrets, Data, Local Data
- **Directory Accessor Pattern** — Creating directory-based accessors via `Scope#access()` factory method to uniformly manage paths, logs, locks and change notifications
- **Cross-process Locking** — File-based cross-process reentrant read-write locks (`FileBasedReentrantReadWriteLock`)
- **Encrypted Key-Value Storage** — AES-256-GCM with PBKDF2 key derivation, bound to current system, files automatically set to owner-read-writable only
- **Atomic Writing** — Write-and-rename pattern ensures files are never in a partially written state
- **Log Rotation** — Supporting size-based log file rotation and retention limits
- **Meta Configuration Management** — Global configuration JSON files supporting cross-process hot reload

Recommended reading:

- [Storage Locations](./location)
- [Getting Started](./getting-started)
- [Secrets Store](./secrets-store)
