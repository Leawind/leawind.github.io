# Java tips

## Record 记录

```java
record Point(int x, int y) {}
```

相当于

```java
final class Point extends Record {
    private final int x;
    private final int y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public int x() {
        return this.x;
    }

    public int y() {
        return this.y;
    }

    public String toString() {
        return String.format("Point[x=%s, y=%s]", x, y);
    }

    public boolean equals(Object o) {
        ...
    }
    public int hashCode() {
        ...
    }
}
```

## 线程休眠

```java
Thread.sleep(1000);	// sleep 1000 ms
```

## 获得时间戳

单位都是毫秒

```java
long now = System.currentTimeMillis();	// 效率较高
long now = new Date().getTime();
long now = Calendar.getInstance().getTimeInMillis();
```

## 在单独的线程中类似 setInterval

```java
new Timer().scheduleAtFixedRate()
```

## 注解

### `@SuppressWarnings`

```java
@SuppressWarnings("unused")
```

-   `unused` 未使用的字段、局部变量
-   `unchecked` 未检查的类型
-   `deprecation` 使用了已过时的类、方法、字段
-   `rawtypes` 未使用泛型
-   `serial`
-   `all` 所有警告

### `@SafeVarargs`

用于标记一个具有可变数量的参数的方法，方法不会对这些参数执行任何不安全的操作。

### `@NotNull` 和 `@Nullable`

### `@Override`

覆写父类方法或实现接口方法

### `@com.google.gson.annotations.Expose`

在GSON上调用`excludeFieldsWithoutExposeAnnotation()`即可使GSON忽略非@Expose字段。

## 复制数组

```java
```


## 函数式接口

### Consumer

```java
public interface Consumer<T> {
    void accept(T t);
    default Consumer<T> andThen(Consumer<? super T> after) {
        Objects.requireNonNull(after);
        return (T t) -> { accept(t); after.accept(t); };
    }
}
```

对传入参数进行处理，不返回结果



### Supplier

```java
public interface Supplier<T> {
    T get();
}

```

调用时不传入参数，只是返回一个值，

### Predicate

```java
public interface Predicate<T> {
    boolean test(T t);
    default Predicate<T> and(Predicate<? super T> other) {
        Objects.requireNonNull(other);
        return (t) -> test(t) && other.test(t);
    }
    default Predicate<T> negate() {
        return (t) -> !test(t);
    }
    default Predicate<T> or(Predicate<? super T> other) {
        Objects.requireNonNull(other);
        return (t) -> test(t) || other.test(t);
    }
    static <T> Predicate<T> isEqual(Object targetRef) {
        return (null == targetRef)
                ? Objects::isNull
                : object -> targetRef.equals(object);
    }
    @SuppressWarnings("unchecked")
    static <T> Predicate<T> not(Predicate<? super T> target) {
        Objects.requireNonNull(target);
        return (Predicate<T>)target.negate();
    }
}

```

处理输入参数后返回布尔值。



### Function

```java
public interface Function<T, R> {
    R apply(T t);
    default <V> Function<V, R> compose(Function<? super V, ? extends T> before) {
        Objects.requireNonNull(before);
        return (V v) -> apply(before.apply(v));
    }
    default <V> Function<T, V> andThen(Function<? super R, ? extends V> after) {
        Objects.requireNonNull(after);
        return (T t) -> after.apply(apply(t));
    }
    static <T> Function<T, T> identity() {
        return t -> t;
    }
}

```

既有输入，也有输出
