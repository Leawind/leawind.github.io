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


## BiMap

```ts
export default class BiMap<A, B>{
	private ab: Map<A, B> = new Map();
	private ba: Map<B, A> = new Map();

	public clear(): this {
		this.ab.clear();
		this.ba.clear();
		return this;
	}
	public deleteA(a: A) {
		if (this.hasA(a)) this.ba.delete(this.ab.get(a)!);
		this.ab.delete(a);
	}
	public deleteB(b: B) {
		if (this.hasB(b)) this.ab.delete(this.ba.get(b)!);
		this.ba.delete(b);
	}
	public forEach(callbackfn: (a: A, b: B, bimap: BiMap<A, B>) => void) {
		this.ab.forEach((value, key, map) => callbackfn(key, value, this));
	}

	public AtoB(a: A): B | undefined {
		return this.ab.get(a);
	}
	public BtoA(b: B): A | undefined {
		return this.ba.get(b);
	}

	public hasA(a: A): boolean {
		return this.ab.has(a);
	}
	public hasB(b: B): boolean {
		return this.ba.has(b);
	}

	public set(a: A, b: B): this {
		if (this.hasA(a)) this.ba.delete(this.ab.get(a)!);
		if (this.hasB(b)) this.ab.delete(this.ba.get(b)!);
		this.ab.set(a, b);
		this.ba.set(b, a);
		return this;
	}
	get size(): number {
		return this.ab.size;
	}
}

```

## CoMap

```ts
export default class CoMap<A, B> {
	private abb: Map<A, Set<B>> = new Map();
	private baa: Map<B, Set<A>> = new Map();

	public clear(): this {
		this.abb.clear();
		this.baa.clear();
		return this;
	}
	public deleteA(a: A) {
		this.abb.get(a)?.forEach(b => this.baa.get(b)?.delete(a));
		this.abb.delete(a);
	}
	public deleteB(b: B) {
		this.baa.get(b)?.forEach(a => this.abb.get(a)?.delete(b));
		this.baa.delete(b);
	}
	public deleteAB(a: A, b: B) {
		if (this.abb.has(a)) {
			this.abb.get(a)!.delete(b);
			this.abb.get(a)!.size === 0 && this.abb.delete(a);
		}
		if (this.baa.has(b)) {
			this.baa.get(b)!.delete(a);
			this.baa.get(b)!.size === 0 && this.baa.delete(b);
		}
	}
	public forEachAB(callbackfn: (a: A, b: B, comap: CoMap<A, B>) => void) {
		this.abb.forEach((bs, a) => bs.forEach(b => callbackfn(a, b, this)));
	}
	public forEachBInA(a: A, callbackfn: (a: A, b: B, comap: CoMap<A, B>) => void) {
		this.abb.get(a)?.forEach(b => callbackfn(a, b, this));
	}
	public forEachAInB(b: B, callbackfn: (a: A, b: B, comap: CoMap<A, B>) => void) {
		this.baa.get(b)?.forEach(a => callbackfn(a, b, this));
	}

	public aToBB(a: A): Set<B> {
		return this.abb.get(a) || new Set();
	}
	public bToAA(b: B): Set<A> {
		return this.baa.get(b) || new Set();
	}

	public sizeA(a: A): number {
		return this.abb.get(a)?.size || 0;
	}
	public sizeB(b: B): number {
		return this.baa.get(b)?.size || 0;
	}

	public setAB(a: A, b: B): this {
		return this;
	}
	get size(): number {
		let s = 0;
		this.abb.forEach(bs => s += bs.size);
		return s;
	}
}
```

## Sets

```ts
export default class Sets {
	/**
	 * 求并集
	 */
	static add<A, B>(setA: Set<A>, setB: Set<B>): Set<A | B> {
		const s: Set<A | B> = new Set(setA);
		setB.forEach(b => s.add(b));
		return s;
	}
	/**
	 * 求补集
	 */
	static minus<T>(setA: Set<T>, setB: Set<T>): Set<T> {
		const s: Set<T> = new Set(setA);
		setB.forEach(b => s.delete(b));
		return s;
	}
	/**
	 * 求交集
	 */
	static and<T>(setA: Set<T>, setB: Set<T>): Set<T> {
		const s: Set<T> = new Set();
		setA.forEach(a => setB.has(a) && s.add(a));
		return s;
	}
}

```

## Tree

```ts
export interface ITree {
	get size(): number;
	get root(): ITreeNode;
	get nodes(): Set<ITreeNode>;
	get leaves(): Set<ITreeNode>;
}

export interface ITreeNode {
	// 子节点数量
	get size(): number;
	// 子节点集合
	get children(): Set<ITreeNode>;
	// 是否是根节点
	get isRoot(): boolean;
	// 父节点
	get parent(): ITreeNode | null;
	// 兄弟们，不包括自己
	get brothers(): Set<ITreeNode>;
	// 兄弟们，包括自己
	get brothersAndSelf(): Set<ITreeNode>;
	// 接到某节点下，作为其子节点
	attach(parent: ITreeNode, modifyParent: boolean): this;
	// 从父节点下移除
	detach(modifyParent: boolean): this;
	// 移除所有子节点
	clearChildren(): this;
	// 是否拥有某子节点
	hasChild(node: ITreeNode): boolean;
	// 添加子节点
	addChild(node: ITreeNode, modifyChild: boolean): this;
	// 移除指定子节点
	removeChild(node: ITreeNode, modifyChild: boolean): this;
}


export class Tree<T> implements ITree {
	root: ITreeNode;
	constructor(root: ITreeNode) {
		this.root = root;
	}
	get nodes(): Set<ITreeNode> {
		throw new Error("Method not implemented.");
	}
	get leaves(): Set<ITreeNode> {
		throw new Error("Method not implemented.");
	}
	get size(): number {
		throw new Error("Method not implemented.");
	}
}

export default class TreeNode<T> implements ITreeNode {
	private _parent: TreeNode<T> | null = null;
	public value: T;
	private _children: Set<TreeNode<T>> = new Set();
	constructor(value: T) {
		this.value = value;
	}
	attach(parent: TreeNode<T>, modifyParent: boolean = true): this {
		modifyParent && parent.addChild(this, false);
		this._parent = parent;
		return this;
	}
	detach(modifyParent: boolean = true): this {
		modifyParent && this._parent?._children.delete(this);
		this._parent = null;
		return this;
	}

	get size(): number {
		return this._children.size;
	}
	get children(): Set<ITreeNode> {
		return new Set(this._children);
	}
	get isRoot(): boolean {
		return this._parent === null;
	}
	get parent(): ITreeNode | null {
		return this._parent;
	}
	get brothers(): Set<ITreeNode> {
		if (this.isRoot) {
			return new Set();
		} else {
			const result = this._parent!.children;
			result.delete(this);
			return result;
		}
	}
	get brothersAndSelf(): Set<ITreeNode> {
		return this._parent?.children || new Set();
	}

	clearChildren(): this {
		this._children.forEach(n => n.detach(false));
		this._children.clear();
		return this;
	}
	hasChild(node: TreeNode<T>): boolean {
		return this._children.has(node);
	}
	addChild(node: TreeNode<T>, modifyChild: boolean = true): this {
		modifyChild && node.attach(this, false);
		this._children.add(node);
		return this;
	}
	removeChild(node: TreeNode<T>, modifyChild: boolean = true): this {
		modifyChild && node.detach(false);
		this._children.delete(node);
		return this;
	}
}

```
