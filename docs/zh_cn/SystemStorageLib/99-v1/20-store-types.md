---
title: 存储类型
---

# 存储类型

SystemStorageLib 定义了五种存储类型，每种都有不同的语义和平台感知的默认存储路径。

## 五种存储类型

| 存储类型      | 用途                           | 可自定义 | 典型内容             |
| ------------- | ------------------------------ | :------: | -------------------- |
| `CREDENTIALS` | 加密敏感数据                   |    ❌    | API 令牌、OAuth 密钥 |
| `CONFIG`      | 用户可编辑的配置文件           |    ✅    | JSON/TOML 配置       |
| `DATA`        | 持久化数据，可跨机器共享       |    ✅    | 数据库文件、存档状态 |
| `CACHE`       | 机器本地或重新生成代价高的数据 |    ✅    | 编译着色器、缩略图   |
| `DATA_LOCAL`  | 可再生、重新生成代价低的数据   |    ✅    | 会话数据、临时状态   |

## 默认存储路径

所有路径位于平台适当位置下的 `mc_system_storage/` 根目录中。

| 变量             | Linux                                | Windows                     | macOS                           |
| ---------------- | ------------------------------------ | --------------------------- | ------------------------------- |
| `{dataDir}`      | `$XDG_DATA_HOME` 或 `~/.local/share` | `{FOLDERID_RoamingAppData}` | `~/Library/Application Support` |
| `{configDir}`    | `$XDG_CONFIG_HOME` 或 `~/.config`    | `{FOLDERID_RoamingAppData}` | `~/Library/Application Support` |
| `{cacheDir}`     | `$XDG_CACHE_HOME` 或 `~/.cache`      | `{FOLDERID_LocalAppData}`   | `~/Library/Caches`              |
| `{dataLocalDir}` | `$XDG_DATA_HOME` 或 `~/.local/share` | `{FOLDERID_LocalAppData}`   | `~/Library/Application Support` |

### 完整路径

| 存储类型      | 默认路径                                               |
| ------------- | ------------------------------------------------------ |
| `CREDENTIALS` | `{dataDir}/mc_system_storage/credentials/{scope}/`     |
| `CONFIG`      | `{configDir}/mc_system_storage/config/{scope}/`        |
| `DATA`        | `{dataDir}/mc_system_storage/data/{scope}/`            |
| `CACHE`       | `{cacheDir}/mc_system_storage/cache/{scope}/`          |
| `DATA_LOCAL`  | `{dataLocalDir}/mc_system_storage/data_local/{scope}/` |

### 示例（Linux，用户 _Steve_）

```
/home/steve/.local/share/mc_system_storage/credentials/my-mod/
/home/steve/.config/mc_system_storage/config/my-mod/
/home/steve/.local/share/mc_system_storage/data/my-mod/
/home/steve/.cache/mc_system_storage/cache/my-mod/
/home/steve/.local/share/mc_system_storage/data_local/my-mod/
```

## 选择合适的存储类型

- 用 `CREDENTIALS` 存储密钥：API 密钥、OAuth 令牌、密码。数据在存储时**加密**。
- 用 `CONFIG` 存放用户可能需要手动编辑或跨机器同步的文件。
- 用 `DATA` 存放重要的持久化状态，应在多机器间保持（如通过云同步的用户偏好）。
- 用 `CACHE` 存放与机器相关且重新生成代价高的数据。
- 用 `DATA_LOCAL` 存放重新生成代价低的数据；此数据丢失也无大碍。

## 自定义路径

四种存储类型支持通过元配置自定义路径：

```java
MetaConfig config = lib.metaConfig().get();
PerScopeConfig perScope = config.getOrCreateScopeConfig("my-mod");

// 覆写此 scope 的 cache 目录
perScope.setCustomDir(StoreType.CACHE, Path.of("/ssd/cache/my-mod"));

lib.metaConfig().set(config);
```

`CREDENTIALS` 不可自定义 — 其路径固定相对于 `{dataDir}`，以防止因意外配置错误导致敏感数据泄露。

## StoreType API 参考

```java
// 遍历所有类型
for (StoreType<?> type : StoreType.values()) {
    System.out.println(type.identifier());
}

// 通过标识符字符串查找
StoreType<?> type = StoreType.of("config"); // 返回 StoreType.CONFIG

// 检查是否可自定义
boolean canCustomize = type.customizable();

// 获取标识符字符串
String id = type.identifier(); // 例如 "credentials", "config", "data", "cache", "data_local"
```

## 路径唯一性约束

一个 scope 内的每个存储类型必须具有**唯一**的目录路径。库在初始化时强制执行此约束：

- 如果两个存储类型解析到同一目录，则抛出 `IllegalArgumentException`。

## 目录要求

每个 scope 中每种存储类型的目录必须是**唯一**的。库在初始化时强制执行此约束。如果自定义路径覆写导致与另一存储类型的路径冲突，库将拒绝该配置。

::: warning
存储类型的 scope 目录**不得**与另一存储类型的目录路径重叠。
通过元配置自定义的路径覆写在构造时进行验证。
:::
