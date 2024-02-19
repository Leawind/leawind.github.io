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

## `@SuppressWarnings`

```java
@SuppressWarnings("unused")
```

-   `unused` 未使用的字段、局部变量
-   `unchecked` 未检查的类型
-   `deprecation` 使用了已过时的类、方法、字段
-   `rawtypes` 未使用泛型
-   `serial`
-   `all` 所有警告
