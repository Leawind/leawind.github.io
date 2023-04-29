// let LeactionHtml = document.querySelector("#Leaction-html").innerHTML;

let LeactionHtml = `
<div id="leaction:max">
<style>
	/* 全屏大容器，默认不可见 */
	#leaction:max {
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: center;
		align-content: center;
		overflow: hidden;

		box-sizing: border-box;
		padding: 0;
		margin: 0;
		position: fixed;
		z-index: 2147483646;
		width: 100vw;
		height: 100vh;
		top: 200vh;
		left: 0;
		filter: blur(0.5vmax) contrast(1.2);
		backdrop-filter: blur(0vmin);
		transition-property: backdrop-filter, filter;
		transition-duration: 200ms;
		color: #fff;
	}

	/* 可见时的全屏大容器 */
	#leaction:max.visible {
		filter: blur(0vmin);
		backdrop-filter: blur(0.5vmax) contrast(1.2);
		top: 0;
	}

	#leaction:max * {
		outline: none;
		box-sizing: border-box;
		padding: 0;
		margin: 0;
	}

	#leaction:max .template {
		/* display: none; */
	}

	#leaction:max>div.container {
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: center;
		align-content: center;

		background: #252526;
		width: 50em;
		max-width: 90vw;
		height: fit-content;
		min-height: calc(3em + 1.2em);
		max-height: fit-content;
		overflow: hidden;
		box-shadow: 0 0 8px 2px #000;
		border-radius: 0.3em;
		padding: 0.4em 0.4em 0 0.4em;
	}

	#leaction:max>div.container>div.prompt {
		font-weight: 900;
	}

	#leaction:max>div.container>input {
		display: block;
		background: none;
		width: 100%;
		min-height: 2em;
		font-size: 1em;
		padding: 0.4em 0.5em;
		overflow-x: auto;
		margin-top: 0.5em;
		border: 1.5px solid #ff0;
		border-radius: 0.25em;
		line-height: 1.5em;
		color: #fff;
	}

	#leaction:max>div.container>div.info {
		display: block;
		padding: 0.2em 0.5em;
		height: fit-content;
		min-height: 1.9em;
		width: 100%;

		font-size: 0.8em;
		line-height: 1.5em;
		background: #1d5a1d;
		color: #fff;
	}

	#leaction:max>div.container>div.info.invalid {
		background: #5a1d1d;
		font-weight: 900;
	}

	#leaction:max>div.container>div.options {
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		height: fit-content;
		max-height: calc(100vh);
		border-radius: 0.25em;
		margin: 0.5em 0;

		overflow-x: hidden;
		overflow-y: auto;
	}

	#leaction:max>div.container>div.options::-webkit-scrollbar {
		background: none;
		width: 0.8em;
	}

	#leaction:max>div.container>div.options::-webkit-scrollbar-thumb {
		background-color: #fff3;
		border-radius: 0.3em;

	}

	#leaction:max>div.container>div.options>div.option {
		display: none;
		border-radius: 0.2em;
		line-height: 1.5em;
		width: 100%;
		padding: 0 0.5em;
		color: #fff;
	}

	#leaction:max>div.container>div.options>div.option:hover {
		cursor: pointer;
		background-color: #fff2;
	}

	#leaction:max>div.container>div.options>div.option.ismatch {
		display: flex;
	}

	#leaction:max>div.container>div.options>div.option.selected {
		background-color: #ffff00;
		color: #000;
	}

	#leaction:max>div.container>div.options>div.line {
		display: block;
		height: 0;
		width: calc(100% - 0.4em);
		border: 0.5px solid #ff0;
		margin: 0.4em 0;
	}
</style>
<div class="container">
	<div class="prompt"></div>
	<input type="text"></input>
	<div class="info"></div>
	<div class="options"> </div>

	<div class="template option"></div>
</div>
</div>`;

export { LeactionHtml };
