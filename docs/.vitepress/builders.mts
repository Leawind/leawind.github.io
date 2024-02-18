import fs from 'fs';
import path from 'path/posix';

export function buildSidebar(dir: string, name: string, docsRoot: string = 'docs'): any {
	dir = path.join(docsRoot, dir.replace(/^\/+/g, ''));
	const sidebar = [parseDir(dir, name)];
	sidebar[0].link = '.';
	console.warn(JSON.stringify(sidebar, null, 2));
	return sidebar;

	function parseDir(dir: string, name: string | null = null) {
		const dirName = name || path.basename(dir);
		return {
			text: dirName,
			items: fs.readdirSync(dir).map(oName => {
				const oPath = path.join(dir, oName);
				if (fs.statSync(oPath).isFile()) {
					if (oName.startsWith('index')) return;
					return {
						text: getTitle(oPath),
						link: '/' + path.relative(docsRoot, oPath),

					};
				} else {
					return parseDir(oPath, oName);
				}
			}).filter(i => i),
		};
	}

	function getTitle(filePath: string): string {
		const src: string = fs.readFileSync(filePath, 'utf-8');
		const matches = /^\s*#*#(.*)/.exec(src);
		const result = matches === null ? path.basename(filePath) : matches[1];

		return result;
	}

}

