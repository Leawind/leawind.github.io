---
title: 密钥存储
---

# 密钥存储

`SecretsAccessor` 用于为敏感数据（如 API 令牌、OAuth 凭据和密码）提供加密的持久化键值存储。

## 安全模型

### 可防护的情况

- **云同步**（Dropbox、iCloud 等）导致的意外泄露
- **版本控制**（git）导致的意外暴露
- **截图**或**屏幕共享**导致的意外泄露

### 不能防护的情况

- 系统中本地运行的**恶意软件**
- 对机器的**物理访问**

### 数据丢失容忍度

密钥存储在某些情况下可能会丢失数据：

- 用户切换
- 虚拟机配置更改
- 操作系统重装
- 其他本地环境变更

这是有意为之 — 加密密钥绑定到本地机器和用户环境。

## 加密详情

- **算法**：AES-256-GCM（带关联数据的认证加密）
- **密钥派生**：PBKDF2WithHmacSHA256，65,536 次迭代
- **密钥材料**：`user.name:user.home:machineId`
- **盐值**：`SystemStorageLib-SecretStore-v1`（静态）

键名使用 SHA-256 摘要，不以明文存储。

### 基本用法

```java
var secrets = scope.access(StoreType.SECRETS, SecretsAccessor::from);

secrets.set("discord-token", "abc123...");

boolean exists = secrets.exists("discord-token"); // true
String token = secrets.get("discord-token");      // "abc123..."
secrets.remove("discord-token");
```

## 文件权限控制

密钥存储目录和文件在创建时自动设置为仅当前用户可访问，防止同一系统上其他用户读取：

| 平台    | 机制                          | 权限                               |
| ------- | ----------------------------- | ---------------------------------- |
| POSIX   | `PosixFilePermission`         | 目录 `rwx------`，文件 `rw-------` |
| Windows | `AclFileAttributeView`（ACL） | 仅所有者具有读写权限               |

> [!Note]
>
> 权限设置在文件/目录创建时自动应用。如果文件系统不支持 POSIX 权限（如 FAT32），则会自动尝试 ACL 方案。

## 原子写入

`set()` 操作使用「写入临时文件 → fsync → 原子重命名」模式：

- 写入期间进程崩溃 → 目标文件保持原样
- 写入完成但重命名前崩溃 → 残留临时文件，目标文件不受影响
- 确保目标文件永远不会处于部分写入的损坏状态

## 完整性验证

每个密钥文件使用以下二进制格式存储：

| 偏移    | 大小 | 字段          |
| ------- | ---- | ------------- |
| `0x00`  | 1B   | 版本 (`0x01`) |
| `0x01`  | 12B  | IV / Nonce    |
| `0x0D`  | N B  | 密文          |
| 末尾-16 | 16B  | GCM 认证标签  |

读取时通过 GCM 认证进行完整性验证：

- 如果文件被篡改，解密会失败并抛出 `SecretIntegrityException`
- 如果格式版本不受支持，抛出 `SecretIntegrityException`
- 如果文件过短（小于 29 字节），抛出 `SecretIntegrityException`
- 库不会返回已损坏或被篡改的数据

## 机器标识解析

`SecretsAccessor` 使用机器标识作为密钥材料的组成部分，确保加密数据绑定到特定机器：

| 平台    | 来源                                                      |
| ------- | --------------------------------------------------------- |
| Linux   | `/etc/machine-id` 或 `/var/lib/dbus/machine-id`           |
| Windows | 注册表 `HKLM\SOFTWARE\Microsoft\Cryptography\MachineGuid` |
| macOS   | `ioreg IOPlatformUUID`                                    |

机器标识在首次访问时惰性获取并缓存。如果解析失败，密钥派生将回退为仅使用 `user.name:user.home`。

## 限制

- **不支持列出条目**：键名以哈希形式存储，因此无法枚举已存储的键名。
- **无 TTL/过期**：密钥不会自动过期。
- **环境绑定**：用户配置文件更改或操作系统重装后，密钥将无法读取。
