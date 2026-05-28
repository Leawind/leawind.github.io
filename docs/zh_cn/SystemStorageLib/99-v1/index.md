---
title: v1
---

# SystemStorageLib v1

## 快速概览

```java
Scope scope = SystemStorageLib.getInstance().scope("example_mod");

Storage storage = scope.storage(StoreType.CREDENTIALS);
CredentialStore credentials = CredentialStore.of(storage);
credentials.set("some_token", "secret_value_123");

String token = credentials.get("some_token"); // "secret_value_123"
```

## 核心特性

- **基于 Scope 的隔离** — 每个模组拥有独立的 scope，避免冲突
- **五种存储类型** — `CREDENTIALS`、`CONFIG`、`DATA`、`CACHE`、`DATA_LOCAL`，各有不同语义
- **加密凭据存储** — AES-256-GCM 配合 PBKDF2 密钥派生，绑定到当前系统
- **跨进程锁** — 基于文件的可重入读写锁
- **平台感知路径** — 通过 [directories-jvm](https://github.com/dirs-dev/directories-jvm) 遵循 XDG/Windows/macOS 约定
- **元配置** — 支持每个 scope 的自定义目录覆写

## 存储类型

| 存储类型      | 用途                                                   | 可自定义路径 |
| ------------- | ------------------------------------------------------ | :----------: |
| `CACHE`       | 可再生的缓存数据                                       |      ✅      |
| `CONFIG`      | 配置文件                                               |      ✅      |
| `CREDENTIALS` | 需要加密的敏感数据（令牌、密钥等）                     |      ❌      |
| `DATA`        | 可跨机器共享的持久化数据                               |      ✅      |
| `DATA_LOCAL`  | 特定于当前机器的持久化数据，或重新生成代价高的缓存数据 |      ✅      |
