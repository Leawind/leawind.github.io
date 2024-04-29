# Gradle

## 如何新建一个项目

先新建文件夹

```sh
mkdir helloworld
cd helloworld
```

```bash
$> gradle init

Select type of project to generate:
  1: basic
  2: application
  3: library
  4: Gradle plugin
Enter selection (default: basic) [1..4] 3

Select implementation language:                                                                                                                                                                                                                           
  1: C++                                                                                                                                                                                                                                                  
  2: Groovy
  3: Java
  4: Kotlin
  5: Scala
  6: Swift
Enter selection (default: Java) [1..6] 3

Select build script DSL:                                                                                                                                                                                                                                  
  1: Groovy                                                                                                                                                                                                                                               
  2: Kotlin
Enter selection (default: Groovy) [1..2] 1

Generate build using new APIs and behavior (some features may change in the next minor release)? (default: no) [yes, no]                                                                                                                                  
Select test framework:                                                                                                                                                                                                                                    
  1: JUnit 4                                                                                                                                                                                                                                              
  2: TestNG
  3: Spock
  4: JUnit Jupiter
Enter selection (default: JUnit Jupiter) [1..4] 1

Project name (default: Textarea):                                                                                                                                                                                                                         
Source package (default: textarea):  net.leawind.textarea

> Task :init
Get more help with your project: https://docs.gradle.org/8.0.2/samples/sample_building_java_libraries.html

BUILD SUCCESSFUL in 43s
2 actionable tasks: 2 executed
```

```bash
$> gradlew assemble

BUILD SUCCESSFUL in 5s
2 actionable tasks: 2 executed
```

## Task

### 定义一个任务

```groovy
tasks.register('hello') {
    dolast {
        print 'Hello'
    }
}
```

### 定位任务

你经常需要定位已经在构建文件中定义的任务。

```groovy
// 按照类型访问任务
tasks.withType(JavaCompile)
// 按照路径访问任务
tasks.getByPath(":jar")
// 名称
tasks.named("jar")
```

### 配置任务

```groovy
tasks.named('copy'){
    from 'resources'
}
```

### 给task定义依赖

```groovy
tasks.register('hello'){
    dependsOn ':assemble'
    doLast{
        println 'hello you'
    }
}
```

## 问题

### 中文乱码问题

在 `build.gradle`中添加

```groovy
tasks.withType(JavaCompile).configureEach {
	options.encoding = 'UTF-8'
}
```

### 构建速度慢

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

### 下载`gradle-8.1.1.bin.zip` 要很长时间

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

### 可以在命令行执行任务，但无法在 idea 中执行

重新运行`gradlew genIntellijRuns`，然后在 idea 中重新导入。

### 远程调试

在 idea 中新建配置，类型是远程 JVM 调试(Remote)

在命令行执行 gradle 任务时加一个参数 `--debug-jvm`
