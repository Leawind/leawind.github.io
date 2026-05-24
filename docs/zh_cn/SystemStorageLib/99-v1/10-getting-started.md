---
title: 快速入门
---

# 快速入门

## 依赖

SystemStorageLib 通过 [JitPack](https://jitpack.io/#Leawind/SystemStorageLib) 发布。

### Gradle

```kotlin
repositories {
    maven("https://jitpack.io")
}

dependencies {
    // 在 JitPack 上查看最新版本
    modImplementation("com.github.Leawind:SystemStorageLib:<version>")
}
```

## 基本用法

### 1. 获取库实例

该库是单例，通过 `SystemStorageLib.getInstance()` 访问：

```java
import io.github.leawind.systemstoragelib.v1.api.SystemStorageLib;

SystemStorageLib lib = SystemStorageLib.getInstance();
```

### 2. 创建 Scope

Scope 是一个隔离的存储命名空间。每个模组应使用自己唯一的 scope 名称：

```java
import io.github.leawind.systemstoragelib.v1.api.ScopeStorage;

ScopeStorage myMod = lib.scope("my-mod");
```

**Scope 命名规则：**

- 长度在 2 到 128 个字符之间
- 不能以 `-`、`+` 或 `.` 开头或结尾
- 允许的字符：数字、ASCII 字母、`_`、`-`、`+`、`.`

可以在使用前验证 scope 名称：

```java
String error = lib.validateScope("invalid scope!");
if (error != null) {
    // 处理无效的 scope
}

// 或者简单地检查是否有效
if (lib.isScopeValid("my-mod")) {
    // scope 名称有效
}
```

使用 `getAllScopes()` 列出所有已知的 scope：

```java
lib.getAllScopes().forEach(scopeName -> {
    System.out.println("Found scope: " + scopeName);
});
```

### 3. 访问存储类型

每个 scope 都可访问五种存储类型：

```java
import io.github.leawind.systemstoragelib.v1.api.StoreType;
import io.github.leawind.systemstoragelib.v1.api.managers.StorageManager;
import io.github.leawind.systemstoragelib.v1.api.managers.CredentialStore;

// 通用存储管理器
StorageManager config = myMod.storage(StoreType.CONFIG);
StorageManager data = myMod.storage(StoreType.DATA);
StorageManager cache = myMod.storage(StoreType.CACHE);
StorageManager dataLocal = myMod.storage(StoreType.DATA_LOCAL);

// 加密凭据存储
CredentialStore credentials = myMod.storage(StoreType.CREDENTIALS);
```

### 4. 读写数据

#### 凭据存储（加密）

```java
// 存储令牌
credentials.set("api-key", "sk-abc123...");

// 获取
String token = credentials.get("api-key");

// 检查是否存在
if (credentials.exists("api-key")) {
    // ...
}

// 删除
credentials.remove("api-key");
```

#### 通用存储（明文）

对于 `CONFIG`、`DATA`、`CACHE` 和 `DATA_LOCAL`，直接操作文件系统：

```java
// 获取目录路径
Path configDir = config.getDirPath();

// 使用标准 Java I/O 读写文件
Path settingsFile = configDir.resolve("settings.json");
String content = Files.readString(settingsFile);
```

### 5. 跨进程锁

所有存储管理器都提供 `ReadWriteLock` 以实现安全的并发访问：

```java
ReadWriteLock lock = config.getLock();

lock.readLock().lock();
try {
    // 读操作
} finally {
    lock.readLock().unlock();
}

lock.writeLock().lock();
try {
    // 写操作
} finally {
    lock.writeLock().unlock();
}
```

### 6. 元配置

按 scope 覆写默认存储路径：

```java
import io.github.leawind.systemstoragelib.v1.api.managers.MetaConfigManager;
import io.github.leawind.systemstoragelib.v1.api.metaconfig.MetaConfig;
import io.github.leawind.systemstoragelib.v1.api.metaconfig.PerScopeConfig;

MetaConfigManager meta = lib.metaConfig();

// 读取当前配置
MetaConfig config = meta.get();

// 为 scope 设置自定义目录
PerScopeConfig perScope = config.getOrCreateScopeConfig("my-mod");
perScope.setCustomDir(StoreType.CONFIG, Path.of("/custom/config/path"));
meta.set(config);
```

### 7. 日志

每个 scope 都有自己带 scope 标记的 logger：

```java
org.slf4j.Logger logger = myMod.logger();
logger.info("Hello from my-mod!");
```

库还提供了全局 logger 和日志目录：

```java
// 全局库 logger
org.slf4j.Logger libLogger = lib.logger();

// 日志目录
Path logsDir = lib.getLogsDir();
```
