---
title: Cross-Process Locking
---

# Cross-Process Locking

SystemStorageLib provides **file-based cross-process read-write locking** to allow safe concurrent access to storage directories across multiple mods and Minecraft instances.

## Why Cross-Process Locking?

In a modded Minecraft environment:

- Multiple mods within the same JVM may access the same storage directory
- Multiple Minecraft instances (separate JVMs) may run simultaneously
- File-level race conditions can corrupt data

The locking system ensures:

- Only one writer at a time (across processes)
- Multiple concurrent readers
- Safe coordination between mods

## Lock Semantics

| Operation              | Supported? | Description                                       |
| ---------------------- | :--------: | ------------------------------------------------- |
| Multiple read locks    |     ✅     | Many readers can hold the read lock concurrently  |
| Single write lock      |     ✅     | Write lock is exclusive                           |
| Read → Write upgrade   |     ❌     | Throws `IllegalStateException`                    |
| Write → Read downgrade |     ✅     | Thread holding write lock can also acquire read   |
| Reentrant reads        |     ✅     | Same thread can acquire read lock multiple times  |
| Reentrant writes       |     ✅     | Same thread can acquire write lock multiple times |
| `lock()`               |     ✅     | Blocks until lock is available                    |
| `tryLock()`            |     ✅     | Returns `false` immediately if unavailable        |
| Cross-process          |     ✅     | Coordinates across JVM processes                  |

## Usage Patterns

### Basic Read Pattern

```java
StorageManager manager = scope.storage(StoreType.DATA);
ReadWriteLock lock = manager.getLock();

lock.readLock().lock();
try {
    Path file = manager.getDirPath().resolve("data.json");
    String content = Files.readString(file);
    // process content
} finally {
    lock.readLock().unlock();
}
```

### Basic Write Pattern

```java
lock.writeLock().lock();
try {
    Path file = manager.getDirPath().resolve("state.dat");
    Files.write(file, data);
} finally {
    lock.writeLock().unlock();
}
```

### Read-Modify-Write

```java
lock.writeLock().lock();
try {
    // Read
    Path file = manager.getDirPath().resolve("counter.txt");
    int count = Integer.parseInt(Files.readString(file));
    
    // Modify
    count++;
    
    // Write
    Files.writeString(file, String.valueOf(count));
} finally {
    lock.writeLock().unlock();
}
```

### Non-Blocking Try

```java
if (lock.writeLock().tryLock()) {
    try {
        // Perform write operation
    } finally {
        lock.writeLock().unlock();
    }
} else {
    // Another process is writing, handle gracefully
    logger.warn("Storage locked by another process, skipping write");
}
```

## Built-in Locking

Some operations automatically acquire the appropriate lock:

| Operation                 | Lock Acquired |
| ------------------------- | :-----------: |
| `CredentialStore.set()`   |  Write lock   |
| `CredentialStore.get()`   |   Read lock   |
| `MetaConfigManager.set()` |  Write lock   |
| `MetaConfigManager.get()` |   Read lock   |
| `StorageManager.delete()` |  Write lock   |

## Lock File Mechanics

- Each `StorageManager` maintains a `.lock` file in its storage directory
- The lock is implemented via [`FileBasedReentrantReadWriteLock`](https://github.com/Leawind/inventory-java)
- Lock files coordinate across JVM processes using the filesystem
- When `setDirPath()` is called, the old lock file is deleted and a new one is created lazily

## Best Practices

1. **Always use try-finally** to ensure locks are released even on exceptions
2. **Keep lock scope minimal** — hold locks for the shortest time possible
3. **Use read lock for reads** — don't acquire write locks unnecessarily
4. **Avoid nested lock acquisitions across different managers** to prevent deadlocks
5. **Prefer `tryLock()` with a fallback** when lock contention is possible

## Example: Safe Configuration Update

```java
void updateConfig(ScopeStorage scope, String key, String value) throws IOException {
    StorageManager config = scope.storage(StoreType.CONFIG);
    ReadWriteLock lock = config.getLock();
    
    lock.writeLock().lock();
    try {
        Path configFile = config.getDirPath().resolve("settings.json");
        
        // Read existing config
        JsonObject json;
        if (Files.exists(configFile)) {
            String content = Files.readString(configFile);
            json = GSON.fromJson(content, JsonObject.class);
        } else {
            json = new JsonObject();
        }
        
        // Modify
        json.addProperty(key, value);
        
        // Write back
        Files.writeString(configFile, GSON.toJson(json));
    } finally {
        lock.writeLock().unlock();
    }
}
```
