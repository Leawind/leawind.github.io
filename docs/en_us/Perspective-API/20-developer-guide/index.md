---
title: Developer Guide
---

# Developer Guide

> [!WARNING]
> Before the release of the stable version, the API is subject to breaking changes at any time.

## Adding the Dependency

> [!INFO]
>
> You can find all versions on the [Modrinth Versions] or [GitHub Releases] page.
>
> This badge should display the latest version: <img src="https://img.shields.io/github/v/tag/Leawind/Perspective-API?label=API&color=818181" style="display:inline">

### Via Modrinth Maven

Format: `maven.modrinth:LIqveQm1:<API version>+<loader>-<Minecraft version>`. Choose the artifact that exactly matches your loader and Minecraft version from the versions page.

```kotlin
repositories {
  exclusiveContent {
    forRepository {
      maven {
        name = "Modrinth"
        url = uri("https://api.modrinth.com/maven")
      }
    }
    filter {
      includeGroup("maven.modrinth")
    }
  }
}

dependencies {
  // Use `implementation` for Minecraft 26.1 and later.
  modImplementation("maven.modrinth:LIqveQm1:1.0.0-beta.9+fabric-26.2")
}
```

### Adding `com.google.auto.service` (Optional)

```kotlin
dependencies {
  compileOnly("com.google.auto.service:auto-service-annotations:1.1.1")
  annotationProcessor("com.google.auto.service:auto-service:1.1.1")
}
```

This automatically generates Java SPI service files for `PerspectiveBehavior`, avoiding manual maintenance of `META-INF/services`.

## Getting Started

- [Custom Perspective](./perspective): define a complete camera mode
- [Projection Modes](./convention/projection): use perspective or orthographic projection
- [Perspective Modifier](./modifier): layer camera effects on any perspective
- [Override Chain](./override-chain): force a perspective temporarily based on game state
- [Migration Guide](./migration/): migrate from vanilla camera injections or the early test API

Perspective API exposes position, rotation, and projection parameters through a unified `PerspectiveState`. Your mod does not need version-specific callbacks or vanilla FOV/projection calculations.

## Demo Mod

[Perspective API Demo](../example/) implements several custom perspectives and modifiers. Its [source code](https://github.com/Leawind/Perspective-API-Demo) is available as a development reference.

---

[GitHub Releases]: https://github.com/Leawind/Perspective-API/releases
[Modrinth Versions]: https://modrinth.com/mod/perspective-api/versions
