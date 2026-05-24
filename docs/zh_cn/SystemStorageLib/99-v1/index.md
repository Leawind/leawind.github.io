---
title: v1
---

# SystemStorageLib v1

一个 Minecraft 库模组，为其他模组提供**系统级持久化存储**。

它处理跨进程文件锁、加密凭据存储，并遵循各平台的数据目录约定（Linux 上的 XDG，Windows 上的 AppData，macOS 上的 Library）。

## 快速概览

```java
// 获取单例实例
SystemStorageLib lib = SystemStorageLib.getInstance();

// 创建或获取一个 scope（为你的模组提供隔离的存储命名空间）
ScopeStorage scope = lib.scope("my-mod");

// 访问不同的存储类型
StorageManager config = scope.storage(StoreType.CONFIG);
StorageManager data = scope.storage(StoreType.DATA);
CredentialStore credentials = scope.storage(StoreType.CREDENTIALS);
```

## 核心特性

- **基于 Scope 的隔离** — 每个模组拥有独立的 scope，避免冲突
- **五种存储类型** — `CREDENTIALS`、`CONFIG`、`DATA`、`CACHE`、`DATA_LOCAL`，各有不同语义
- **加密凭据存储** — AES-256-GCM 配合 PBKDF2 密钥派生，绑定到本地机器
- **跨进程锁** — 基于文件的可重入读写锁
- **平台感知路径** — 通过 [directories-jvm](https://github.com/dirs-dev/directories-jvm) 遵循 XDG/Windows/macOS 约定
- **元配置** — 支持每个 scope 的自定义目录覆写
- **多加载器支持** — Fabric、Forge、NeoForge
- **Java 17 兼容**

## 存储位置

所有数据存储在系统适当位置下的 `mc_system_storage` 根目录中：

| 存储类型      | 用途                           | 可自定义 |
| ------------- | ------------------------------ | :------: |
| `CREDENTIALS` | 加密敏感数据（令牌、密钥）     |    ❌    |
| `CONFIG`      | 用户可编辑的配置文件           |    ✅    |
| `DATA`        | 持久化数据，可跨机器共享       |    ✅    |
| `CACHE`       | 机器本地或重新生成代价高的数据 |    ✅    |
| `DATA_LOCAL`  | 可再生、重新生成代价低的数据   |    ✅    |

- **许可证**: [MIT](https://github.com/Leawind/SystemStorageLib/blob/main/LICENSE)
- **源码**: [GitHub](https://github.com/Leawind/SystemStorageLib)
