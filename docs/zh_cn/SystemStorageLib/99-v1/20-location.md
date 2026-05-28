---
title: 存储位置
---

# 存储位置

## 各类型默认存储路径

| 存储类型      | 默认路径                                               |
| :------------ | :----------------------------------------------------- |
| `CACHE`       | `{cacheDir}/mc_system_storage/cache/{scope}/`          |
| `CONFIG`      | `{configDir}/mc_system_storage/config/{scope}/`        |
| `CREDENTIALS` | `{dataDir}/mc_system_storage/credentials/{scope}/`     |
| `DATA`        | `{dataDir}/mc_system_storage/data/{scope}/`            |
| `DATA_LOCAL`  | `{dataLocalDir}/mc_system_storage/data_local/{scope}/` |

其中：

::: code-group

```txt [Windows]
|  {cacheDir}      |  {FOLDERID_LocalAppData}    |
|  {configDir}     |  {FOLDERID_RoamingAppData}  |
|  {dataDir}       |  {FOLDERID_RoamingAppData}  |
|  {dataLocalDir}  |  {FOLDERID_LocalAppData}    |
```

```txt [Linux]
|  {cacheDir}      |  `$XDG_CACHE_HOME` 或 `~/.cache`       |
|  {configDir}     |  `$XDG_CONFIG_HOME` 或 `~/.config`     |
|  {dataDir}       |  `$XDG_DATA_HOME` 或 `~/.local/share`  |
|  {dataLocalDir}  |  `$XDG_DATA_HOME` 或 `~/.local/share`  |
```

```txt [macOS]
|  {cacheDir}      |  ~/Library/Caches               |
|  {configDir}     |  ~/Library/Application Support  |
|  {dataDir}       |  ~/Library/Application Support  |
|  {dataLocalDir}  |  ~/Library/Application Support  |
```

:::
