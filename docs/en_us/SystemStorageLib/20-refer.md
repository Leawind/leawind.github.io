---
title: Reference
---

# Reference

## Storage Types

| `StoreType` Enum Value | Storage Type | Description                                                                                    |
| ---------------------- | ------------ | ---------------------------------------------------------------------------------------------- |
| `CACHE`                | Cache        | Regenerable data, such as thumbnails                                                           |
| `CONFIG`               | Config       | Configuration files, such as user preferences                                                  |
| `SECRETS`              | Secrets      | Sensitive data requiring encryption, such as tokens, keys                                      |
| `DATA`                 | Data         | Persistent data that can be shared across machines                                             |
| `DATA_LOCAL`           | Local Data   | Persistent data specific to the current machine, or cache data that is expensive to regenerate |

## Storage Locations

| Storage Type | Default Path                                           |
| :----------- | :----------------------------------------------------- |
| `CACHE`      | `{cacheDir}/mc_system_storage/cache/{scope}/`          |
| `CONFIG`     | `{configDir}/mc_system_storage/config/{scope}/`        |
| `SECRETS`    | `{dataLocalDir}/mc_system_storage/secrets/{scope}/`    |
| `DATA`       | `{dataDir}/mc_system_storage/data/{scope}/`            |
| `DATA_LOCAL` | `{dataLocalDir}/mc_system_storage/data_local/{scope}/` |

::: code-group

```txt [Windows]
{cacheDir}      {FOLDERID_LocalAppData}
{configDir}     {FOLDERID_RoamingAppData}
{dataDir}       {FOLDERID_RoamingAppData}
{dataLocalDir}  {FOLDERID_LocalAppData}
```

```txt [Linux]
{cacheDir}      $XDG_CACHE_HOME or ~/.cache
{configDir}     $XDG_CONFIG_HOME or ~/.config
{dataDir}       $XDG_DATA_HOME or ~/.local/share
{dataLocalDir}  $XDG_DATA_HOME or ~/.local/share
```

```txt [macOS]
{cacheDir}      ~/Library/Caches
{configDir}     ~/Library/Application Support
{dataDir}       ~/Library/Application Support
{dataLocalDir}  ~/Library/Application Support
```

:::

## Global Paths

| Purpose                    | Default Path                                |
| :------------------------- | :------------------------------------------ |
| Meta-config (`metaConfig`) | `{configDir}/mc_system_storage/metaconfig/` |
| Logs (`logs`)              | `{dataLocalDir}/mc_system_storage/logs/`    |

## Accessor Pattern

The `Scope#access()` factory method creates directory-based accessors that uniformly manage paths, logging, locks, and change notifications:

```java
SecretsAccessor secrets = scope.access(StoreType.SECRETS, SecretsAccessor::from);
```

`access()` accepts a `BiFunction<Path, Logger, T>` where `T extends DirectoryAccessor`.
The built-in base class `AbstractDirectoryAccessor` provides common functionality such as path management, logging, change notification, and lock creation.

## Meta Configuration Management

`MetaConfigAccessor` manages the library's global configuration and supports cross-process hot reload:

```java
MetaConfigAccessor metaConfig = SystemStorageLib.getInstance().metaConfig();

MetaConfig config = metaConfig.get();

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

## Log Rotation Configuration

Configured via `MetaConfigAccessor`, in JSON format, supports cross-process hot reload:

```json
{
  "max_log_file_size": 1048576,
  "max_log_archive_files": 16
}
```

- `max_log_file_size`: Maximum size of a single log file in bytes, defaults to 1MB
- `max_log_archive_files`: Maximum number of rotation archive files, defaults to 16

## Secret Storage Details

### Security Model

**Protects Against**: Accidental leakage via cloud synchronization (Dropbox, iCloud, etc.), accidental exposure via version control (git), accidental leakage via screenshots or screen sharing.

**Does Not Protect Against**: Malware running locally on the system, physical access to the machine.

**Data Loss Tolerance**: Secret storage may lose data in situations such as user switching, virtual machine configuration changes, or operating system reinstallation. This is intentional — encryption keys are bound to the local machine and user environment.

### Encryption Details

- **Algorithm**: AES-256-GCM (authenticated encryption with associated data)
- **Key Derivation**: PBKDF2WithHmacSHA256, 65,536 iterations
- **Key Material**: `user.name:user.home:machineId`
- **Salt**: `SystemStorageLib-MetaConfigAccessor-v1` (static)
- Key names are stored as SHA-256 digests, not in plaintext.

### File Permissions Control

| Platform | Mechanism                    | Permission                           |
| -------- | ---------------------------- | ------------------------------------ |
| POSIX    | `PosixFilePermission`        | Directory `rwx------`, File `rw----` |
| Windows  | `AclFileAttributeView` (ACL) | Read/write for owner only            |

> [!Note]
>
> Permissions are applied automatically when files/directories are created. If the file system does not support POSIX permissions (e.g., FAT32), an ACL scheme is automatically attempted.

### Atomic Writes

The `set()` operation uses a "write to temporary file → fsync → atomic rename" pattern, ensuring the target file is never left in a partially written, corrupted state.

### Integrity Verification

Each secret file is stored in a binary format (version + IV + ciphertext + GCM authentication tag). During reads, integrity is verified via GCM authentication. If the file has been tampered with or the format is unsupported, a `SecretIntegrityException` is thrown.

### Limitations

- **No listing of entries**: Key names are stored as hashes, so stored key names cannot be enumerated.
- **No TTL / expiration**: Secrets do not expire automatically.
- **Environment-bound**: Secrets cannot be read after user profile changes or OS reinstallation.
