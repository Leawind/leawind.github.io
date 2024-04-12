# Javascript

## String 和 ArrayBuffer 转换

```js
let str = 'This is a string';

new TextDecoder('utf-8').decode(buffer);
```

## Human readable size

```js
readableSize(B, c = 1000, d = 2) {
	const units = ["B", "KB", 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	let i = 0;
	for (i = 0; i < units.length; i++)
		if (B < c ** i) break;
	i = Math.max(0, i - 1);
	return `${(B / c ** i).toFixed(d)} ${units[i]}`.replace(/\.0+ /, ' ');
}
```
