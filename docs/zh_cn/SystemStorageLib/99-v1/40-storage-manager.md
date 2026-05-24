---
title: 存储管理器
---

# 存储管理器

`StorageManager` 接口是所有存储类型（扩展它的 `CredentialStore` 除外）的基础接口。它提供目录管理、跨进程锁和生命周期操作。

## 接口

```java
public interface StorageManager {
    Logger logger();
    Path getDirPath();
    void setDirPath(Path dirPath);
    ReadWriteLock getLock() throws IOException;
    void clear() throws IOException;
    void delete() throws IOException;
}
```

## 获取目录路径

```java
StorageManager config = scope.storage(StoreType.CONFIG);
Path dir = config.getDirPath();

// 绝对且规范化的路径
// 例如 /home/steve/.config/mc_system_storage/config/my-mod

// 直接读写文件
Path settings = dir.resolve("settings.json");
String json = Files.readString(settings);
Files.writeString(dir.resolve("state.txt"), "hello");
```

## 更新目录路径

可以通过 `setDirPath()` 在运行时更改存储目录：

```java
config.setDirPath(Path.of("/new/path/for/config"));
```

::: danger
在有任何线程持有锁或正在旧目录上执行 I/O 时，**绝对不能**调用此方法。
:::

更改目录路径时：

1. 旧的锁文件被删除
2. 路径规范化为绝对形式
3. 下次调用 `getLock()` 时，在新目录中创建新的锁文件

## 锁

所有 `StorageManager` 实例都提供基于文件的 `ReadWriteLock` 用于跨进程同步。

### 锁语义

- **多个读锁**：跨进程可同时持有读锁
- **单个写锁**：写锁是排他的 — 跨所有进程阻塞读写者
- **可重入**：同一线程可多次获取同一个锁（必须解锁相同次数）
- **读→写升级**：不支持（抛出 `IllegalStateException`）
- **写→读降级**：支持
- **`lock()`**：阻塞直到锁可用
- **`tryLock()`**：如果无法立即获取锁则返回 `false`

### 用法

```java
ReadWriteLock lock = config.getLock();

// 读锁
lock.readLock().lock();
try {
    String content = Files.readString(config.getDirPath().resolve("data.json"));
} finally {
    lock.readLock().unlock();
}

// 写锁
lock.writeLock().lock();
try {
    Files.writeString(config.getDirPath().resolve("data.json"), newData);
} finally {
    lock.writeLock().unlock();
}
```

### 锁文件

锁通过存储目录中的 `.lock` 文件实现。它使用 [`FileBasedReentrantReadWriteLock`](https://github.com/Leawind/inventory-java) — 一种基于文件的锁机制，通过文件创建和删除在 JVM 进程之间进行协调。

## Clear 与 Delete 对比

| 操作       | 效果                         | 保留 `.lock`？ | 保留目录？ |
| ---------- | ---------------------------- | :------------: | :--------: |
| `clear()`  | 移除除 `.lock` 外的所有内容  |       是       |     是     |
| `delete()` | 移除所有内容（包括目录本身） |       否       |     否     |

### `clear()`

移除存储目录内的所有文件和子目录，但**保留目录本身**和 `.lock` 文件：

```java
config.clear(); // 用户文件全部删除，目录和 .lock 保留
```

### `delete()`

完全移除存储目录及其所有内容，包括锁文件：

```java
config.delete(); // 一切移除
```

两个操作都是安全的 — `clear()` 不会触碰 `.lock` 文件，`delete()` 在移除前先获取写锁。

## 原子文件写入

库内部使用 `AtomicFileWriter` 实用工具进行安全的文件写入：

1. 将数据写入临时文件（`.tmp` 后缀）
2. 调用 `fsync` 刷新到磁盘
3. 原子性地将临时文件重命名为目标文件

这保证目标文件即使在 JVM 或系统在写入中途崩溃时也不会处于部分写入状态。

::: info
`AtomicFileWriter` 由 `CredentialStore` 和 `MetaConfigManager` 内部使用。当你在存储目录中直接使用 `Files.write*()` 写入文件时，需要自行保证原子性。
:::
