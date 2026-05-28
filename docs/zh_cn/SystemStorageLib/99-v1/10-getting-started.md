---
title: 快速入门
---

# 快速入门

## 依赖

System Storage Lib 通过 [JitPack](https://jitpack.io/#Leawind/SystemStorageLib) 发布。

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

### 获取库实例

该库是单例，通过 `SystemStorageLib.getInstance()` 访问。

在本地测试环境中，为了避免影响系统中的数据，可以使用构建器模式创建自定义实例：

```java
SystemStorageLib lib = SystemStorageLib.builder()
    .logsDir(Path.of("./logs"))
    .metaConfigDir(Path.of("./config"))
    .storeDir(StoreType.CACHE, Path.of("./cache"))
    .storeDir(StoreType.DATA, Path.of("./data"))
    .maxLogFileSize(1024 * 1024) // 1MB
    .maxLogArchiveFiles(3)
    .build();
```

### 创建 Scope

Scope 是一个隔离的存储命名空间。通常建议每个模组使用自己唯一的 scope 名称：

```java
Scope scope = SystemStorageLib.getInstance().scope("example_mod");
```

Scope 命名规则：

- 长度在 2 到 128 个字符之间
- 不能以 `-`、`+` 或 `.` 开头或结尾
- 允许的字符：数字、ASCII 字母、`_`、`-`、`+`、`.`

> [!Note]
>
> 推荐的命名规范：
>
> ```
> <mod_id>[.<scope_name>]
> ```
>
> 例如：
>
> - `example_mod`
> - `example_mod.alpha`

可以使用 `validateScopeName` 方法验证 scope 名称：

```java
String error = SystemStorageLib.getInstance().validateScopeName("invalid scope!");
if (error != null) {
    // 处理无效的 scope 名称
}
```

### 选择存储类型

每个 scope 都可访问五种存储类型：

| 存储类型      | 用途                                                   | 可自定义 | 典型内容             |
| ------------- | ------------------------------------------------------ | :------: | -------------------- |
| `CACHE`       | 可再生的缓存数据                                       |    ✅    | 缩略图               |
| `CONFIG`      | 配置文件                                               |    ✅    |                      |
| `CREDENTIALS` | 需要加密的敏感数据                                     |    ❌    | API 令牌、OAuth 密钥 |
| `DATA`        | 可跨机器共享的持久化数据                               |    ✅    | 下载的他人作品       |
| `DATA_LOCAL`  | 特定于当前机器的持久化数据，或重新生成代价高的缓存数据 |    ✅    | 会话数据、临时状态   |

通过 `Scope#storage(StoreType)` 方法获取 `Storage` 实例：

```java
Storage data = scope.storage(StoreType.DATA);
```

#### 获取目录并直接操作文件系统

```java
Path dataDir = scope.storage(StoreType.DATA).getDirPath();

// 使用标准 Java I/O 自由读写文件
Path dataFile = dataDir.resolve("data.txt");
String content = Files.readString(dataFile);
```

#### 使用加密凭据存储包装器

使用 `StoreType.CREDENTIALS` 类型存储敏感数据时，建议使用 `CredentialStore` 包装器：

```java
CredentialStore credentials = scope.storage(StoreType.CREDENTIALS).map(CredentialStore::of);
```

用法：

```java
credentials.set("api-key", "sk-abc123...");
String token = credentials.get("api-key");
```

### 跨进程锁

`Storage` 提供 `ReadWriteLock` 以实现安全的并发访问：

```java
ReadWriteLock lock = data.getLock();

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

### 日志

每个 scope 都有自己带 scope 标记的 logger：

```java
org.slf4j.Logger logger = scope.logger();
logger.info("Hello from example_mod!");
```

> [!Note]
>
> 通过 `scope.logger()` 获取的 logger 会额外将日志写入独立的日志目录中，其路径可通过 `SystemStorageLib#getLogsDir()` 获取。
