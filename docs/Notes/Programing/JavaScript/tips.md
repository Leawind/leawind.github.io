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


## JSON

```js
const JSON = {
	parse(src) {
		return eval("(" + src + ")");
	},
	stringify: (function() {
		var toString = Object.prototype.toString;
		var isArray =
			Array.isArray ||
			function(a) {
				return toString.call(a) === "[object Array]";
			}; // 兼容性考虑
		// 转义字符
		var escMap = {
			'"': '\\"',
			"\\": "\\\\",
			"\b": "\\b",
			"\f": "\\f",
			"\n": "\\n",
			"\r": "\\r",
			"\t": "\\t",
		};
		var escFunc = function(m) {
			return (
				escMap[m] ||
				"\\u" +
				(m.charCodeAt(0) + 0x10000).toString(16).substr(1)
			);
		};
		var escRE = /[\\"\u0000-\u001F\u2028\u2029]/g;
		return function stringify(value) {
			if (value == null) {
				return "null";
			} else if (typeof value === "number") {
				return isFinite(value) ? value.toString() : "null";
			} else if (typeof value === "boolean") {
				return value.toString();
			} else if (typeof value === "object") {
				if (typeof value.toJSON === "function") {
					return stringify(value.toJSON());
				} else if (isArray(value)) {
					var res = "[";
					for (var i = 0; i < value.length; i++)
						res += (i ? ", " : "") + stringify(value[i]);
					return res + "]";
				} else if (toString.call(value) === "[object Object]") {
					var tmp = [];
					for (var k in value) {
						if (value.hasOwnProperty(k))
							tmp.push(
								stringify(k) +
								": " +
								stringify(value[k])
							);
					}
					return "{" + tmp.join(", ") + "}";
				}
			}
			return '"' + value.toString().replace(escRE, escFunc) + '"';
		};
	})(),
};
```
