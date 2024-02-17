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
					{ text: "Leawind的第三人称", link: '/zh-CN/Third-Person/' },
					{ text: 'MCAFS', link: '/zh-CN/mcafs/' },
				]
			},
			{ text: '笔记', link: '/zh-CN/Notes/' },
			{ text: '杂项', link: '/zh-CN/misc/' },
		],
		sidebar: {
			'/zh-CN/Third-Person': [
				{ text: "Leawind的第三人称", link: '.', },
				{ text: "🗒简介", link: './intro', },
				{ text: "⚙️模组配置", link: './configuration', },
				{ text: "📝更新日志", link: './changelog', },
				{ text: "💬常见问题", link: './faq', },
				{ text: "🖼图册", link: './gallery', },
			],
			'/zh-CN/Notes': [
				{
					text: '笔记', link: '.',
					items: [
						{ text: 'Node 环境安装', link: './node_install' },
						{ text: 'Verdaccio 安装', link: './verdaccio_install' },
						{ text: 'Aircrack-ng', link: './aircrack-ng' },
					]
				},
			],
			'/zh-CN/misc': [
			],
		},
		footer: {
			message: '<a href=/zh-CN/donate>💰捐赠</a> <br> 本文档使用 <a href=https://vitepress.dev>vitepress</a> 构建',
			copyright: 'Copyright © 2024 Leawind',
		},
		editLink: {
			pattern: 'https://github.com/LEAWIND/leawind.github.io/edit/main/docs/:path',
			text: '在 Github 上编辑此页',
		},
		lastUpdated: { text: "上次更新", },
	},
};
