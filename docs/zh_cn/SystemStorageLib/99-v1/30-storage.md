---
title: 通用存储
---

# 通用存储

通过 `Scope#storage(StoreType)` 可以获取存储类型对应的 `Storage` 实例，通过它可以获取日志记录器、目录路径和一个跨进程锁对象。

## 获取目录路径

```java
Path dataDir = scope.storage(StoreType.DATA).getDirPath();

Path dataFilePath = dataDir.resolve("data.json");
String dataJson = Files.readString(dataFilePath);
```

## 锁

通过 `Storage#getLock()` 可获取基于文件的 `ReadWriteLock` 用于跨进程同步。

锁通过存储目录中的 `.lock` 文件实现。

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
    String content = Files.readString(dataFilePath);
} finally {
    lock.readLock().unlock();
}

// 写锁
lock.writeLock().lock();
try {
    Files.writeString(dataFilePath, newData);
} finally {
    lock.writeLock().unlock();
}
```
