---
title: Credential Store
---

# Credential Store

The `CredentialStore` provides **encrypted persistent key-value storage** for sensitive data such as API tokens, OAuth credentials, and passwords.

## Security Model

### What it Protects Against

- Accidental leakage via **cloud sync** (Dropbox, iCloud, etc.)
- Accidental exposure via **version control** (git)
- Accidental leakage via **screenshots** or **screen sharing**

### What it Does NOT Protect Against

- **Malware** running locally on the system
- **Physical access** to the machine

### Data Loss Tolerance

The credential store may lose data in certain situations:

- User switching
- VM configuration changes
- OS reinstallation
- Other local environment changes

This is intentional — the encryption key is bound to the local machine and user environment.

## Encryption Details

- **Algorithm**: AES-256-GCM (authenticated encryption with associated data)
- **Key derivation**: PBKDF2WithHmacSHA256, 65,536 iterations
- **Key material**: `username:user.home:machine-id`
- **Salt**: `SystemStorageLib-CredentialStore-v1` (static)

Keys are **never stored in plaintext**; only SHA-256 digests are used as filenames.

## File Format

Credential values are stored as individual files with the `.enc` extension. The filename is the SHA-256 hex digest of the key.

### Binary File Layout

| Offset | Size | Field      | Description                      |
| ------ | ---- | ---------- | -------------------------------- |
| `0x00` | 1 B  | Version    | Format version (`0x01`)          |
| `0x01` | 12 B | IV/Nonce   | Random initialization vector     |
| `0x0D` | N B  | Ciphertext | AES-256-GCM encrypted payload    |
| EOF-16 | 16 B | Auth Tag   | GCM authentication tag (128-bit) |

### Minimum File Size

29 bytes (1 + 12 + 16). Files smaller than this are rejected as corrupted.

## File Permissions

On POSIX systems (Linux, macOS), credential files and directories are created with restrictive permissions:

- **Directory**: `rwx------` (owner-only read/write/execute)
- **File**: `rw-------` (owner-only read/write)

On Windows, the library gracefully degrades (no POSIX permissions).

## Atomic Writes

All credential writes use the **write-to-temp-then-rename** pattern, ensuring the target file is never in a partially-written state even if the process crashes mid-write.

## API

### `CredentialStore` Interface

```java
public interface CredentialStore extends StorageManager {
    boolean exists(String key);
    void set(String key, String value) throws IOException;
    String get(String key) throws IOException;
    void remove(String key) throws IOException;
}
```

### Basic Usage

```java
CredentialStore store = scope.storage(StoreType.CREDENTIALS);

// Store a value
store.set("discord-token", "abc123...");

// Check existence
if (store.exists("discord-token")) {
    String token = store.get("discord-token");
    // use the token
}

// Remove
store.remove("discord-token");
```

## Integrity Verification

Each credential file is integrity-verified on read via GCM authentication:

- If a file has been **tampered with**, decryption fails with a `CredentialIntegrityException`
- If the **format version** is unsupported, a `CredentialIntegrityException` is thrown
- The library **never returns corrupted or tampered data**

## Locking

The credential store inherits `StorageManager`'s cross-process locking:

```java
ReadWriteLock lock = store.getLock();

lock.writeLock().lock();
try {
    store.set("key", "value");
} finally {
    lock.writeLock().unlock();
}
```

All `set` operations automatically acquire the write lock internally.

## Limitations

- **No key listing**: Keys are stored as SHA-256 hashes, so you cannot enumerate stored keys. You must track your own keys.
- **No TTL/expiry**: Credentials do not auto-expire. Implement your own expiry logic if needed.
- **Environment-bound**: Credentials cannot be read after user profile changes or OS reinstall.
