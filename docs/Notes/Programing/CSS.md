# CSS

## 开关
```html
<input type="checkbox" class="switch" id="switch" />
```
```css
input[type="checkbox"]{
}
```

## 自定义滚动条样式

```css

::-webkit-scrollbar {
	width: 8px;
	height: 8px;
	background-color: #f5f5f5;
	border-radius: 4px;
	box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
	-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
	-moz-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
	-ms-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
	-o-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
	-webkit-border-radius: 4px;
	-moz-border-radius: 4px;
	-ms-border-radius: 4px;
	-o-border-radius: 4px;
}
```
