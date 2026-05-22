---
title: Getting Started
---

# Getting Started

## Dependency

SystemStorageLib is available via [JitPack](https://jitpack.io/#Leawind/SystemStorageLib).

### Gradle

```kotlin
repositories {
    maven("https://jitpack.io")
}

dependencies {
    // Check the latest version on JitPack
    modImplementation("com.github.Leawind:SystemStorageLib:<version>")
}
```

## Basic Usage

### 1. Get the Library Instance

The library is a singleton accessed via `SystemStorageLib.getInstance()`:

```java
import io.github.leawind.systemstoragelib.v1.api.SystemStorageLib;

SystemStorageLib lib = SystemStorageLib.getInstance();
```

### 2. Create a Scope

A scope is an isolated storage namespace. Each mod should use its own unique scope name:

```java
import io.github.leawind.systemstoragelib.v1.api.ScopeStorage;

ScopeStorage myMod = lib.scope("my-mod");
```

**Scope naming rules:**

- Length between 2 and 63 characters
- Must not start or end with `-`, `+`, or `.`
- Allowed characters: digits, ASCII letters, `_`, `-`, `+`, `.`

You can validate a scope name before using it:

```java
String error = lib.validateScope("invalid scope!");
if (error != null) {
    // handle invalid scope
}
```

### 3. Access Store Types

Each scope gives you access to five store types:

```java
import io.github.leawind.systemstoragelib.v1.api.StoreType;
import io.github.leawind.systemstoragelib.v1.api.managers.StorageManager;
import io.github.leawind.systemstoragelib.v1.api.managers.CredentialStore;

// General-purpose storage managers
StorageManager config = myMod.storage(StoreType.CONFIG);
StorageManager data = myMod.storage(StoreType.DATA);
StorageManager cache = myMod.storage(StoreType.CACHE);
StorageManager dataLocal = myMod.storage(StoreType.DATA_LOCAL);

// Encrypted credential store
CredentialStore credentials = myMod.storage(StoreType.CREDENTIALS);
```

### 4. Read and Write Data

#### Credential Store (encrypted)

```java
// Store a token
credentials.set("api-key", "sk-abc123...");

// Retrieve it
String token = credentials.get("api-key");

// Check existence
if (credentials.exists("api-key")) {
    // ...
}

// Remove
credentials.remove("api-key");
```

#### General Storage (plain)

For `CONFIG`, `DATA`, `CACHE`, and `DATA_LOCAL`, you work directly with the filesystem:

```java
// Get the directory path
Path configDir = config.getDirPath();

// Read/write files using standard Java I/O
Path settingsFile = configDir.resolve("settings.json");
String content = Files.readString(settingsFile);
```

### 5. Cross-Process Locking

All store managers provide a `ReadWriteLock` for safe concurrent access:

```java
ReadWriteLock lock = config.getLock();

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

### 6. Meta Configuration

Override default storage paths per scope:

```java
import io.github.leawind.systemstoragelib.v1.api.managers.MetaConfigManager;
import io.github.leawind.systemstoragelib.v1.api.metaconfig.MetaConfig;
import io.github.leawind.systemstoragelib.v1.api.metaconfig.PerScopeConfig;

MetaConfigManager meta = lib.metaConfig();

// Read current config
MetaConfig config = meta.get();

// Set custom directory for a scope
PerScopeConfig perScope = config.getOrCreateScopeConfig("my-mod");
perScope.customDirs().put(StoreType.CONFIG, Path.of("/custom/config/path"));
meta.set(config);
```

### 7. Logging

Each scope gets its own scoped logger:

```java
org.slf4j.Logger logger = myMod.logger();
logger.info("Hello from my-mod!");
```

The library also provides a global logger and a logs directory:

```java
// Global library logger
org.slf4j.Logger libLogger = lib.logger();

// Logs directory
Path logsDir = lib.getLogsDir();
```
