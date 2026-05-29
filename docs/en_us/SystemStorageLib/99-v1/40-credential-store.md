---
title: Credential Store
---

# Credential Store

`CredentialStore` is a `Storage` wrapper that provides an encrypted, persistent key-value store for sensitive data such as API tokens, OAuth credentials, and passwords.

## Security Model

### What is Protected Against

- Accidental exposure through cloud sync (Dropbox, iCloud, etc.)
- Accidental exposure through version control (git)
- Accidental exposure through screenshots or screen sharing

### What is NOT Protected Against

- **Malware** running locally on the system
- **Physical access** to the machine

### Data Loss Tolerance

Credential storage may lose data in certain scenarios:

- User switching
- Virtual machine configuration changes
- Operating system reinstallation
- Other local environment changes

This is intentional — the encryption key is bound to the local machine and user environment.

## Encryption Details

- **Algorithm**: AES-256-GCM (authenticated encryption with associated data)
- **Key Derivation**: PBKDF2WithHmacSHA256, 65,536 iterations
- **密钥材料**：`user.name:user.home:machineId`
- **Salt**: `SystemStorageLib-CredentialStore-v1` (static)

Keys are stored as hashes, not plaintext.

### Basic Usage

```java
CredentialStore credentials = scope.storage(StoreType.CREDENTIALS).map(CredentialStore::of);

credentials.set("discord-token", "abc123...");

boolean exists = credentials.exists("discord-token"); // true
String token = credentials.get("discord-token");      // "abc123..."
credentials.remove("discord-token");
```

## Integrity Verification

Each credential file is integrity-verified during reading via GCM authentication:

- If a file is tampered with, decryption will fail and throw a `CredentialIntegrityException`
- If the format version is unsupported, a `CredentialIntegrityException` is thrown
- The library will not return corrupted or tampered data

## Limitations

- **No Key Listing**: Keys are stored as hashes, so stored keys cannot be enumerated.
- **No TTL/Expiration**: Credentials do not expire automatically.
- **Environment Binding**: After user profile changes or OS reinstallation, credentials will be unreadable.
