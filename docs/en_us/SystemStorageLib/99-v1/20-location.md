---
title: Storage Location
---

# Storage Location

## Default Storage Paths by Type

| Storage Type | Default Path                                           |
| :----------- | :----------------------------------------------------- |
| `CACHE`      | `{cacheDir}/mc_system_storage/cache/{scope}/`          |
| `CONFIG`     | `{configDir}/mc_system_storage/config/{scope}/`        |
| `SECRETS`    | `{dataLocalDir}/mc_system_storage/secrets/{scope}/`    |
| `DATA`       | `{dataDir}/mc_system_storage/data/{scope}/`            |
| `DATA_LOCAL` | `{dataLocalDir}/mc_system_storage/data_local/{scope}/` |

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

## Global Paths

In addition to the scope-specific storage paths, the library itself has two global directories:

| Purpose                    | Default Path                                |
| :------------------------- | :------------------------------------------ |
| Meta-config (`metaConfig`) | `{configDir}/mc_system_storage/metaconfig/` |
| Logs (`logs`)              | `{dataLocalDir}/mc_system_storage/logs/`    |

- **Meta-config**: Stores the library's global configuration JSON files (e.g., log rotation settings), supporting hot reload across processes.
- **Logs**: Logs from all scopes are written uniformly to `latest.log` in this directory. Upon reaching the size limit, they are automatically rotated into archive files such as `1.log`, `2.log`, etc.
