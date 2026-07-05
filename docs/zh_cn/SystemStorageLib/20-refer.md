---
title: 参考
---

# 参考

## 存储类型

| `StoreType` 枚举值 | 存储类型 | 描述                                                   |
| ------------------ | -------- | ------------------------------------------------------ |
| `CACHE`            | 缓存     | 可再生数据，例如缩略图                                 |
| `CONFIG`           | 配置     | 配置文件，如用户偏好                                   |
| `SECRETS`          | 秘密     | 需要加密的敏感数据，如令牌、密钥等                     |
| `DATA`             | 数据     | 可跨机器共享的持久化数据                               |
| `DATA_LOCAL`       | 本地数据 | 特定于当前机器的持久化数据，或重新生成代价高的缓存数据 |

## 存储位置

| 存储类型     | 默认路径                                               |
| :----------- | :----------------------------------------------------- |
| `CACHE`      | `{cacheDir}/mc_system_storage/cache/{scope}/`          |
| `CONFIG`     | `{configDir}/mc_system_storage/config/{scope}/`        |
| `SECRETS`    | `{dataLocalDir}/mc_system_storage/secrets/{scope}/`    |
| `DATA`       | `{dataDir}/mc_system_storage/data/{scope}/`            |
| `DATA_LOCAL` | `{dataLocalDir}/mc_system_storage/data_local/{scope}/` |

::: code-group

```txt [Windows]
{cacheDir}      {FOLDERID_LocalAppData}
{configDir}     {FOLDERID_RoamingAppData}
{dataDir}       {FOLDERID_RoamingAppData}
{dataLocalDir}  {FOLDERID_LocalAppData}
```

```txt [Linux]
{cacheDir}      $XDG_CACHE_HOME 或 ~/.cache
{configDir}     $XDG_CONFIG_HOME 或 ~/.config
{dataDir}       $XDG_DATA_HOME 或 ~/.local/share
{dataLocalDir}  $XDG_DATA_HOME 或 ~/.local/share
```

```txt [macOS]
{cacheDir}      ~/Library/Caches
{configDir}     ~/Library/Application Support
{dataDir}       ~/Library/Application Support
{dataLocalDir}  ~/Library/Application Support
```

:::

## 全局路径

| 用途                  | 默认路径                                    |
| :-------------------- | :------------------------------------------ |
| 元配置 (`metaConfig`) | `{configDir}/mc_system_storage/metaconfig/` |
| 日志 (`logs`)         | `{dataLocalDir}/mc_system_storage/logs/`    |

## 访问器模式

`Scope#access()` 工厂方法创建基于目录的访问器，统一管理路径、日志、锁与变更通知：

```java
SecretsAccessor secrets = scope.access(StoreType.SECRETS, SecretsAccessor::from);
```

`access()` 接收 `BiFunction<Path, Logger, T>`，其中 `T extends DirectoryAccessor`。
内置的访问器基类 `AbstractDirectoryAccessor` 提供了路径管理、日志、变更通知和锁创建等通用功能。

## 元配置管理

`MetaConfigAccessor` 管理库的全局配置，支持跨进程热重载：

```java
MetaConfigAccessor metaConfig = SystemStorageLib.getInstance().metaConfig();

MetaConfig config = metaConfig.get();

metaConfig.update(cfg -> {
    cfg.setMaxLogFileSize(2 * 1024 * 1024);
    cfg.setMaxLogArchiveFiles(32);
});
```

当配置文件被外部进程修改时，`onChanged` 事件会自动触发：

```java
metaConfig.onChanged().on(event -> {
    MetaConfig newConfig = event.config();
    // 响应配置变更
});
```

## 日志轮转配置

通过 `MetaConfigAccessor` 配置，JSON 格式，支持跨进程热重载：

```json
{
  "max_log_file_size": 1048576,
  "max_log_archive_files": 16
}
```

- `max_log_file_size`：单个日志文件大小上限（字节），默认为 1MB
- `max_log_archive_files`：轮转存档文件数量上限，默认为 16

## 密钥存储详情

### 安全模型

**可防护的情况**：云同步（Dropbox、iCloud 等）导致的意外泄露、版本控制（git）导致的意外暴露、截图或屏幕共享导致的意外泄露。

**不能防护的情况**：系统中本地运行的恶意软件、对机器的物理访问。

**数据丢失容忍度**：密钥存储在用户切换、虚拟机配置更改、操作系统重装等场景下会丢失数据，这是有意为之 — 加密密钥绑定到本地机器和用户环境。

### 加密详情

- **算法**：AES-256-GCM（带关联数据的认证加密）
- **密钥派生**：PBKDF2WithHmacSHA256，65,536 次迭代
- **密钥材料**：`user.name:user.home:machineId`
- **盐值**：`SystemStorageLib-MetaConfigAccessor-v1`（静态）
- 键名使用 SHA-256 摘要，不以明文存储。

### 文件权限控制

| 平台    | 机制                          | 权限                               |
| ------- | ----------------------------- | ---------------------------------- |
| POSIX   | `PosixFilePermission`         | 目录 `rwx------`，文件 `rw-------` |
| Windows | `AclFileAttributeView`（ACL） | 仅所有者具有读写权限               |

> [!Note]
>
> 权限设置在文件/目录创建时自动应用。如果文件系统不支持 POSIX 权限（如 FAT32），则会自动尝试 ACL 方案。

### 原子写入

`set()` 操作使用「写入临时文件 → fsync → 原子重命名」模式，确保目标文件永远不会处于部分写入的损坏状态。

### 完整性验证

每个密钥文件使用二进制格式存储（版本号 + IV + 密文 + GCM 认证标签）。读取时通过 GCM 认证进行完整性验证，如果文件被篡改或格式不受支持，会抛出 `SecretIntegrityException`。

### 限制

- **不支持列出条目**：键名以哈希形式存储，无法枚举已存储的键名。
- **无 TTL/过期**：密钥不会自动过期。
- **环境绑定**：用户配置文件更改或操作系统重装后，密钥将无法读取。
