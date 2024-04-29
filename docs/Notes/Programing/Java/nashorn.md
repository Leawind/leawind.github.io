# Nashorn: Javascript in java.

## Basical usage

### import

```java
import javax.script.Bindings;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
```

### do it

```java
// 创建 js 引擎
ScriptEngine engine = new ScriptEngineManager().getEngineByName("nashorn");
// 直接执行脚本
engine.eval("print('Hey bro!')");
```
### 绑定变量

在执行脚本前，将变量存放在 Bindings 对象中，

执行脚本时把 Bindings 作为参数传进去

js 脚本可以读写这些变量

执行完脚本后可以从这个 Bindings 中读取修改后的变量

```java
String[] sa = new String[] {"var1", "this is str2", "String 3 here.", "4th str."};
for (int i = 0; i < sa.length; i++)
	System.out.println(sa[i]);
BINDINGS.put("strArr", sa);
exec("for(var i=0;i<strArr.length;i++) strArr[i] ='1';", BINDINGS);
sa = (String[]) BINDINGS.get("strArr");
for (int i = 0; i < sa.length; i++)
	System.out.println(sa[i]);
```

可以将 java 中的实例放到绑定里去，在脚本中可以访问这个实例。

如果在脚本中对实例的属性做了修改，那么脚本执行完后，在 java 中可以看到实例确实被修改了。

如果在脚本中对实例的一个 int 类型的属性写入一个浮点数，该属性的值会变成整数。

如果写入其他类型的值（字符串、），也不会报错，但该属性的值可能会变成 0.

可以在脚本中把实例的引用类型属性设置为 null

### 调用自定义 java 函数

```javascript
var FunctionSet = Java.type("net.leawind.infage.jsfunctions");
print(FunctionSet.log10(1000));
```



### 预编译

```java
ScriptEngine engine = new ScriptEngineManager().getEngineByName("nashorn");
Bindings bindings = engine.createBindings();
bindings.put("name", "Hey")
CompiledScript cs = ((Compilable) engine).compile("print(name + ' bro')", bindings);
```

