---
title: 指南
---

# 指南

## 引入依赖

`gradle.properties`:

```properties
system_storage_lib_version=0.1.0-beta.3
```

::: code-group

```kotlin [build.gradle.kts]
repositories {
    maven("https://jitpack.io")
}

dependencies {
    modImplementation("com.github.Leawind:SystemStorageLib:${system_storage_lib_version}")
}
```

```groovy [build.gradle]
repositories {
    maven { url 'https://jitpack.io' }
}

dependencies {
    modImplementation "com.github.Leawind:SystemStorageLib:${system_storage_lib_version}"
}
```

:::

::: code-group

```json [fabric.mod.json]
{
  "depends": {
    "system-storage-lib": ">=${system_storage_lib_version}"
  }
}
```

```toml [(neoforge.)mods.toml]
[[dependencies.example_mod]]
modId="system-storage-lib"
mandatory=true
versionRange="[${system_storage_lib_version},)"
ordering="NONE"
side="SERVER" # CLIENT / SERVER / BOTH
```

:::

## 获取库实例

该库是单例，通过 `SystemStorageLib.getInstance()` 访问。

在本地测试环境中，为了避免影响系统中的数据，可以使用 `.builder()` 创建自定义 `SystemStorageLib` 实例：

```java
SystemStorageLib lib = SystemStorageLib.builder(Path.of("./config/metaconfig"))
    .logsDir(Path.of("./logs"))
    .storeDir(StoreType.CACHE, Path.of("./cache"))
    .storeDir(StoreType.CONFIG, Path.of("./config"))
    .storeDir(StoreType.SECRETS, Path.of("./secrets"))
    .storeDir(StoreType.DATA, Path.of("./data"))
    .storeDir(StoreType.DATA_LOCAL, Path.of("./data_local"))
    .build();
```

> [!Note]
>
> Builder 要求传入所有五种 `StoreType` 路径，且各路径不能重复，否则抛出 `IllegalArgumentException`。

## 创建 Scope

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
> 推荐的命名规范：`<mod_id>[.<scope_name>]`
>
> 例如：`example_mod`、`example_mod.alpha`

## 读写文件

通过 `Scope#directory(StoreType)` 获取目录路径，然后使用标准 Java I/O 操作：

```java
Path dataDir = scope.directory(StoreType.DATA);

Path dataFile = dataDir.resolve("data.txt");
Files.createDirectories(dataDir);
String content = Files.readString(dataFile);
```

## 加密凭据存储

对于敏感数据，使用 `SecretsAccessor`：

```java
SecretsAccessor secrets = scope.access(StoreType.SECRETS, SecretsAccessor::from);

secrets.set("api-key", "sk-abc123...");
String token = secrets.get("api-key");    // 若不存在返回 null
boolean exists = secrets.exists("api-key");
secrets.remove("api-key");
```

## 跨进程锁

`AbstractDirectoryAccessor` 提供基于文件的跨进程可重入读写锁：

```java
import io.github.leawind.systemstoragelib.v1.api.accessors.AbstractDirectoryAccessor;

Path lockFile = scope.directory(StoreType.DATA).resolve(".lock");
var lock = AbstractDirectoryAccessor.createLock(lockFile);

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

锁的特性：

- **多读互斥写**：多个进程可同时持有读锁，写锁独占
- **可重入**：同一线程可多次加锁，需对应次数解锁
- **锁降级**：持有写锁的线程可以获取读锁（支持降级），但读锁不能升级为写锁
- `lock()` 阻塞直至可用，`tryLock()` 立即返回 `false`

## 日志

每个 scope 都有自己带 scope 标记的 logger：

```java
org.slf4j.Logger logger = scope.logger();
logger.info("Hello from example_mod!");
```

> [!Note]
>
> 通过 `scope.logger()` 获取的 logger 会额外将日志写入独立的日志目录中，其路径可通过 `SystemStorageLib#getLogsDir()` 获取。
