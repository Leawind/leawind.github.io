---
title: Developer Guide
---

# Developer Guide

> [!WARNING]
> Before the release of the `1.0.0` version, the API is subject to breaking changes at any time.

## Adding the Dependency

> [!INFO]
>
> You can find all versions on the [Modrinth Versions] or [GitHub Releases] page.
>
> This badge should display the latest version: <img src="https://img.shields.io/github/v/tag/Leawind/Perspective-API?label=API&color=818181" style="display:inline">

### Via Modrinth Maven

Format: `"maven.modrinth:perspective-api:${version}+${loader}-${minecraft_version}"`

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
  // Use `implementation` for >=26.1
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

This makes SPI implementation more convenient, without having to manually edit service files.

## Demo Mod

[Perspective API Demo](https://github.com/Leawind/Perspective-API-Demo) implements several custom perspectives and can be used as a development reference.

---

[GitHub Releases]: https://github.com/Leawind/Perspective-API/releases
[Modrinth Versions]: https://modrinth.com/mod/perspective-api/versions
