---
title: 跨进程锁
---

# 跨进程锁

SystemStorageLib 提供**基于文件的跨进程读写锁**，允许多个模组和 Minecraft 实例安全并发地访问存储目录。

## 为什么需要跨进程锁？

在模组化 Minecraft 环境中：

- 同一 JVM 内的多个模组可能访问同一存储目录
- 多个 Minecraft 实例（独立 JVM）可能同时运行
- 文件级竞态条件可能损坏数据

锁系统确保：

- 同一时间只有一个写者（跨进程）
- 允许多个并发读者
- 模组之间的安全协调

## 锁语义

| 操作        | 是否支持？ | 说明                         |
| ----------- | :--------: | ---------------------------- |
| 多个读锁    |     ✅     | 多个读者可同时持有读锁       |
| 单个写锁    |     ✅     | 写锁是排他的                 |
| 读→写升级   |     ❌     | 抛出 `IllegalStateException` |
| 写→读降级   |     ✅     | 持有写锁的线程也可获取读锁   |
| 可重入读    |     ✅     | 同一线程可多次获取读锁       |
| 可重入写    |     ✅     | 同一线程可多次获取写锁       |
| `lock()`    |     ✅     | 阻塞直到锁可用               |
| `tryLock()` |     ✅     | 如果不可用立即返回 `false`   |
| 跨进程      |     ✅     | 跨 JVM 进程协调              |

## 使用模式

### 基本读模式

```java
StorageManager manager = scope.storage(StoreType.DATA);
ReadWriteLock lock = manager.getLock();

lock.readLock().lock();
try {
    Path file = manager.getDirPath().resolve("data.json");
    String content = Files.readString(file);
    // 处理内容
} finally {
    lock.readLock().unlock();
}
```

### 基本写模式

```java
lock.writeLock().lock();
try {
    Path file = manager.getDirPath().resolve("state.dat");
    Files.write(file, data);
} finally {
    lock.writeLock().unlock();
}
```

### 读-修改-写

```java
lock.writeLock().lock();
try {
    // 读
    Path file = manager.getDirPath().resolve("counter.txt");
    int count = Integer.parseInt(Files.readString(file));

    // 修改
    count++;

    // 写
    Files.writeString(file, String.valueOf(count));
} finally {
    lock.writeLock().unlock();
}
```

### 非阻塞尝试

```java
if (lock.writeLock().tryLock()) {
    try {
        // 执行写操作
    } finally {
        lock.writeLock().unlock();
    }
} else {
    // 其他进程正在写入，优雅处理
    logger.warn("存储被其他进程锁定，跳过写入");
}
```

## 内建锁

某些操作会自动获取适当的锁：

| 操作                      | 获取的锁 |
| ------------------------- | :------: |
| `CredentialStore.set()`   |   写锁   |
| `CredentialStore.get()`   |   读锁   |
| `MetaConfigManager.set()` |   写锁   |
| `MetaConfigManager.get()` |   读锁   |
| `StorageManager.delete()` |   写锁   |

## 锁文件机制

- 每个 `StorageManager` 在其存储目录中维护一个 `.lock` 文件
- 锁通过 [`FileBasedReentrantReadWriteLock`](https://github.com/Leawind/inventory-java) 实现
- 锁文件通过文件系统在 JVM 进程之间进行协调
- 调用 `setDirPath()` 时，旧锁文件被删除，新的锁文件被延迟创建

## 最佳实践

1. **始终使用 try-finally** — 确保即使在异常时也能释放锁
2. **保持锁范围最小** — 尽可能短地持有锁
3. **读操作用读锁** — 不要不必要地获取写锁
4. **避免跨不同管理器的嵌套锁获取** — 以防死锁
5. **在可能发生锁争用时优先使用 `tryLock()` 并带有回退逻辑**

## 示例：安全的配置更新

```java
void updateConfig(ScopeStorage scope, String key, String value) throws IOException {
    StorageManager config = scope.storage(StoreType.CONFIG);
    ReadWriteLock lock = config.getLock();

    lock.writeLock().lock();
    try {
        Path configFile = config.getDirPath().resolve("settings.json");

        // 读取现有配置
        JsonObject json;
        if (Files.exists(configFile)) {
            String content = Files.readString(configFile);
            json = GSON.fromJson(content, JsonObject.class);
        } else {
            json = new JsonObject();
        }

        // 修改
        json.addProperty(key, value);

        // 写回
        Files.writeString(configFile, GSON.toJson(json));
    } finally {
        lock.writeLock().unlock();
    }
}
```
