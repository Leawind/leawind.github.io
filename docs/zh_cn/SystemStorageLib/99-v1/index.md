---
title: v1
---

# System Storage Lib v1

- **规范存储位置** — 通过 [directories-jvm](https://github.com/dirs-dev/directories-jvm) 遵循 XDG/Windows/macOS 约定
- **五种存储类型** — 缓存、配置、凭据、数据、本地数据
- **跨进程锁** — 基于文件的跨进程读写锁
- **加密键值存储** — AES-256-GCM 配合 PBKDF2 密钥派生，绑定到当前系统

推荐阅读：

- [存储位置](./location)
- [快速开始](./getting-started)
