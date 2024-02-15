export default {
	label: '简体中文',
	lang: 'zh-CN',
	title: "Leawind的文档",
	titleTemplate: ":title | Leawind的文档",
	description: "用 vitepress 构建的静态网站",
	themeConfig: {
		nav: [
			{
				text: '项目',
				items: [
					{ text: "Leawind的第三人称", link: '/Third-Person/' },
					{ text: 'MCAFS', link: '/mcafs/' },
				]
			},
			{ text: '杂项', link: '/misc/' },
		],
		sidebar: {
			'/Third-Person': [
				{ text: "🗒简介", link: './intro', },
				{ text: "⚙️模组配置", link: './configuration', },
				{ text: "📝更新日志", link: './changelog', },
				{ text: "💬常见问题", link: './faq', },
				{ text: "🖼图册", link: './gallery', },
			]
		},
		footer: {
			message: '<a href=/donate>💰捐赠</a>',
			copyright: 'Copyright © 2024 Leawind',
		},
		editLink: {
			pattern: 'https://github.com/LEAWIND/leawind.github.io/edit/main/docs/:path',
			text: '在 Github 上编辑此页',
		},
		lastUpdated: { text: "上次更新", },
	},
};
