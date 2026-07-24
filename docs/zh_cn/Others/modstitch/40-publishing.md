---
title: 发布
---

# 发布

Modstitch 提供内置的发布支持，集成了 Maven Publish 和 Mod Publish Plugin。

## 添加发布插件

```kotlin
plugins {
    id("dev.isxander.modstitch.base") version "0.8.5"
    id("dev.isxander.modstitch.publishing") version "0.8.5"
}
```

## PublishingExtension

发布配置扩展：

```kotlin
modstitch {
    publishing {
        mavenGroup = "com.example"      // Maven Group（默认从 metadata 获取）
        mavenArtifact = "my_mod"        // Maven Artifact（默认从 metadata 获取）

        // Mod Publish Plugin 配置
        mpp {
            // 配置 Modrinth/CurseForge 发布
        }

        // Maven Publish 配置
        maven {
            // 配置 Maven 仓库
        }
    }
}
```

### 属性

| 属性                  | 类型                       | 说明                    |
| --------------------- | -------------------------- | ----------------------- |
| `mavenGroup`          | `String`                   | Maven Group ID          |
| `mavenArtifact`       | `String`                   | Maven Artifact ID       |
| `additionalArtifacts` | `List<Any>`                | 额外的发布产物          |
| `mpp`                 | `ModPublishExtension`      | Mod Publish Plugin 扩展 |
| `maven`               | `MavenPublishingExtension` | Maven Publish 扩展      |

## Maven 发布

```kotlin
modstitch {
    publishing {
        maven {
            repositories {
                maven {
                    name = "Releases"
                    url = uri("https://maven.example.com/releases")
                    credentials {
                        username = findProperty("maven.user") as String?
                        password = findProperty("maven.pass") as String?
                    }
                }
            }
        }
    }
}
```

## Modrinth / CurseForge 发布

Modstitch 集成了 [Mod Publish Plugin](https://github.com/modmuss50/mod-publish-plugin)，支持发布到 Modrinth 和 CurseForge：

```kotlin
modstitch {
    publishing {
        mpp {
            modrinth {
                token = System.getenv("MODRINTH_TOKEN")
                projectId = "your-project-id"
                versionNumber = modstitch.metadata.modVersion
                gameVersions.addAll("1.21.8")
                loaders.addAll("fabric", "neoforge")
            }

            curseforge {
                token = System.getenv("CURSEFORGE_TOKEN")
                projectId = "your-project-id"
                versionNumber = modstitch.metadata.modVersion
                gameVersion = "1.21.8"
                loaders.addAll("fabric", "neoforge")
            }
        }
    }
}
```

## 发布任务

应用发布插件后，会自动注册以下任务：

| 任务                                  | 说明                          |
| ------------------------------------- | ----------------------------- |
| `publishMod`                          | 发布到 Modrinth/CurseForge    |
| `publishMavenPublicationToMavenLocal` | 发布到本地 Maven 仓库         |
| `publishAllPublicationsToMavenLocal`  | 发布所有产物到本地 Maven 仓库 |

## 平台自动检测

发布插件会根据当前平台自动设置 mod loader：

- Loom 平台：`fabric`
- ModDevGradle 平台：`neoforge` 或 `forge`

```kotlin
// 发布配置会自动包含正确的 mod loader
modstitch {
    publishing {
        mpp {
            modrinth {
                // loaders 会自动设置为当前平台对应的 loader
            }
        }
    }
}
```
