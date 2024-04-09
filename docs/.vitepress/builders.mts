import fs from 'fs';
import path from 'path/posix';
import { deprecate } from 'util';

import { DefaultTheme } from 'vitepress';

/**
 * 自动构建侧栏
 * 
 * @param dirPath  目录路径
 * @param name 侧栏名称
 * @param [docsRoot='docs'] 文档根目录
 * @deprecate
 */
export function buildSidebar(dirPath: string, docsRoot: string = 'docs'): any {
	dirPath = path.join(docsRoot, dirPath.replace(/^\/+/g, ''));
	const sidebar = buildDirSidebar(dirPath, docsRoot);
	// console.debug(JSON.stringify(sidebar, null, 2));
	sidebar.collapsed = false;
	return sidebar;
}

/**
 * @param dirPath 目录路径
 * @param [name=null] 显示名称
 */
export function buildDirSidebar(dirPath: string, docsRoot: string): DefaultTheme.SidebarItem {
	const dir = parse(dirPath);
	const items: DefaultTheme.SidebarItem[] = [];
	// 遍历目录，添加子元素
	for (let iname of fs.readdirSync(dirPath)) {
		const ipath = path.join(dirPath, iname);
		if (!isOrHasPageFile(ipath)) continue;
		// console.debug(`buildDirSidebar: ${ipath}`);
		if (fs.statSync(ipath).isFile()) {
			if (!iname.startsWith('index')) {
				items.push({
					text: parseFile(ipath).title,
					link: '/' + path.relative(docsRoot, ipath),
				});
			}
		} else {
			items.push(buildDirSidebar(ipath, docsRoot));
		}
	}
	// 
	const result: DefaultTheme.SidebarItem = {
		text: getDirTitle(dirPath),
		collapsed: true,
		items: items,
	};
	if (!dir.pureTitle)
		result.link = path.relative(docsRoot, dirPath).replace(/(^\/*)|(\/*$)/g, '/');
	return result;
}


/**
 * 解析目录或文件
 * 
 * title 标题
 * src 文件内容
 * titleOnly 文件内容中是否仅含有标题
 */
function parse(filePath: string): { title: string; path: string; pureTitle?: boolean; src?: string; } {
	if (!fs.existsSync(filePath))
		return {
			title: path.basename(filePath),
			path: filePath,
		};
	const stat = fs.statSync(filePath);
	if (stat.isFile()) {
		return parseFile(filePath);
	} else if (stat.isDirectory()) {
		return parse(path.join(filePath, 'index.md'));
	} else {
		return {
			title: path.basename(filePath),
			path: filePath,
		};
	}
}
function parseFile(filePath: string): { title: string; path: string; pureTitle: boolean; src: string; } {
	const src: string = fs.readFileSync(filePath, 'utf-8');
	const matches = /(\n|^)\s*#*#(.*)/.exec(src);
	return {
		title: matches === null ? path.basename(filePath) : matches[2],
		path: filePath,
		pureTitle: src.replace(/(\n|^)\s*#{1,}.*(\n|$)/, '').trim() === '',
		src: src,
	};
}
function getDirTitle(dirPath: string): string {
	const indexFile = path.join(dirPath, 'index.md');
	if (fs.existsSync(indexFile)) {
		return parseFile(indexFile).title;
	} else {
		return path.basename(dirPath);
	}
}

function isPageFile(filePath) {
	return /\.(md)|(html)|(htm)/i.test(path.parse(filePath).ext);
}

function hasPageFile(dirPath: string) {
	for (const subname of fs.readdirSync(dirPath))
		if (isPageFile(subname)) return true;
	return false;
}

function isOrHasPageFile(apath: string) {
	if (fs.statSync(apath).isFile()) return isPageFile(apath);
	else return hasPageFile(apath);
}
