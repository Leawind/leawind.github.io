---
title: Storage Manager
---

# Storage Manager

The `StorageManager` interface is the base for all store types (except `CredentialStore`, which extends it). It provides directory management, cross-process locking, and lifecycle operations.

## Interface

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

## Getting the Directory Path

```java
StorageManager config = scope.storage(StoreType.CONFIG);
Path dir = config.getDirPath();

// Absolute and normalized path
// e.g., /home/steve/.config/mc_system_storage/config/my-mod

// Read/write files directly
Path settings = dir.resolve("settings.json");
String json = Files.readString(settings);
Files.writeString(dir.resolve("state.txt"), "hello");
```

## Updating the Directory Path

The storage directory can be changed at runtime via `setDirPath()`:

```java
config.setDirPath(Path.of("/new/path/for/config"));
```

::: danger
Must NOT be called while any thread is holding the lock or performing I/O on the old directory.
:::

When the directory path is changed:

1. The old lock file is deleted
2. The path is normalized to absolute form
3. A new lock file is created in the new directory on the next `getLock()` call

## Locking

All `StorageManager` instances provide a file-based `ReadWriteLock` for cross-process synchronization.

### Lock Semantics

- **Multiple readers** across processes can hold the read lock concurrently
- **Write lock** is exclusive — blocks both readers and writers across all processes
- **Reentrant**: the same thread can acquire the same lock multiple times (must unlock equally many)
- **Read → Write upgrade**: NOT supported (throws `IllegalStateException`)
- **Write → Read downgrade**: supported
- **`lock()`**: blocks until the lock is available
- **`tryLock()`**: returns `false` immediately if lock cannot be acquired

### Usage

```java
ReadWriteLock lock = config.getLock();

// Read lock
lock.readLock().lock();
try {
    String content = Files.readString(config.getDirPath().resolve("data.json"));
} finally {
    lock.readLock().unlock();
}

// Write lock
lock.writeLock().lock();
try {
    Files.writeString(config.getDirPath().resolve("data.json"), newData);
} finally {
    lock.writeLock().unlock();
}
```

### Lock File

The lock is implemented via a `.lock` file in the storage directory. It uses [`FileBasedReentrantReadWriteLock`](https://github.com/Leawind/inventory-java) — a file-based lock mechanism that coordinates across JVM processes via file creation and deletion.

## Clear vs Delete

| Operation  | Effect                                 | Keeps `.lock`? | Keeps directory? |
| ---------- | -------------------------------------- | :------------: | :--------------: |
| `clear()`  | Removes all contents except `.lock`    |      Yes       |       Yes        |
| `delete()` | Removes everything including directory |       No       |        No        |

### `clear()`

Removes all files and subdirectories inside the storage directory, but **keeps the directory itself** and the `.lock` file:

```java
config.clear(); // all user files gone, directory and .lock remain
```

### `delete()`

Completely removes the storage directory and all its contents, including the lock file:

```java
config.delete(); // everything gone
```

Both operations are safe — `clear()` never touches the `.lock` file, and `delete()` acquires the write lock before removal.

## Atomic File Writing

The library uses an internal `AtomicFileWriter` utility for safe file writes:

1. Write data to a temp file (`.tmp` suffix)
2. Call `fsync` to flush to disk
3. Atomically rename temp file to target file

This guarantees the target file is never in a partially-written state, even if the JVM or system crashes mid-write.

::: info
The `AtomicFileWriter` is used internally by `CredentialStore` and `MetaConfigManager`. When you write files directly using `Files.write*()` in the storage directory, you are responsible for your own atomicity.
:::
