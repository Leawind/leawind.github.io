---
title: General Storage
---

# General Storage

Through `Scope#storage(StoreType)`, you can obtain a `Storage` instance corresponding to the storage type, which allows access to loggers, directory paths, and a cross-process lock object.

## Getting Directory Path

```java
Path dataDir = scope.storage(StoreType.DATA).getDirPath();

Path dataFilePath = dataDir.resolve("data.json");
String dataJson = Files.readString(dataFilePath);
```

## Locks

You can obtain a file-based `ReadWriteLock` for cross-process synchronization via `Storage#getLock()`.

Locks are implemented using `.lock` files in the storage directory.

### Lock Semantics

- **Multiple Read Locks**: Multiple processes can hold read locks simultaneously
- **Single Write Lock**: Write locks are exclusive — blocking readers/writers across all processes
- **Reentrant**: Same thread can acquire the same lock multiple times (must unlock the same number of times)
- **Read-to-Write Upgrade**: Not supported (throws `IllegalStateException`)
- **Write-to-Read Downgrade**: Supported
- **`lock()`**: Blocks until lock is available
- **`tryLock()`**: Returns `false` if lock cannot be acquired immediately

### Usage

```java
ReadWriteLock lock = config.getLock();

// Read lock
lock.readLock().lock();
try {
    String content = Files.readString(dataFilePath);
} finally {
    lock.readLock().unlock();
}

// Write lock
lock.writeLock().lock();
try {
    Files.writeString(dataFilePath, newData);
} finally {
    lock.writeLock().unlock();
}
```
