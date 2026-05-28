---
title: System Storage Lib
---

# System Storage Lib

> [!Warning] 🚧
>
> Currently an unstable pre-release version. APIs may undergo breaking changes at any time.

> [!Tip]
>
> This document aims to guide developers on how to use System Storage Lib rather than exhaustively listing all APIs. It only demonstrates key API methods; refer to the source code for more details.

A Minecraft library mod that provides **system-level persistent storage** for other mods, supporting cross-process file locks, encrypted credential storage, and following platform-specific data directory conventions (XDG on Linux, AppData on Windows, Library on macOS).

## Design Principles

- Give and take: Ensure users can cleanly remove all files stored by this library mod in the system
- Adapt to the environment: Allow customization of storage locations for large data to prevent excessive consumption of system partition space

## API Versions

| Version | Status     |
| ------- | ---------- |
| v1      | Unstable   |

---

- **License**: [MIT License]
- **Source**: [GitHub - Leawind/SystemStorageLib]

---

[MIT License]: https://github.com/Leawind/SystemStorageLib/blob/main/LICENSE
[GitHub - Leawind/SystemStorageLib]: https://github.com/Leawind/SystemStorageLib
