---
title: v1
---

# System Storage Lib v1

- **规范存储位置** — 通过 [directories-jvm](https://github.com/dirs-dev/directories-jvm) 遵循 XDG/Windows/macOS 约定
- **五种存储类型** — 缓存、配置、密钥、数据、本地数据
- **目录访问器模式** — 通过 `Scope#access()` 工厂方法创建基于目录的访问器，统一管理路径、日志、锁与变更通知
- **跨进程锁** — 基于文件的跨进程可重入读写锁（`FileBasedReentrantReadWriteLock`）
- **加密键值存储** — AES-256-GCM 配合 PBKDF2 密钥派生，绑定到当前系统，文件自动设为仅所有者可读写
- **原子写入** — 写入-重命名模式保证文件永不处于部分写入状态
- **日志轮转** — 支持按大小轮转日志文件并保留存档数量上限
- **元配置管理** — 全局配置 JSON 文件，支持跨进程热重载

推荐阅读：

- [存储位置](./location)
- [快速开始](./getting-started)
- [密钥存储](./secrets)
