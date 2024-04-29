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

使用分词器

```sh
npm install nodejieba
```

这样处理应该就可以了

```ts
processTerm: term => {
	term = term.toLowerCase();
	if (/[\u4e00-\u9fff]/.test(term)) {
		term = term.replace(/([\u4e00-\u9fff]+)/g, ' $1 ').trim();
		let terms = term.split(/\s+/g);
		const termSet = new Set<string>();
		for (const t of terms) {
			if (/[\u4e00-\u9fff]/.test(t)) {
				jieba.cut(t).forEach(f => termSet.add(f));
			} else {
				termSet.add(t);
			}
		}
		terms = [...termSet];
		console.warn(`[${term}] ${terms.join('|')}`);
		return terms.length === 1 ? terms[0] : terms;
	} else {
		return term;
	}
},
```

但是并不可以。
