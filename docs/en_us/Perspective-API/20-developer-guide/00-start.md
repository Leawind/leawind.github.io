---
title: Start
---

# Start

## Adding Dependencies

### Adding via Modrinth Maven

Add the Modrinth Maven repository:

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
```

Coordinate format: `maven.modrinth:perspective_api:$perspectiveApiVersion+${loader}-$mcVersion`.

You can also specify the project ID: `maven.modrinth:LIqveQm1:$perspectiveApiVersion+${loader}-$mcVersion`.

```kotlin
dependencies {
  // Use implementation for Minecraft 26.1 and above
  implementation("maven.modrinth:perspective_api:${perspectiveApiVersion}+fabric-26.2")
}
```

> [!INFO]
>
> You can view all versions of this mod on the [Modrinth Versions] or [Github Releases] page.

### Adding `com.google.auto.service` Dependency (Optional)

```kotlin
dependencies {
  compileOnly("com.google.auto.service:auto-service-annotations:1.1.1")
  annotationProcessor("com.google.auto.service:auto-service:1.1.1")
}
```

It automatically generates Java SPI service files for `PerspectiveBehavior`, eliminating the need to manually maintain `META-INF/services`.

## Next steps

- [Custom Perspective](./perspective): Define a complete camera mode
- [Projection Mode](./convention/projection): Render the world in perspective or orthographic projection
- [Perspective Modifier](./modifier): Overlay camera effects on any perspective
- [Override Chain](./override-chain): Temporarily force a perspective switch based on game state
- [Migration Guide](./migration/): Migrate from vanilla camera injection or early beta API versions

Perspective API consistently exposes position, rotation, and projection parameters via a unified `PerspectiveState`. Developers do not need to choose different callbacks for different Minecraft versions, nor should they call vanilla FOV or projection matrix calculation methods directly.

## Example Mod

The [Perspective API Demo](../example/) implements multiple custom perspectives and modifiers. Its [source code] can serve as a development reference.

---

[Github Releases]: https://github.com/Leawind/Perspective-API/releases
[Modrinth Versions]: https://modrinth.com/mod/perspective-api/versions
[source code]: https://github.com/Leawind/Perspective-API-Demo
