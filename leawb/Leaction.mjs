import { LeactionHtml } from './Leaction.html.mjs';

const MAGIC_ID = `sjrmttjwsleawindLeaction`;
const MAGIC_SELECTOR = `#${MAGIC_ID}`;
const CONTENT_HTML = LeactionHtml.replace(/leaction:max/g, MAGIC_ID);


var isBusy = false;

let ele_max, ele_container;
let ele_prompt, ele_input, ele_info, ele_options;
let ele_template_option, ele_template_line;

{
	document.querySelector('html').innerHTML += CONTENT_HTML;
	ele_max = document.querySelector(MAGIC_SELECTOR);
	ele_container = ele_max.querySelector('div.container');
	ele_prompt = ele_max.querySelector(`div.prompt`);
	ele_input = ele_max.querySelector(`input`);
	ele_info = ele_max.querySelector(`div.info`);
	ele_options = ele_max.querySelector(`div.options`);
	ele_template_option = ele_max.querySelector(`div.template.option`);
}

function openUI() {
	ele_max.classList.add('visible');
}
function closeUI() {
	ele_max.classList.remove('visible');
}

/**
 * 异步交互
 */
class Leaction {
	/**
	 * 提供一些选项，让用户从中选择一项或添加新选项
	 * @param {string} prompt 提示信息
	 * @param {(string|null)[]} options 选项列表
	//  * @param {boolean} allowCustomOption 是否允许用户自定义选项。如果为true，当用户输入不在options内时，也可以返回用户输入的值
	 * @param {boolean} [rejectable=true] 用户是否可以拒绝选择 (Esc)
	 */
	static async choose(prompt, options, rejectable = true) {
		if (isBusy) throw new Error("isBusy!");
		if (options.length === 0)
			throw new Error(`No option specified!`);
		if (!Array.isArray(options))
			throw new TypeError(`Expected string[], got ${typeof opt}`);
		isBusy = true;
		openUI();

		ele_options.removeAttribute('style');
		ele_info.style.display = 'none';
		ele_prompt.innerHTML = prompt;
		ele_input.value = '';
		ele_input.focus();
		// Prepare the DOM nodes for options
		while (ele_options.children.length < options.length) {
			let newEle = ele_template_option.cloneNode();
			newEle.classList.remove('template');
			ele_options.appendChild(newEle);
		}
		// remove redundent nodes
		while (ele_options.children.length > options.length)
			ele_options.lastChild.remove();
		// set up nodes
		for (let i = 0; i < options.length; i++) {
			let opt = options[i];
			if (typeof opt !== 'string' && opt !== null)
				throw new TypeError(`Expected string, got ${typeof opt}`);
			let ele_opt = ele_options.children[i];
			if (opt === null) {
				ele_opt.classList = "line";
				ele_opt.innerHTML = '';
			} else {
				ele_opt.classList = "option";
				ele_opt.innerHTML = opt;
				ele_opt.classList.add('ismatch');
				ele_opt.classList.remove('selected');
			}
		}
		ele_options.children[0].classList.add('selected');

		let selectedId = 0;
		let hasMatch = true;
		// let presolve = null, preject = null;

		const evt_keydown = e => {
			let smove = e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : 0;
			if (smove !== 0) {
				selectedId += smove;
				updateDOM();
			}
		};
		function updateDOM() {
			ele_options.querySelectorAll(".selected")
				.forEach(ele_opt => ele_opt.classList.remove('selected'));
			let ele_matches = [];
			for (let ele_opt of ele_options.querySelectorAll(".ismatch"))
				ele_matches.push(ele_opt);
			if (!ele_matches.length) return;
			selectedId = (selectedId % ele_matches.length + ele_matches.length) % ele_matches.length;
			ele_matches[selectedId].classList.add('selected');
			ele_matches[selectedId].scrollIntoViewIfNeeded(false);
		}
		window.addEventListener('keydown', evt_keydown, true);

		try {
			let result = await new Promise((resolve, reject) => {
				// presolve = resolve;
				// preject = reject;
				ele_input.oninput = e => {
					let s = ele_input.value.replace(/\s/g, '');
					const reg = new RegExp(s.replace(/(?=.)/g, ".*") + '.*', "i");
					hasMatch = false;
					for (let ele_opt of ele_options.querySelectorAll('.option')) {
						const opt = ele_opt.innerHTML;
						if (reg.exec(opt)) {
							ele_opt.classList.add('ismatch');
							hasMatch = true;
						} else {
							ele_opt.classList.remove('ismatch');
						}
					}
					if (hasMatch) {
						selectedId = 0;
						updateDOM();
						ele_info.style.display = 'none';
						ele_info.classList.remove('invalid');
					} else {
						selectedId = -1;
						ele_info.removeAttribute('style');
						ele_info.innerHTML = `No option matches`;
						ele_info.classList.add('invalid');
					}
				};
				ele_input.onkeydown = e => {
					if (e.key === 'Enter') {
						if (hasMatch) {
							let ele_opt = ele_options.querySelector('.selected');
							resolve(ele_opt.innerHTML);
						}
					} else if (e.key === 'Escape') {
						if (rejectable) {
							reject(ele_input.value);
						} else {
							ele_info.innerHTML = `You must select a option!`;
							ele_info.classList.add('invalid');
							ele_info.removeAttribute('style');
						}
					}
				};
				ele_options.onclick = e => {
					if (e.target.classList.contains('option') && e.target.classList.contains('ismatch'))
						resolve(e.target.innerHTML);
				};
			});
			window.removeEventListener('keydown', evt_keydown);
			closeUI();
			ele_input.blur();
			isBusy = false;
			return result;
		} catch (e) {
			window.removeEventListener('keydown', evt_keydown);
			closeUI();
			ele_input.blur();
			isBusy = false;
			throw e;
		}
	}

	/**
	 * 获取用户输入字符串
	 * @param {string} prompt 提示信息
	 * @param {(inputs)=>Promise|boolean} check 检查输入是否合法
	 * @param {(inputs, isValid)=>string} preview 对输入信息的实时预览
	 * @param {boolean} [rejectable=true] 是否可以拒绝提供输入 (Esc)
	 */
	static async input(prompt, check, preview, rejectable = true) {
		if (isBusy) throw new Error("isBusy!");
		isBusy = true;
		openUI();
		ele_options.style.display = 'none';
		ele_info.removeAttribute('style');
		ele_prompt.innerHTML = prompt;
		ele_info.innerHTML = '';
		ele_input.value = '';
		ele_input.focus();
		let result;
		try {
			result = await new Promise((resolve, reject) => {
				let isInputsValid = false;
				ele_input.oninput = async e => {
					isInputsValid = await check(ele_input.value);
					let p = preview(ele_input.value, isInputsValid);
					isInputsValid ?
						ele_info.classList.remove('invalid') : ele_info.classList.add('invalid');
					ele_info.innerHTML = p;
				};
				ele_input.onkeydown = e => {
					if (e.key === 'Enter') {
						ele_input.oninput();
						if (isInputsValid)
							resolve(ele_input.value);
						e.preventDefault();
						e.stopPropagation();
					} else if (e.key === 'Escape') {
						if (rejectable) {
							reject(ele_input.value);
						} else {
							ele_info.innerHTML = `Quit (Esc) is not allowed here.`;
							ele_info.classList.add('invalid');
						}
						e.preventDefault();
						e.stopPropagation();
					}
				};

			});
			closeUI();
			ele_input.blur();
			isBusy = false;
			return result;
		} catch (e) {
			closeUI();
			ele_input.blur();
			isBusy = false;
			throw e;
		}
	}

	static async alert(message) {
		return await this.choose(message, ["ok"]);
	}
}

const superMethods = {
	openUI: openUI,
	closeUI: closeUI
};


export { Leaction, superMethods };
