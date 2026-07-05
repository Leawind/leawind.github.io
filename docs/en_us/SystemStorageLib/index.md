---
title: System Storage Lib
---

<div align="center">
<img src="/icons/system-storage-lib.png" style="width: 8em; margin: 3em auto; image-rendering: pixelated;">

# System Storage Lib

</div>

A Minecraft library mod that provides **system-level persistent storage** for other mods, featuring cross-process file locking, encrypted credential storage, and adherence to platform-specific data directory conventions.

### Design Principles

- **Come and go**: Ensure users can cleanly delete all files stored by this library mod within the system
- **Disk-Aware Placement**: Allow customization of storage locations for large-volume data to prevent excessive consumption of system partition space

```mermaid
graph LR
    classDef default fill:#333,stroke:#666,stroke-width:1px,color:#fff,rx:5,ry:5;
    classDef sub fill:transparent,stroke:#aaa,stroke-width:2px,stroke-dasharray: 0;

    Start["dev.dirs.BaseDirectories.get()"]

    subgraph G1 [ ]
        direction TB
        cDir[configDir]
        dlDir[dataLocalDir]
        dDir[dataDir]
        caDir[cacheDir]
    end

    subgraph G2 [internal]
        metaConfig[metaConfig]
        logsDir[logsDir]
    end

    subgraph G3 [StoreType]
        direction TB
        CONF[CONFIG]
        DL[DATA_LOCAL]
        SEC[SECRETS]
        DATA[DATA]
        CACHE[CACHE]
    end

    Start --> cDir
    Start --> dlDir
    Start --> dDir
    Start --> caDir

    cDir --> metaConfig
    cDir --> CONF

    dlDir --> logsDir
    dlDir --> DL
    dlDir --> SEC

    dDir --> DATA
    caDir --> CACHE

    class G1,G2,G3 sub;
```

System Storage Lib obtains system standard directories (`configDir`, `dataDir`, etc.) from [directories-jvm](https://github.com/dirs-dev/directories-jvm), then divides them into five storage directories by `StoreType`, plus two internal directories: `metaConfig` (global configuration) and `logsDir` (logs). All paths are determined when constructing the `SystemStorageLib` singleton and cannot be customized.

> [!Warning]
>
> This is currently an unstable, unofficial release. The API is subject to breaking changes at any time.

> [!Tip]
>
> This documentation is intended to guide developers on how to use System Storage Lib, rather than exhaustively enumerating every API detail. Only key API methods are presented herein; please consult the source code for comprehensive details.

---

- **License**: [MIT License](https://github.com/Leawind/SystemStorageLib/blob/main/LICENSE)
- **Source Code**: [GitHub - Leawind/SystemStorageLib](https://github.com/Leawind/SystemStorageLib)
