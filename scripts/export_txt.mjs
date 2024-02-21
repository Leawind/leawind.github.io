import fs from 'fs';
import path from 'path/posix';

const DOCS = './docs';
const OUT = './llm_txt';
const ACCEPT_EXT = ['.md']

// const DOCS = 'D:/MC/MCJE/Development/MCP-Reborn/MCP-Reborn-1.19.2/src/main/java';
// const OUT = './temp_txt';
// const ACCEPT_EXT = ['.java'];

(async () => {
	walkSync(DOCS, (dir, files, dirs) => {
		for (const fileName of files) {
			if (ACCEPT_EXT.indexOf(path.extname(fileName)) !== -1) {
				const filePath = path.join(dir, fileName);
				const filePathRela = path.relative(DOCS, filePath);
				const outPath = path.join(OUT, filePathRela) + '.txt';
				const fileContent = fs.readFileSync(filePath, 'utf-8');
				console.log(`${fileContent.length.toString().padStart(5)} ${filePath}`);
				fs.mkdirSync(path.dirname(outPath), { recursive: true });
				fs.writeFileSync(outPath, fileContent, 'utf-8');
			}
		}
	});
})();


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
