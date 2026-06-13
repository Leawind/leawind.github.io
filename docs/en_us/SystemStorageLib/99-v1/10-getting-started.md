---
title: Quick Start
---

# Quick Start

## Adding Dependency

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
    "system-storage-lib": ">=${system-storage-lib_version}"
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

## Obtaining Library Instance

The library is a singleton, accessible via `SystemStorageLib.getInstance()`.

In a local test environment, to avoid affecting data in the system, you can create a custom instance using `.builder()`.

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
> The Builder requires all five `StoreType` paths to be provided, and each path must be unique, otherwise an `IllegalArgumentException` will be thrown.

## Creating a Scope

A Scope is an isolated storage namespace. It is recommended that each mod uses its own unique scope name:

```java
Scope scope = SystemStorageLib.getInstance().scope("example_mod");
```

Scope naming rules:

- Length between 2 and 128 characters
- Cannot start or end with `-`, `+`, or `.`
- Allowed characters: digits, ASCII letters, `_`, `-`, `+`, `.`

> [!Note]
>
> Recommended naming convention:
>
> ```
> <mod_id>[.<scope_name>]
> ```
>
> Examples:
>
> - `example_mod`
> - `example_mod.alpha`

## Selecting Storage Type

| `StoreType` Enum Value | Storage Type | Description                                                                                    |
| ---------------------- | ------------ | ---------------------------------------------------------------------------------------------- |
| `CACHE`                | Cache        | Regenerable data, such as thumbnails                                                           |
| `CONFIG`               | Config       | Configuration files, such as user preferences                                                  |
| `SECRETS`              | Secrets      | Sensitive data requiring encryption, such as tokens, keys                                      |
| `DATA`                 | Data         | Persistent data that can be shared across machines                                             |
| `DATA_LOCAL`           | Local Data   | Persistent data specific to the current machine, or cache data that is expensive to regenerate |

Use the `Scope#directory(StoreType)` method to obtain the directory path for the corresponding type:

```java
Path dataDir = scope.directory(StoreType.DATA);
```

### Direct File System Operations

```java
Path dataDir = scope.directory(StoreType.DATA);

// Use standard Java I/O to read and write files freely
Path dataFile = dataDir.resolve("data.txt");
Files.createDirectories(dataDir);
String content = Files.readString(dataFile);
```

### Using Accessor Wrappers

For storage types that require additional functionality, use the `Scope#access()` factory method to create an accessor:

```java
// Create an encrypted credential storage accessor
SecretsAccessor secrets = scope.access(StoreType.SECRETS, SecretsAccessor::from);
```

The `access()` method accepts a `BiFunction<Path, Logger, T>` where `T extends DirectoryAccessor`.
The built-in base class `AbstractDirectoryAccessor` provides common functionality such as path management, logging, change notification, and lock creation.

## Encrypted Credential Storage

When storing sensitive data using the `StoreType.SECRETS` type, it is recommended to use `SecretsAccessor`:

```java
SecretsAccessor secrets = scope.access(StoreType.SECRETS, SecretsAccessor::from);
```

Usage:

```java
secrets.set("api-key", "sk-abc123...");
String token = secrets.get("api-key");    // Returns null if not present
boolean exists = secrets.exists("api-key");
secrets.remove("api-key");
```

For details, see the [Secrets documentation](./secrets).

## Cross-Process Locks

`AbstractDirectoryAccessor` provides a static factory method `createLock(Path)` to create file-based, cross-process, reentrant read-write locks:

```java
import io.github.leawind.systemstoragelib.v1.api.accessors.AbstractDirectoryAccessor;

Path lockFile = scope.directory(StoreType.DATA).resolve(".lock");
var lock = AbstractDirectoryAccessor.createLock(lockFile);

lock.readLock().lock();
try {
    // Read operation
} finally {
    lock.readLock().unlock();
}

lock.writeLock().lock();
try {
    // Write operation
} finally {
    lock.writeLock().unlock();
}
```

Lock characteristics:

- **Multiple readers, single writer**: Multiple processes can hold the read lock simultaneously; the write lock is exclusive
- **Reentrant**: The same thread can lock multiple times, requiring the same number of unlocks
- **Lock downgrading**: A thread holding the write lock can acquire the read lock (downgrading supported), but read locks cannot be upgraded to write locks
- `lock()` blocks until available, `tryLock()` returns `false` immediately

## Logging

Each scope has its own logger tagged with the scope name:

```java
org.slf4j.Logger logger = scope.logger();
logger.info("Hello from example_mod!");
```

> [!Note]
>
> The logger obtained via `scope.logger()` additionally writes logs to a separate log directory, whose path can be obtained via `SystemStorageLib#getLogsDir()`.

### Log Rotation

Log rotation behavior can be configured via `MetaConfigAccessor`. The configuration file is in JSON format and supports cross-process hot reload:

```json
{
  "max_log_file_size": 1048576,
  "max_log_archive_files": 16
}
```

- `max_log_file_size`: Maximum size of a single log file in bytes, defaults to 1MB
- `max_log_archive_files`: Maximum number of rotation archive files, defaults to 16

## Meta Configuration Management

`MetaConfigAccessor` manages the library's global configuration and supports cross-process hot reload:

```java
MetaConfigAccessor metaConfig = SystemStorageLib.getInstance().metaConfig();

// Read current configuration
MetaConfig config = metaConfig.get();

// Update configuration (writes to disk, cross-process safe)
metaConfig.update(cfg -> {
    cfg.setMaxLogFileSize(2 * 1024 * 1024);
    cfg.setMaxLogArchiveFiles(32);
});
```

When the configuration file is modified by an external process, the `onChanged` event is automatically triggered:

```java
metaConfig.onChanged().on(event -> {
    MetaConfig newConfig = event.config();
    // Respond to configuration changes
});
```
