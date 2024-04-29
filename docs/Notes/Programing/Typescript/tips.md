# TypeScript tips

## 类型声明

映射类型

```ts
type CT = {[id:number]: string};
```


## IO

```ts
import fs from "fs";
import os from "os";
import path from "path";

const lio = {
	listDir(dir: string): string[] {
		if (fs.existsSync(dir)) {
			const stat = fs.statSync(dir);
			if (!stat.isDirectory()) {
				throw new Error(`Expected a directory or unexist, but got ${stat}`);
			}
			return fs.readdirSync(dir);
		} else {
			return [];
		}
	},

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
	walkSync(dirPath: string, callback: (dir: string, files: string[], dirs: string[]) => (boolean | void), filter: (filePath: string) => boolean = x => true, maxDepth: number = Infinity): void {
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
			if (filter(subDirPath))
				this.walkSync(subDirPath, callback, filter, maxDepth - 1);
		}
	},
	/**
	 * 递归删除所有空目录
	 */
	removeEmptyDirectories(root: string) {
		this.walkSync(root, (parent, files, dirs) => {
			dirs.forEach(dir => {
				let dirPath = path.join(parent, dir);
				if (fs.readdirSync(dirPath).length === 0) {
					fs.rmdirSync(dirPath);
				}
			});
		});
	},

	/**
	 * 树的深度优先遍历
	 */
	walkInTree<T>(
		node: T,
		sublist: (nodePath: T[]) => T[],
		isLeave: (nodePath: T[]) => boolean,
		onnode: (nodePath: T[], isleave: boolean, brothers: T[][]) => any,
		supnodes: T[] = [],
		brothers: T[][] = [[]],
	): void {
		let nodePath = supnodes.concat([node]);
		const isleave = isLeave(nodePath);
		onnode(nodePath, isleave, brothers);
		if (!isleave) {
			const subnodes: T[] = sublist(nodePath);
			const myBros = brothers.concat([subnodes]);
			for (let subnode of subnodes) {
				this.walkInTree(subnode, sublist, isLeave, onnode, nodePath, myBros);
			}
		}
	},

	printPathTree(dir: string): void {
		this.walkInTree<string>(
			dir,
			nodePath => fs.readdirSync(path.join(...nodePath)),
			nodePath => fs.statSync(path.join(...nodePath)).isFile(),
			(nodePath, isleave, brothers) => {
				const me: string = nodePath.at(-1)!;
				const myBros = brothers.at(-1) || [me];
				const index: number = myBros.indexOf(me);
				let prefix = '';
				for (let i = 1; i < brothers.length - 1; i++) {
					const node = nodePath[i];
					const bros = brothers[i];
					const j = bros.indexOf(node);
					prefix += j === bros.length - 1
						? '    '
						: j >= 0
							? '│   '
							: '\x1b[33mERR!\x1b[0m';
				}
				prefix += nodePath.length === 1
					? ''
					: index === myBros.length - 1
						? '└─'
						: '├─';
				let suffix: string = isleave ? '' : '/';
				console.log(`${prefix}${me}${suffix}`);
			}
		);
	}
};
export default lio;
```
