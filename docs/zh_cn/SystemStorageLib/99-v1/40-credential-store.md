---
title: 凭据存储
---

# 凭据存储

`CredentialStore` 是一个 `Storage` 包装器，用于为敏感数据（如 API 令牌、OAuth 凭据和密码）提供加密的持久化键值存储。

## 安全模型

### 可防护的情况

- **云同步**（Dropbox、iCloud 等）导致的意外泄露
- **版本控制**（git）导致的意外暴露
- **截图**或**屏幕共享**导致的意外泄露

### 不能防护的情况

- 系统中本地运行的**恶意软件**
- 对机器的**物理访问**

### 数据丢失容忍度

凭据存储在某些情况下可能会丢失数据：

- 用户切换
- 虚拟机配置更改
- 操作系统重装
- 其他本地环境变更

这是有意为之 — 加密密钥绑定到本地机器和用户环境。

## 加密详情

- **算法**：AES-256-GCM（带关联数据的认证加密）
- **密钥派生**：PBKDF2WithHmacSHA256，65,536 次迭代
- **密钥材料**：`user.name:user.home:machineId`
- **盐值**：`SystemStorageLib-CredentialStore-v1`（静态）

键名使用 SHA-256 摘要，不以明文存储。

### 基本用法

```java
CredentialStore credentials = scope.storage(StoreType.CREDENTIALS).map(CredentialStore::of);

credentials.set("discord-token", "abc123...");

boolean exists = credentials.exists("discord-token"); // true
String token = credentials.get("discord-token");      // "abc123..."
credentials.remove("discord-token");
```

## 完整性验证

每个凭据文件在读取时通过 GCM 认证进行完整性验证：

- 如果文件被篡改，解密会失败并抛出 `CredentialIntegrityException`
- 如果格式版本不受支持，抛出 `CredentialIntegrityException`
- 库不会返回已损坏或被篡改的数据

## 限制

- **不支持列出条目**：键名以哈希形式存储，因此无法枚举已存储的键名。
- **无 TTL/过期**：凭据不会自动过期。
- **环境绑定**：用户配置文件更改或操作系统重装后，凭据将无法读取。
