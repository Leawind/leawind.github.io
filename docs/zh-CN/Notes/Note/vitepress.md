# 使用 Vitepress 构建文档

## 中文搜索

自带的 Minisearch 挺好的，就是不能中文分词。

### 解决方案一

将每一个汉字都视为一个单词。这样能搜，但是不准。

```ts
import { defineConfig } from 'vitepress';
import locales from './locales/index.mjs';

export default defineConfig({
	head: [['script', { src: '/script/search.js' }]],
	base: '/',
	cleanUrls: true,
	router: {
		prefetchLinks: true,
	},
	themeConfig: {
		externalLinkIcon: true,
		socialLinks: [{ link: 'https://github.com/LEAWIND', icon: 'github' }],
		search: {
			provider: 'local',
			options: {
				miniSearch: {
					options: {
						// 处理短语
						// 将所有汉字视为独立的单词
						processTerm: term => {
							term = term
								.toLowerCase()
								.replace(/([\u4e00-\u9fff])/g, '$1 ') // 在所有中文字符后插入空格
								.trim()
								.replace(/\s+/g, ' ');
							const terms = term.split(' ');
							return terms.length === 1 ? term : terms;
						},
					},
					searchOptions: {},
				},
			},
		},
	},
	locales: locales,
});
```

### 解决方案二
