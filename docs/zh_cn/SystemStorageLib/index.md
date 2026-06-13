---
title: System Storage Lib
---

<div align="center">
<img src="/icons/system-storage-lib.png" style="width: 8em; margin: 3em auto; image-rendering: pixelated;">

# System Storage Lib

</div>

一个 Minecraft 库模组，为其他模组提供**系统级持久化存储**，支持跨进程文件锁、加密凭据存储，并遵循各平台的数据目录约定（Linux 上的 XDG，Windows 上的 AppData，macOS 上的 Library）。

## 设计原则

- **有来有去**：确保用户可以干净地删除本库模组在系统中存放的所有文件
- **因盘制宜**：允许自定义大体积数据的存放位置，防止占用过多系统分区空间

## API 版本

| 版本        | 状态   |
| ----------- | ------ |
| [v1](./v1/) | 不稳定 |

> [!Warning] 🚧
>
> 当前为不稳定的非正式版本。API 随时可能发生破坏性变更。

> [!Tip]
>
> 本文档旨在指导开发者如何使用 System Storage Lib，而非事无巨细地罗列 API。仅展示关键 API 方法，更多细节请参考源码。

---

- **许可证**: [MIT License]
- **源码**: [GitHub - Leawind/SystemStorageLib]

---

[MIT License]: https://github.com/Leawind/SystemStorageLib/blob/main/LICENSE
[GitHub - Leawind/SystemStorageLib]: https://github.com/Leawind/SystemStorageLib
