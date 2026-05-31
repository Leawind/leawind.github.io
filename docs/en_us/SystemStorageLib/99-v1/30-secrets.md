---
title: Secret Storage
---

# Secret Storage

`SecretsAccessor` provides an encrypted persistent key-value store for sensitive data such as API tokens, OAuth credentials, and passwords.

## Security Model

### Protects Against

- Accidental leakage via **cloud synchronization** (Dropbox, iCloud, etc.)
- Accidental exposure via **version control** (git)
- Accidental leakage via **screenshots** or **screen sharing**

### Does Not Protect Against

- **Malware** running locally on the system
- **Physical access** to the machine

### Data Loss Tolerance

The secret storage may lose data in certain situations:

- User switching
- Virtual machine configuration changes
- Operating system reinstallation
- Other local environment changes

This is intentional — encryption keys are bound to the local machine and user environment.

## Encryption Details

- **Algorithm**: AES-256-GCM (authenticated encryption with associated data)
- **Key Derivation**: PBKDF2WithHmacSHA256, 65,536 iterations
- **Key Material**: `user.name:user.home:machineId`
- **Salt**: `SystemStorageLib-MetaConfigAccessor-v1` (static)

Key names are stored as SHA-256 digests, not in plaintext.

### Basic Usage

```java
var secrets = scope.access(StoreType.SECRETS, SecretsAccessor::from);

secrets.set("discord-token", "abc123...");

boolean exists = secrets.exists("discord-token"); // true
String token = secrets.get("discord-token");      // "abc123..."
secrets.remove("discord-token");
```

## File Permissions Control

Secret storage directories and files are automatically set to be accessible only by the current user upon creation, preventing access by other users on the same system:

| Platform | Mechanism                    | Permission                           |
| -------- | ---------------------------- | ------------------------------------ |
| POSIX    | `PosixFilePermission`        | Directory `rwx------`, File `rw----` |
| Windows  | `AclFileAttributeView` (ACL) | Read/write for owner only            |

> [!Note]
>
> Permissions are applied automatically when files/directories are created. If the file system does not support POSIX permissions (e.g., FAT32), an ACL scheme is automatically attempted.

## Atomic Writes

The `set()` operation uses a "write to temporary file → fsync → atomic rename" pattern:

- Process crashes during write → target file remains unchanged
- Process crashes after write but before rename → leftover temporary file, target file unaffected
- Ensures the target file is never left in a partially written, corrupted state

## Integrity Verification

Each secret file is stored using the following binary format:

| Offset | Size | Field                  |
| ------ | ---- | ---------------------- |
| `0x00` | 1B   | Version (`0x01`)       |
| `0x01` | 12B  | IV / Nonce             |
| `0x0D` | N B  | Ciphertext             |
| End-16 | 16B  | GCM Authentication Tag |

Integrity is verified via GCM authentication during reads:

- If the file has been tampered with, decryption fails with `SecretIntegrityException`
- If the format version is unsupported, throws `SecretIntegrityException`
- If the file is too short (less than 29 bytes), throws `SecretIntegrityException`
- The library never returns corrupted or tampered data

## Machine ID Resolution

`SecretsAccessor` uses a machine identifier as part of the key material, ensuring encrypted data is bound to a specific machine:

| Platform | Source                                                      |
| -------- | ----------------------------------------------------------- |
| Linux    | `/etc/machine-id` or `/var/lib/dbus/machine-id`             |
| Windows  | Registry `HKLM\SOFTWARE\Microsoft\Cryptography\MachineGuid` |
| macOS    | `ioreg IOPlatformUUID`                                      |

The machine ID is lazily resolved and cached upon first access. If resolution fails, key derivation falls back to using only `user.name:user.home`.

## Limitations

- **No listing of entries**: Key names are stored as hashes, so stored key names cannot be enumerated.
- **No TTL / expiration**: Secrets do not expire automatically.
- **Environment-bound**: Secrets cannot be read after user profile changes or OS reinstallation.
