class KeyEventManager {
	static kid_bindings_map = {};
	static isListeningStarted = false;
	/**
	 * //TODO remove Kyeboard event
	 */
	/**
	 * @param {string|string[]} keys 按键组合描述
	 * @param {(KeyboardEvent)=>boolean} func 事件处理函数，返回值表示在其被执行后是否继续执行相同按键绑定的其他事件
	 * @param {boolean|(KeyboardEvent)=>boolean} [when=true] 触发条件
	 * @param {number} [order=0] order in key event list
	 */
	static register(keys, func, when = true, order = 0) {
		if (func !== true && typeof func !== "function") throw new TypeError(`"when" should be a function or true, not ${typeof func}`);
		if (typeof func !== "function") throw new TypeError(`func should be a function, not ${typeof func}`);
		if (typeof order !== "number") throw new TypeError(`order should be a number, not ${typeof order}`);
		const kid = Keys.standardlize(keys);
		const binding = {
			kid: kid, // 按键组合
			func: func, // 函数
			when: when, // 条件
			order: order, // 序号
		};
		if (kid in this.kid_bindings_map) {
			this.kid_bindings_map[kid].push(binding);
			this.kid_bindings_map.sort((a, b) => a.order - b.order);
		} else {
			this.kid_bindings_map[kid] = [binding];
		}
		return this;
	}
	/**
	 * 注销已经注册过的键盘事件
	 * @param {string|symbol|number} id id of binding
	 */
	static cancle(id) {
		NOW;
		let binding = this.id_binding_map[id];
		let kid = binding.kid;
		let brothers = this.kid_bindings_map[kid];
		let idx = brothers.indexOf(binding);
		brothers.splice(idx, 1);
	}
	/**
	 * Register the keyboard event "keydown".
	 */
	static startListening() {
		if (this.isListeningStarted) return this;
		window.addEventListener("keydown", (e) => {
			const kid = Keys.standardlize(e);
			if (kid in this.kid_bindings_map) {
				for (let binding of this.kid_bindings_map[kid]) {
					if (binding.when === true || binding.when(e)) {
						const popUp = binding.func(e);
						if (!popUp) break;
						e.preventDefault();
						e.stopImmediatePropagation();
						e.stopPropagation();
					}
				}
			}
		});
		this.isListeningStarted = true;
		return this;
	}
}

class Keys {
	static get #isInitialized() {
		return this.KEY_CODE !== null;
	}
	static #initialize() {
		if (this.#isInitialized) return;
		this.KEY_CODE = {};
		for (let kid in this.KEY_NAMES) {
			this.KEY_NAMES[kid] = this.KEY_NAMES[kid].map((x) => x.toLowerCase());
			for (let alias of this.KEY_NAMES[kid]) this.KEY_CODE[alias] = kid;
		}
		return this;
	}
	static KEY_NAMES = {
		8: ["Backspace"],
		9: ["Tab", "table"],
		12: ["Clear"],
		13: ["Enter"],
		16: ["Shift", "ShiftLeft"],
		17: ["Ctrl", "ControlLeft", "Control"],
		18: ["Alt", "AltLeft"],
		20: ["CapsLock", "CapsLk"],
		27: ["Esc", "Escape"],
		32: ["Space", " ", "spaceBar"],
		33: ["PgUp", "PageUp"],
		34: ["PgDn", "PageDown"],
		35: ["End"],
		36: ["Home"],
		37: ["left", "arrowLeft"],
		38: ["up", "arrowUp"],
		39: ["right", "arrowRight"],
		40: ["down", "arrowDown"],
		45: ["Ins", "Insert"],

		46: ["Num.", "NumpadDecimal"],
		48: ["Digit0", "0"],
		49: ["Digit1", "1"],
		50: ["Digit2", "2"],
		51: ["Digit3", "3"],
		52: ["Digit4", "4"],
		53: ["Digit5", "5"],
		54: ["Digit6", "6"],
		55: ["Digit7", "7"],
		56: ["Digit8", "8"],
		57: ["Digit9", "9"],

		65: ["A", "KeyA"],
		66: ["B", "KeyB"],
		67: ["C", "KeyC"],
		68: ["D", "KeyD"],
		69: ["E", "KeyE"],
		70: ["F", "KeyF"],
		71: ["G", "KeyG"],
		72: ["H", "KeyH"],
		73: ["I", "KeyI"],
		74: ["J", "KeyJ"],
		75: ["K", "KeyK"],
		76: ["L", "KeyL"],
		77: ["M", "KeyM"],
		78: ["N", "KeyN"],
		79: ["O", "KeyO"],
		80: ["P", "KeyP"],
		81: ["Q", "KeyQ"],
		82: ["R", "KeyR"],
		83: ["S", "KeyS"],
		84: ["T", "KeyT"],
		85: ["U", "KeyU"],
		86: ["V", "KeyV"],
		87: ["W", "KeyW"],
		88: ["X", "KeyX"],
		89: ["Y", "KeyY"],
		90: ["Z", "KeyZ"],

		91: ["Meta", "MetaLeft", "Win", "WinLeft", "Command"],
		96: ["Num0", "Numpad0"],
		97: ["Num1", "Numpad1"],
		98: ["Num2", "Numpad2"],
		99: ["Num3", "Numpad3"],
		100: ["Num4", "Numpad4"],
		101: ["Num5", "Numpad5"],
		102: ["Num6", "Numpad6"],
		103: ["Num7", "Numpad7"],
		104: ["Num8", "Numpad8"],
		105: ["Num9", "Numpad9"],

		106: ["Num*", "NumpadMultiply"],
		107: ["Num+", "NumpadAdd"],
		109: ["Num-", "NumpadSubtract"],
		110: ["Num.", "NumpadDecimal"],
		111: ["Num/", "NumpadDivide"],

		112: ["F1"],
		113: ["F2"],
		114: ["F3"],
		115: ["F4"],
		116: ["F5"],
		117: ["F6"],
		118: ["F7"],
		119: ["F8"],
		120: ["F9"],
		121: ["F10"],
		122: ["F11"],
		123: ["F12"],

		144: ["NumLock"],
		186: [";", "Semicolon", ":", ":;", ";:"],
		187: ["=", "Equal", "+=", "=+", "+"],
		188: [",", "Comma", "<", ",<", "<,"],
		189: ["-", "Minus", "_", "-_", "_-"],
		190: [".", "Period", ">", ".>", ">."],
		191: ["/", "Slash", "?", "/?", "?/"],
		192: ["`", "Backquote", "~", "~`", "`~"],
		219: ["[", "BracketLeft", "{", "[{", "{["],
		220: ["\\", "Backslash", "|", "\\|", "|\\"],
		221: ["]", "BracketRight", "}", "]}", "}]"],
	};
	static KEY_CODE = null;

	/**
	 * 将按键组合标准化为特定格式字符串
	 */
	static standardlize(arg) {
		this.#initialize();
		let keySet = new Set();
		if (arg instanceof KeyboardEvent) {
			const e = arg;
			// 将事件中的按键组合标准化
			keySet.add(this.KEY_CODE[e.key.toLowerCase()]);
			if (e.altKey) keySet.add(this.KEY_CODE["alt"]);
			if (e.ctrlKey) keySet.add(this.KEY_CODE["ctrl"]);
			if (e.shiftKey) keySet.add(this.KEY_CODE["shift"]);
			if (e.metaKey) keySet.add(this.KEY_CODE["meta"]);
		} else if (typeof arg === "string") {
			// 将用户输入的按键组合标准化: String
			return this.standardlize(arg.split(/[\s+]+/));
		} else if (Array.isArray(arg)) {
			// 将用户输入的按键组合标准化: Array[String]
			arg = arg.map((x) => x.trim().toLowerCase());
			for (let key of arg) {
				if (key in this.KEY_CODE) {
					keySet.add(this.KEY_CODE[key]);
				} else {
					throw new SyntaxError(`Unreconized key: ${key}`);
				}
			}
		}
		let keyArr = [];
		for (let key of keySet.values()) keyArr.push(key);
		return keyArr.sort().join("+");
	}
	/**
	 * 将标准化的字符串转换为可阅读的形式
	 */
	static toReadable(kid) {
		if (/([^+]+)(\+[^+]+)*/.exec(kid))
			return kid
				.split("+")
				.map((x) => this.KEY_NAMES[x][0])
				.join(" + ");
		else throw new Error(`Invalid key set string: ${kid}`);
	}
}

export { KeyEventManager, Keys };

// import { KeyEventManager as kvtMgr } from "./leawb/KeyEventManager.mjs";
