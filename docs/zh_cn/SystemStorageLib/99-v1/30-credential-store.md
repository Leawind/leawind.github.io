---
title: 凭据存储
---

# 凭据存储

`CredentialStore` 为敏感数据（如 API 令牌、OAuth 凭据和密码）提供**加密的持久化键值存储**。

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
- **密钥材料**：`username:user.home:machine-id`
- **盐值**：`SystemStorageLib-CredentialStore-v1`（静态）

密钥**从不以明文存储**；文件名仅使用 SHA-256 摘要。

## 文件格式

凭据值以独立文件存储，扩展名为 `.enc`。文件名是密钥的 SHA-256 十六进制摘要。

### 二进制文件布局

| 偏移量 | 大小 | 字段       | 描述                   |
| ------ | ---- | ---------- | ---------------------- |
| `0x00` | 1 B  | Version    | 格式版本 (`0x01`)      |
| `0x01` | 12 B | IV/Nonce   | 随机初始化向量         |
| `0x0D` | N B  | Ciphertext | AES-256-GCM 加密载荷   |
| EOF-16 | 16 B | Auth Tag   | GCM 认证标签（128 位） |

### 最小文件大小

29 字节（1 + 12 + 16）。小于此大小的文件视为已损坏并拒绝读取。

## 文件权限

在 POSIX 系统（Linux、macOS）上，凭据文件和目录以最小权限创建：

- **目录**：`rwx------`（仅所有者读/写/执行）
- **文件**：`rw-------`（仅所有者读/写）

在 Windows 上，库会优雅降级（无 POSIX 权限）。

## 原子写入

所有凭据写入使用**先写临时文件再重命名**的模式，确保即使进程在写入中途崩溃，目标文件也不会处于部分写入状态。

## API

### `CredentialStore` 接口

```java
public interface CredentialStore extends StorageManager {
    boolean exists(String key);
    void set(String key, String value) throws IOException;
    String get(String key) throws IOException;
    void remove(String key) throws IOException;
}
```

### 基本用法

```java
CredentialStore store = scope.storage(StoreType.CREDENTIALS);

// 存储值
store.set("discord-token", "abc123...");

// 检查是否存在
if (store.exists("discord-token")) {
    String token = store.get("discord-token");
    // 使用令牌
}

// 删除
store.remove("discord-token");
```

## 完整性验证

每个凭据文件在读取时通过 GCM 认证进行完整性验证：

- 如果文件被**篡改**，解密会失败并抛出 `CredentialIntegrityException`
- 如果**格式版本**不受支持，抛出 `CredentialIntegrityException`
- 库**绝不会返回已损坏或被篡改的数据**

## 锁

凭据存储继承 `StorageManager` 的跨进程锁：

```java
ReadWriteLock lock = store.getLock();

lock.writeLock().lock();
try {
    store.set("key", "value");
} finally {
    lock.writeLock().unlock();
}
```

所有 `set` 操作内部会自动获取写锁。

## 限制

- **不支持列出密钥**：密钥以 SHA-256 哈希形式存储，因此无法枚举已存储的密钥。需要自行跟踪密钥。
- **无 TTL/过期**：凭据不会自动过期。如需过期逻辑，需自行实现。
- **环境绑定**：用户配置文件更改或操作系统重装后，凭据将无法读取。
