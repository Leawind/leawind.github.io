# Gradle

构建 gradle 项目时可能遇到的问题

## 中文乱码

在 `build.gradle`中添加

```groovy
tasks.withType(JavaCompile).configureEach {
	options.encoding = 'UTF-8'
}
```

## 构建速度慢

设置仓库

在`build.gradle`中添加

```groovy
repositories {
    mavenLocal()
    maven { url = 'https://maven.minecraftforge.net' }
    maven { url = 'https://repo.spongepowered.org/repository/maven-public/' }
    maven {
        url = 'https://repo.spongepowered.org/repository/maven-public/'
        content { includeGroup "org.spongepowered" }
    }
    mavenCentral()
}
```

## 下载`gradle-8.1.1.bin.zip` 要很长时间

在一个项目中执行`gradlew`任务时，一直在`Downloading https://services.gradle.org/distributions/gradle-8.1.1-bin.zip`

编辑`gradle/wrapper/gradle-wrapper.properties`

```properties
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
networkTimeout=10000
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
distributionUrl=gradle-8.1.1-bin.zip
```

将`distributionUrl`选项改成相对路径，然后将下载好的`gradle-8.1.1-bin.zip`文件复制到`gradle/wrapper`中即可

## 可以在命令行执行任务，但无法在 idea 中执行

重新运行`gradlew genIntellijRuns`，然后在 idea 中重新导入。

## 远程调试

在 idea 中新建配置，类型是远程 JVM 调试(Remote)

在命令行执行 gradle 任务时加一个参数 `--debug-jvm`
