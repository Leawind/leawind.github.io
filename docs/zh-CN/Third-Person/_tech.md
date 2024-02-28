# Before publish

* 检查注解
  * 移除 `@Deprecated`
  * 添加 `@Contract`
  * 添加 `@NotNull`, `@Nullable`
  * 添加 `@VersionSensitive`
* 检查是否可用`Optional`代替`@Nullable`
* 提取常量
* todos
  * #`NOW`
  * #`TODO`
* Mixin
  * 确保添加到json
  * Priority `@Mixin(value=Gui.class, priority=2000)`
* 构建后使用modrinth测试
* 修改文档
  * changelog
  * 特性介绍
