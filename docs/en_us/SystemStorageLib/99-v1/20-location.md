---
title: Storage Locations
---

# Storage Locations

## Default Storage Paths by Type

| Storage Type    | Default Path                                                 |
| :-------------- | :----------------------------------------------------------- |
| `CACHE`         | `{cacheDir}/mc_system_storage/cache/{scope}/`                |
| `CONFIG`        | `{configDir}/mc_system_storage/config/{scope}/`              |
| `CREDENTIALS`   | `{dataDir}/mc_system_storage/credentials/{scope}/`           |
| `DATA`          | `{dataDir}/mc_system_storage/data/{scope}/`                  |
| `DATA_LOCAL`    | `{dataLocalDir}/mc_system_storage/data_local/{scope}/`       |

Where:

::: code-group

```txt [Windows]
|  {cacheDir}      |  {FOLDERID_LocalAppData}    |
|  {configDir}     |  {FOLDERID_RoamingAppData}  |
|  {dataDir}       |  {FOLDERID_RoamingAppData}  |
|  {dataLocalDir}  |  {FOLDERID_LocalAppData}    |
```

```txt [Linux]
|  {cacheDir}      |  `$XDG_CACHE_HOME` or `~/.cache`       |
|  {configDir}     |  `$XDG_CONFIG_HOME` or `~/.config`     |
|  {dataDir}       |  `$XDG_DATA_HOME` or `~/.local/share`  |
|  {dataLocalDir}  |  `$XDG_DATA_HOME` or `~/.local/share`  |
```

```txt [macOS]
|  {cacheDir}      |  ~/Library/Caches               |
|  {configDir}     |  ~/Library/Application Support  |
|  {dataDir}       |  ~/Library/Application Support  |
|  {dataLocalDir}  |  ~/Library/Application Support  |
```

:::
