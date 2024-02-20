# Typescript

## 如何开始一个 typescript 项目

在新建文件夹中初始化 npm 项目

```bash
$> npm init
```

引入 node 类型

```bash
$> npm i -D @types/node
```

安装 typescript

```bash
$> npm i -s typescript
```

初始化 `tsconfig` 文件

```bash
$> tsc --init
```

> ```sh
> npm init
> npm i -D @types/node
> npm i -s typescript
> tsc --init
> ```

编辑`package.json`

```json
{
	"type": "commonjs",
	"scripts": {
		"watch": "tsc --watch",
		"clean": "rm -f lib/*"
	}
}
```

编辑`tsconfig.json`

```json
{
	"compilerOptions": {
		"target": "ESNext",
		"module": "CommonJS",
		"moduleResolution": "Node",
		"sourceMap": false,
		"declaration": true,
		"rootDir": "./src",
		"outDir": "./lib",
		"esModuleInterop": true,
		"forceConsistentCasingInFileNames": true,
		"strict": true,
		"skipLibCheck": false,
		"resolveJsonModule": true,
		"allowUnreachableCode": false,
		"alwaysStrict": true,
		"removeComments": false,
		"inlineSourceMap": true
		// "emitDeclarationOnly": true,
		// "allowImportingTsExtensions": true
	},
	"include": ["src/**/*"]
}
```

监听文件变动并实时将`typescript`编译为`javascript`

```bash
$> tsc --watch
```

## 注册全局命令

在 `package.json` 的 bin 字段中指定命令的名称和文件路径

这是一个 `package.json` 文件示例

```json
{
	"name": "alias",
	"version": "1.0.0",
	"description": "",
	"main": "index.js",
	"type": "commonjs",
	"bin": {
		"alias": "./lib/bin/alias.js"
	},
	"scripts": {},
	"author": "",
	"license": "ISC",
	"devDependencies": {
		"@types/node": "^20.9.0"
	},
	"dependencies": {
		"commander": "^11.1.0"
	}
}
```

ts 文件示例

`alias.ts`

```typescript
#!/usr/bin/env node
import { program } from 'commander';
program.name('alias').version('1.0.0').description('alias command manager');
program.parse();
```

### 安装到当前 node 环境中

```bash
npm install -g
```

然后就可以在命令行中使用 `alias` 命令了


