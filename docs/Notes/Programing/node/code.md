# node code

## 遍历目录树

:::details ts

```ts
/**
 * 遍历目录
 * 
 * @param dirPath 初始路径
 * @param callback 回调函数
 *     @param dir 所在目录
 *     @param files 该目录下所有文件名
 *     @param dirs 该目录下所有目录名
 * @param filter 目录过滤器，若返回true，表示该目录不遍历
 * @param [maxDepth=Infinity] 
 */
function walkSync(dirPath: string,
		 callback: (dir: string, files: string[], dirs: string[]) => (boolean | void),
		 filter: (filePath: string) => boolean = x => true,
		 maxDepth: number = Infinity
): void {
	if (maxDepth == 0) return;
	if (!fs.existsSync(dirPath)) return;
	const sublist = fs.readdirSync(dirPath);
	const subFileNames: string[] = [];
	const subDirNames: string[] = [];
	const subDirPaths: string[] = [];
	for (const subname of sublist) {
		const subpath = path.join(dirPath, subname);
		const substat = fs.statSync(subpath);
		if (substat.isFile()) {
			subFileNames.push(subname);
		} else if (substat.isDirectory()) {
			subDirPaths.push(subpath);
			subDirNames.push(subname);
		}
	}
	callback(dirPath, subFileNames, subDirNames);
	for (const subDirPath of subDirPaths) {
		if (filter(subDirPath)) walkSync(subDirPath, callback, filter, maxDepth - 1);
	}
}
```
:::

:::details js
```js

/**
 * 遍历目录
 * 
 * @param dirPath 初始路径
 * @param callback 回调函数
 *     @param dir 所在目录
 *     @param files 该目录下所有文件名
 *     @param dirs 该目录下所有目录名
 * @param filter 目录过滤器，若返回true，表示该目录不遍历
 * @param [maxDepth=Infinity] 
 */
function walkSync(dirPath, callback, filter = x => true, maxDepth = Infinity
) {
	if (maxDepth == 0) return;
	if (!fs.existsSync(dirPath)) return;
	const sublist = fs.readdirSync(dirPath);
	const subFileNames = [];
	const subDirNames = [];
	const subDirPaths = [];
	for (const subname of sublist) {
		const subpath = path.join(dirPath, subname);
		const substat = fs.statSync(subpath);
		if (substat.isFile()) {
			subFileNames.push(subname);
		} else if (substat.isDirectory()) {
			subDirPaths.push(subpath);
			subDirNames.push(subname);
		}
	}
	callback(dirPath, subFileNames, subDirNames);
	for (const subDirPath of subDirPaths) {
		if (filter(subDirPath)) walkSync(subDirPath, callback, filter, maxDepth - 1);
	}
}
```
:::
