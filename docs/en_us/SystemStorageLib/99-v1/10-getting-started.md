---
title: Getting Started
---

# Getting Started

## Dependencies

System Storage Lib is published through [JitPack](https://jitpack.io/#Leawind/SystemStorageLib).

### Gradle

```kotlin
repositories {
    maven("https://jitpack.io")
}

dependencies {
    // Check JitPack for the latest version
    modImplementation("com.github.Leawind:SystemStorageLib:<version>")
}
```

## Basic Usage

### Getting the Library Instance

The library is a singleton, accessed via `SystemStorageLib.getInstance()`.

In local testing environments, to avoid affecting data in the system, you can create a custom instance using the builder pattern:

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

Each scope has access to five storage types:

| Storage Type    | Purpose                                                      | Customizable | Typical Content              |
| --------------- | ------------------------------------------------------------ | :----------: | ---------------------------- |
| `CACHE`         | Regenerable cache data                                       |      ✅      | Thumbnails                   |
| `CONFIG`        | Configuration files                                          |      ✅      |                              |
| `CREDENTIALS`   | Sensitive data requiring encryption                          |      ❌      | API tokens, OAuth keys       |
| `DATA`          | Persistent data that can be shared across machines           |      ✅      | Downloaded works from others |
| `DATA_LOCAL`    | Machine-specific persistent data, or expensive-to-regenerate cache data |      ✅      | Session data, temporary state|

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
credentials.set("api-key", "sk-abc123...");
String token = credentials.get("api-key");
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
