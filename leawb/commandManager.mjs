import { Leaction as lea } from "./Leaction.mjs";

class CommandManager {
	static MAGIC_WORD = `CommandManger-LEAWIND-378yr4y3r29e8y`;
	static HISTORY_LENGTH = 32; // 命令历史最大长度
	// 调用命令的历史记录
	static history = []; // 命令历史队列
	static commands = {}; // 命令

	/**
	 * 添加一个命令
	 * @param {string} cmdName 命令名
	 * @param {()=>void} cmdFunc 函数
	 */
	static addCommand(cmdName, cmdFunc) {
		cmdName = cmdName.trim();
		if (cmdName in this.commands) throw new Error(`Duplicated name: ${cmdName}`);
		if (typeof cmdFunc !== "function") throw new TypeError(`Expected function, got ${typeof cmdFunc}`);
		let cmd = { name: cmdName, func: cmdFunc };

		this.commands[cmdName] = cmdFunc;
		return this;
	}
	/**
	 * 移除命令
	 * @param {string} cmdName 命令名
	 * @param {boolean} [clearHistory=true] 是否清除历史记录
	 */
	removeCommand(cmdName, clearHistory = true) {
		if (cmdName in this.commands) {
			delete this.commands[cmdName];
		}
		this.history = this.history.filter((x) => x !== cmdName);
		return this;
	}

	/**
	 * 执行命令
	 * @param {string} name 命令名
	 * @param {boolean} [updateHistory=true] 是否保留记录
	 */
	static async invoke(name, updateHistory = true) {
		if (name in this.commands) {
			if (updateHistory) {
				// 如果已经存在，则从历史中删除
				let idx = this.history.indexOf(name);
				if (idx !== -1) this.history.splice(idx, 1);
				this.history.unshift(name); // 在开头插入
				// 历史记录长度的上限
				this.history.splice(this.HISTORY_LENGTH);
				// 保存到 localstorage
				this.saveToLocalStorage();
			}
			await this.commands[name]();
		} else {
			this.history = this.history.filter((x) => x !== name);
			throw new ReferenceError(`No such command: ${name}`);
		}
		return this;
	}

	/**
	 * 清空历史记录
	 */
	static clearHistory() {
		this.history = [];
		return this;
	}

	/**
	 * 打开命令面板
	 * @param {boolean} [showHistory=true] 是否显示历史记录
	 * @param {null|(a,b)=>number} [sortBy=null] 非历史记录部分的排序规则
	 */
	static async openCommandUI(showHistory = true, sortBy = null) {
		// 生成命令列表
		let history = [];
		let options = [];
		if (showHistory) {
			for (let name of this.history) {
				if (history.indexOf(name) === -1) history.push(name);
			}
			for (let name in this.commands) {
				if (history.indexOf(name) === -1) options.push(name);
			}
		}
		if (sortBy !== null) options.sort(sortBy);
		history.push(null);
		options = history.concat(options);
		let selectedCmd = await lea.choose("Select a command", options);
		await this.invoke(selectedCmd);
		return this;
	}

	/**
	 * 将历史记录保存到 localStorage
	 */
	static saveToLocalStorage() {
		let con = {
			history: this.history,
		};
		localStorage.setItem(this.MAGIC_WORD, JSON.stringify(con));
		return this;
	}

	/**
	 * 清空 localStorage
	 */
	static clearLocalStorage() {
		localStorage.removeItem(this.MAGIC_WORD);
	}
	/**
	 * 从localStorage读取历史记录
	 */
	static loadFromLocalStorage() {
		if (localStorage.getItem(this.MAGIC_WORD) === null) return this;
		try {
			let con = JSON.parse(localStorage.getItem(this.MAGIC_WORD));
			this.history = con.history;
		} catch (e) {
			console.error(e);
		}
		return this;
	}
}

CommandManager.addCommand("CommandManager: Clear command history", (e) => setTimeout(() => CommandManager.clearHistory()))
	.addCommand("CommandManager: Clear localStorage", (e) => CommandManager.clearLocalStorage())
	.addCommand("CommandManager: Run test", async (e) => {
		if ((await lea.choose("Are you sure to run test of CommandManager?", ["yes", "no"], false)) !== "yes") return;
		let userName = await lea.input(
			"What is your name?",
			(inputs) => true,
			(inputs) => inputs,
			false
		);
		let r = await lea.choose("This is a very long title that is longer than screen. This is a very long title that is longer than screen", ["ok", "cancle"]);
		lea.alert(`Dear ${userName}, testing is done.`);
	});

export { CommandManager };

// import { CommandManager as cmdMgr } from "./leawb/commandManager.mjs";
