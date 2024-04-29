# Regular Expression

## 移除行末空格

```
\s$
```

## 在标题后添加空行

```
(#+.*)\n(.)
```
```
$1\n\n$2
```

## 2+行变2行

```
\n{3,}
```
```
\n\n
```

## 查找左边是A，右边不是A的A

```
(?<!A)A(?!A)
```

## 单行变双行

```
(?<!\n)\n(?!\n)
```

```
\n\n
```

## `@param {type} [name=value]`

> `@param {type} [name=value]`
> 
> `@param {type} name`

```
(?<=@param \{\w+\}\s*)\[(\w+)=.*\]
```

```
$1
```

## `/** 注释`

> ```
> /** 这是注释
>  * @return {Tensor}
>  */
> ```
> ```
> /**
>  * 这是注释
>  * @return {Tensor}
>  */
> ```

```
^(\s*)\/\*\*(.+$)
```

```
$1/**\n$1 *$2
```