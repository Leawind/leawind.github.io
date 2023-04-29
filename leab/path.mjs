class path_common {
	static join(...args) {
		if (args.length === 0)
			throw new Error(`Arguments expected, got no argument.`);
		const nodes = [];
		if (args[0].trim()[0] === this.delimiter)
			nodes.push('');
		for (let p of args) {
			if (typeof p !== 'string')
				throw new TypeError(`Expected string, got ${typeof p}`);
			for (let node of p.split(/\/|\\/g)) {
				node = node.replace(/(^\s+)|(\s+$)/, '');
				if (node.length)
					nodes.push(node);
			}
		}
		return nodes.join(this.delimiter);
	}
	static basename(fpath, suffix = '') {
		return fpath.replace(/^.*(\/|\\)/, '').replace(new RegExp(`${suffix}$`), '');
	}
	static dirname(fpath) {
		return fpath.replace(/(?<=[\/\\])[^\/\\]+$/, '');
	}
	static extname(fpath) {
		return fpath.replace(/^.*[\/\\]/, '').replace(/^[^\.]*/, '');
	}
	static sep(fpath) {
		return fpath.replace(/(^[\\\/])|([\\\/]$)/g, '').split(/\/|\\/g);
	}
}


class path_windows extends path_common {
	static get delimiter() {
		return '\\';
	}
	static isAbsolute(fpath) {
		return !!/^[a-zA-Z]:(\/.*)?$/.exec(fpath);
	}
};
class path_posix extends path_common {
	static get delimiter() {
		return '/';
	}
	static isAbsolute(fpath) {
		return fpath.trim()[0] === "/";
	}
};

export { path_windows, path_posix };