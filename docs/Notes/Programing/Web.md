## 读取用户输入的文件

```html
<input type="file" multiple>
```

```ts
const onchange: EventListener = e => {
	const input: HTMLInputElement = e.target as HTMLInputElement;
		for (const file of input.files!) {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			const event = await (new Promise(resolve => {
				reader.addEventListener('load', resolve);
			}));
			console.log(event)
			debugger;
		}
}
```
