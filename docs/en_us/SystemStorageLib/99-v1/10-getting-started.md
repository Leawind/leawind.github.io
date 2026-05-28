---
title: Getting Started
---

# Getting Started

### Adding Dependencies

`gradle.properties`:

```properties
system_storage_lib_version=0.1.0
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
    "system_storage_lib": ">=${system_storage_lib_version}"
  }
}
```

```toml [(neoforge.)mods.toml]
[[dependencies.example_mod]]
modId="system_storage_lib"
mandatory=true
versionRange="[${system_storage_lib_version},)"
ordering="NONE"
side="SERVER" # CLIENT / SERVER / BOTH
```

:::

````
:::

## Basic Usage

### Getting the Library Instance

The library is a singleton, accessed via `SystemStorageLib.getInstance()`.

In local testing environments, to avoid affecting data in the system, you can create a custom instance using `.builder()`:

```java
SystemStorageLib lib = SystemStorageLib.builder()
    .logsDir(Path.of("./logs"))
    .metaConfigDir(Path.of("./config"))
    .storeDir(StoreType.CACHE, Path.of("./cache"))
    .storeDir(StoreType.DATA, Path.of("./data"))
    .maxLogFileSize(1024 * 1024) // 1MB
    .maxLogArchiveFiles(3)
    .build();
````

### Creating a Scope

A Scope is an isolated storage namespace. It's generally recommended that each mod use its own unique scope name:

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

You can validate scope names using the `validateScopeName` method:

```java
String error = SystemStorageLib.getInstance().validateScopeName("invalid scope!");
if (error != null) {
    // Handle invalid scope name
}
```

### Selecting Storage Type

| `StoreType` Enum Value | Storage Type | Description                                                             |
| ---------------------- | ------------ | ----------------------------------------------------------------------- |
| `CACHE`                | Cache        | Regenerable data, such as thumbnails                                    |
| `CONFIG`               | Config       | Configuration files, such as user preferences                           |
| `CREDENTIALS`          | Credentials  | Sensitive data requiring encryption, such as tokens, keys, etc.         |
| `DATA`                 | Data         | Persistent data that can be shared across machines                      |
| `DATA_LOCAL`           | Local Data   | Machine-specific persistent data, or expensive-to-regenerate cache data |

Obtain a `Storage` instance via the `Scope#storage(StoreType)` method:

```java
Storage data = scope.storage(StoreType.DATA);
```

#### Getting the Directory and Manipulating the File System Directly

```java
Path dataDir = scope.storage(StoreType.DATA).getDirPath();

// Freely read and write files using standard Java I/O
Path dataFile = dataDir.resolve("data.txt");
String content = Files.readString(dataFile);
```

#### Using the Encrypted Credential Store Wrapper

When storing sensitive data with `StoreType.CREDENTIALS`, it's recommended to use the `CredentialStore` wrapper:

```java
CredentialStore credentials = scope.storage(StoreType.CREDENTIALS).map(CredentialStore::of);
```

Usage:

```java
credentials.set("discord-token", "abc123...");
String token = credentials.get("discord-token"); // "abc123..."
credentials.remove("discord-token");
```

### Cross-process Locking

`Storage` provides a `ReadWriteLock` to achieve safe concurrent access:

```java
ReadWriteLock lock = data.getLock();

lock.readLock().lock();
try {
    // Read operations
} finally {
    lock.readLock().unlock();
}

lock.writeLock().lock();
try {
    // Write operations
} finally {
    lock.writeLock().unlock();
}
```

### Logging

Each scope has its own logger marked with the scope tag:

```java
org.slf4j.Logger logger = scope.logger();
logger.info("Hello from example_mod!");
```

> [!Note]
>
> The logger obtained via `scope.logger()` will additionally write logs to a separate log directory, whose path can be obtained via `SystemStorageLib#getLogsDir()`.
