---
title: 快速开始
---

# 快速开始

## 引入依赖

`gradle.properties`:

```properties
system_storage_lib_version=0.1.0-beta.1
```

::: code-group

```kotlin [build.gradle.kts]
repositories {
    maven("https://jitpack.io")
}

dependencies {
    modImplementation("com.github.Leawind:SystemStorageLib:<version>")
}
```

```groovy [build.gradle]
repositories {
    maven { url 'https://jitpack.io' }
}

dependencies {
    modImplementation "com.github.Leawind:SystemStorageLib:<version>"
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

在本地测试环境中，为了避免影响系统中的数据，可以使用 `.builder()` 创建自定义实例。

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

## 选择存储类型

| `StoreType` 枚举值 | 存储类型 | 描述                                                   |
| ------------------ | -------- | ------------------------------------------------------ |
| `CACHE`            | 缓存     | 可再生数据，例如缩略图                                 |
| `CONFIG`           | 配置     | 配置文件，如用户偏好                                   |
| `SECRETS`          | 秘密     | 需要加密的敏感数据，如令牌、密钥等                     |
| `DATA`             | 数据     | 可跨机器共享的持久化数据                               |
| `DATA_LOCAL`       | 本地数据 | 特定于当前机器的持久化数据，或重新生成代价高的缓存数据 |

通过 `Scope#directory(StoreType)` 方法获取对应类型的目录路径：

```java
Path dataDir = scope.directory(StoreType.DATA);
```

### 直接操作文件系统

```java
Path dataDir = scope.directory(StoreType.DATA);

// 使用标准 Java I/O 自由读写文件
Path dataFile = dataDir.resolve("data.txt");
Files.createDirectories(dataDir);
String content = Files.readString(dataFile);
```

### 使用访问器包装

对于需要额外功能的存储类型，可以使用 `Scope#access()` 工厂方法创建访问器：

```java
// 创建加密凭据存储访问器
SecretsAccessor secrets = scope.access(StoreType.SECRETS, SecretsAccessor::from);
```

`access()` 方法接收 `BiFunction<Path, Logger, T>`，其中 `T extends DirectoryAccessor`。
内置的访问器基类 `AbstractDirectoryAccessor` 提供了路径管理、日志、变更通知和锁创建等通用功能。

## 加密凭据存储

使用 `StoreType.SECRETS` 类型存储敏感数据时，建议使用 `SecretsAccessor`：

```java
SecretsAccessor secrets = scope.access(StoreType.SECRETS, SecretsAccessor::from);
```

用法：

```java
secrets.set("api-key", "sk-abc123...");
String token = secrets.get("api-key");    // 若不存在返回 null
boolean exists = secrets.exists("api-key");
secrets.remove("api-key");
```

详情请参阅[密钥存储文档](./secrets)。

## 跨进程锁

`AbstractDirectoryAccessor` 提供静态工厂方法 `createLock(Path)` 创建基于文件的跨进程可重入读写锁：

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

### 日志轮转

通过 `MetaConfigAccessor` 可以配置日志轮转行为，配置文件为 JSON 格式，支持跨进程热重载：

```json
{
  "max_log_file_size": 1048576,
  "max_log_archive_files": 16
}
```

- `max_log_file_size`：单个日志文件大小上限（字节），默认为 1MB
- `max_log_archive_files`：轮转存档文件数量上限，默认为 16

## 元配置管理

`MetaConfigAccessor` 管理库的全局配置，支持跨进程热重载：

```java
MetaConfigAccessor metaConfig = SystemStorageLib.getInstance().metaConfig();

// 读取当前配置
MetaConfig config = metaConfig.get();

// 更新配置（写入磁盘，跨进程安全）
metaConfig.update(cfg -> {
    cfg.setMaxLogFileSize(2 * 1024 * 1024);
    cfg.setMaxLogArchiveFiles(32);
});
```

当配置文件被外部进程修改时，`onChanged` 事件会自动触发：

```java
metaConfig.onChanged().on(event -> {
    MetaConfig newConfig = event.config();
    // 响应配置变更
});
```
