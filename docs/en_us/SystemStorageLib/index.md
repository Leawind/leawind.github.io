---
title: System Storage Lib
---

<div align="center">
<img src="/icons/system_storage_lib.png" style="width: 8em; margin: 3em auto; image-rendering: pixelated;">

# System Storage Lib

</div>

A Minecraft library mod that provides **system-level persistent storage** for other mods, featuring cross-process file locking, encrypted credential storage, and adherence to platform-specific data directory conventions (XDG on Linux, AppData on Windows, Library on macOS).

## Design Principles

- **Come and go**: Ensure users can cleanly delete all files stored by this library mod within the system.
- **Disk-Aware Placement**: Allow customization of storage locations for large-volume data to prevent excessive consumption of system partition space.

## API Version

> [!Warning] 🚧
>
> This is currently an unstable, unofficial release. The API is subject to breaking changes at any time.

| Version     | Status   |
| ----------- | -------- |
| [v1](./v1/) | Unstable |

> [!Tip]
>
> This documentation is intended to guide developers on how to use System Storage Lib, rather than exhaustively enumerating every API detail. Only key API methods are presented herein; please consult the source code for comprehensive details.

---

- **License**: [MIT License]
- **Source Code**: [GitHub - Leawind/SystemStorageLib]

---

[MIT License]: https://github.com/Leawind/SystemStorageLib/blob/main/LICENSE
[GitHub - Leawind/SystemStorageLib]: https://github.com/Leawind/SystemStorageLib
