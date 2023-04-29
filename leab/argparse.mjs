
/**
 * CLI Argument Parser
 */
class ArgParser {
	#name = "";
	#version = '';
	#description = '';
	#extraHelp = "";

	#allArgs = [];
	#requireArgs = [];
	#optionalArgs = [];

	/**
	 * @param {string} [name="Unnamed.js"] 程序名称
	 * @param {string} [version='0.0.0'] 程序版本号
	 * @param {string} [description='No description'] 程序描述
	 */
	constructor(name = "Unnamed.js", version = '0.0.0', description = 'No description') {
		this.#name = name;
		this.#description = description;
		this.#version = version;

		this.addArg("help", ['h'], Boolean, false, false, "Show this help message and exit");
		this.addArg("version", ['v', 'ver'], Boolean, false, false, "Show the version");
	}
	/**
	 * 设置额外的帮助信息
	 */
	setExtraHelp(helpText) {
		this.#extraHelp = '' + helpText;
	}
	/**
	 * Add a CLI option
	 * 添加命令行选项
	 * 
	 * @param {String} name 命令全名
	 * @param {any[]} [aliases=[]] 别名或别名列表
	 * @param {BooleanConstructor} [mapArg=Boolean] 值的预处理器
	 * @param {null} [defaultValue=null] 默认值
	 * @param {boolean} [isRequired=false] 是否必须指定此参数
	 * @param {string} [help='No help provided'] 帮助信息
	 */
	addArg(name, aliases, mapArg, defaultValue, isRequired, help) {
		let newItem = new ParserArgument(name, aliases, mapArg, defaultValue, isRequired, help);
		for (let arg of this.#allArgs) {
			if (arg.name === newItem.name) throw new Error(`Duplicated argument name: ${arg.name}`);
			for (let alias of aliases)
				if (arg.aliases.indexOf(alias) >= 0)
					throw new Error(`Duplicated alias: ${alias}\n    Previous argment --${arg.name} has same alias.`);
		}

		this.#allArgs.push(newItem);
		if (isRequired)
			this.requireItems.push(newItem);
		else
			this.#optionalArgs.push(newItem);
	}
	/**
	 * return the parsed args
	 * 返回解析结果
	 * @param {String[]} [argv=process.argv] 命令行参数列表
	 */
	parse(argv = process.argv) {
		argv = this.#getArgList(argv);
		let args = {};
		try {
			for (let i = 0; i < argv.length; i++) {
				let a = argv[i];
				// 寻找匹配的参数项目
				let matchedItem = null;
				for (let item of this.#allArgs) {
					if (item.match(a)) {
						matchedItem = item;
						break;
					}
				}
				if (matchedItem === null) throw new Error(`Unrecognized arguments: ${a}`);
				// 获取值
				if (matchedItem.mapArg === Boolean) {
					args[matchedItem.name] = true;
				} else {
					if (i === argv.length - 1) throw new Error(`Missing value after ${a}`);
					let peekNext = argv[i + 1];
					args[matchedItem.name] = matchedItem.mapArg(peekNext);
					++i;
				}
			}
			if (args.help) {
				console.log(this.#helpText);
				process.exit(0);
			}
			if (args.version) {
				console.log(this.#versionText);
				process.exit(0);
			}
			for (let item of this.#allArgs) {
				if (!(item.name in args)) {
					if (item.isRequired) {
						throw new Error(`Argument ${item.name} is required!`);
					}
					args[item.name] = item.mapArg(item.defaultValue);
				}
			}
		} catch (e) {
			console.error(e.message);
			process.exit(1);
		}
		return args;
	}

	#getArgList(argv = process.argv) {
		argv = argv.slice(2).join(" ").replace(/(^\s+)|(\s+$)/g, '');
		if (argv === '') return [];
		argv = argv.split(" ");
		let argArr = [];
		let isInQuote = false;
		for (let i = 0; i < argv.length; i++) {
			let a = argv[i];
			if (isInQuote) {
				if (a[a.length - 1] === '"') {
					argArr[argArr.length - 1] += ' ' + a.slice(0, -1);
					isInQuote = false;
				} else {
					argArr[argArr.length - 1] += ' ' + a;
				}
			} else {
				if (a[0] === '"') {
					argArr.push(a.slice(1));
					isInQuote = true;
				} else {
					argArr.push(a);
				}
			}
		}
		return argArr;
	}

	get #helpText() {
		let t = `Usage:\n    ${this.#name} [...arguments]\n`;
		if (this.#requireArgs.length) { // Required
			let aliasAlign = this.#requireArgs.reduce((p, c) => Math.max(p, c.aliasText.length), "Aliases".length);
			let nameAlign = this.#requireArgs.reduce((p, c) => Math.max(p, c.nameText.length), "  Name".length);
			t += `Required arguments:\n`;
			t += `    \x1b[1m${"Aliases".padStart(aliasAlign)}, ${"  Name".padEnd(nameAlign)}    Description\x1b[0m\n`;
			for (let arg of this.#requireArgs)
				t += `    ${arg.aliasText.padStart(aliasAlign)}, ${arg.nameText.padEnd(nameAlign)}    ${arg.helpText}\n`;
		}
		if (this.#optionalArgs.length) {
			let aliasAlign = this.#optionalArgs.reduce((p, c) => Math.max(p, c.aliasText.length), "Aliases".length);
			let nameAlign = this.#optionalArgs.reduce((p, c) => Math.max(p, c.nameText.length), "  Name".length);
			t += `Optional arguments:\n`;
			t += `    \x1b[1m${"Aliases".padStart(aliasAlign)}, ${"  Name".padEnd(nameAlign)}    Description\x1b[0m\n`;
			for (let arg of this.#optionalArgs)
				t += `    ${arg.aliasText.padStart(aliasAlign)}, ${arg.nameText.padEnd(nameAlign)}    ${arg.helpText}\n`;
		}
		t += this.#extraHelp;
		return t;
	}

	get #versionText() {
		return `${this.#name}  ${this.#version}\n\t${this.#description}\n`;
	}
};

class ParserArgument {
	name = null;
	aliases = [];
	mapArg = null;
	defaultValue = null;
	helpText = '';
	isRequired = false;
	static NAME_REGEXP = /^[a-zA-Z0-9\u4E00-\u9FFF]+$/;
	/**
	 * @param {String} name 命令全名
	 * @param {any[]} [aliases=[]] 别名或别名列表
	 * @param {BooleanConstructor} [mapArg=Boolean] 值的预处理器
	 * @param {null} [defaultValue=null] 默认值
	 * @param {boolean} [isRequired=false] 是否必须指定此参数
	 * @param {string} [help='No help provided'] 帮助信息
	 */
	constructor(name, aliases = [], mapArg = Boolean, defaultValue = null, isRequired = false, help = 'No help provided') {
		if (typeof name !== 'string') throw new Error(`Invalid cli argument name: ${name}`);
		name = name.replace(/^--/, '');
		if (!ParserArgument.NAME_REGEXP.exec(name))
			throw new Error(`Argument name: "${name}" not match ${ParserArgument.NAME_REGEXP}`);

		if (typeof aliases === 'string') aliases = [aliases];
		for (let alias of aliases) {
			if (typeof alias !== 'string')
				throw new TypeError(`Type of alias should be string, not ${typeof alias}`);
			alias = alias.replace(/^-/, '');
			if (!ParserArgument.NAME_REGEXP.exec(alias))
				throw new Error(`Argument alias: "${alias}" not match ${ParserArgument.NAME_REGEXP}`);
			this.aliases.push(alias);
		}

		this.name = name;
		this.mapArg = mapArg;
		this.defaultValue = defaultValue;
		this.isRequired = isRequired;
		this.helpText = help;
	}
	match(id) {
		return (id.replace(/^--/, '') === this.name) || (this.aliases.indexOf(id.replace(/^-/, '')) >= 0);
	}
	get nameText() {
		return `--${this.name}`;
	}
	get aliasText() {
		return '-' + this.aliases.join(" -");
	}
}

export { ArgParser, ParserArgument };
