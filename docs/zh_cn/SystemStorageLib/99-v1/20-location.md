---
title: 存储位置
---

# 存储位置

## 各类型默认存储路径

| 存储类型     | 默认路径                                               |
| :----------- | :----------------------------------------------------- |
| `CACHE`      | `{cacheDir}/mc_system_storage/cache/{scope}/`          |
| `CONFIG`     | `{configDir}/mc_system_storage/config/{scope}/`        |
| `SECRETS`    | `{dataLocalDir}/mc_system_storage/secrets/{scope}/`    |
| `DATA`       | `{dataDir}/mc_system_storage/data/{scope}/`            |
| `DATA_LOCAL` | `{dataLocalDir}/mc_system_storage/data_local/{scope}/` |

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

## 全局路径

除 scope 下的存储路径外，库自身还有两个全局目录：

| 用途                  | 默认路径                                    |
| :-------------------- | :------------------------------------------ |
| 元配置 (`metaConfig`) | `{configDir}/mc_system_storage/metaconfig/` |
| 日志 (`logs`)         | `{dataLocalDir}/mc_system_storage/logs/`    |

- **元配置**：存放库的全局配置 JSON 文件（如日志轮转设置），支持跨进程热重载。
- **日志**：所有 scope 的日志统一写入此目录下的 `latest.log`，达到大小上限后自动轮转为 `1.log`、`2.log` 等存档文件。
