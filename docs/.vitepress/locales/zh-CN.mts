import { buildSidebar } from "../builders.mts";

export default {
	label: '简体中文',
	lang: 'zh-CN',
	title: "Leawind的文档",
	titleTemplate: ":title | Leawind的文档",
	description: "用 vitepress 构建的静态网站",
	themeConfig: {
		nav: [
			{
				text: '🌐项目',
				items: [
					{ text: "Leawind的第三人称", link: '/zh-CN/Third-Person/' },
					{ text: 'MCAFS', link: '/zh-CN/mcafs/' },
				]
			},
			{ text: '笔记', link: '/zh-CN/Notes/' },
			{ text: '杂项', link: '/zh-CN/misc/' },
			{ text: '💰捐赠', link: '/zh-CN/donate' },
		],
		sidebar: {
			'/zh-CN/Third-Person': [
				{
					text: "Leawind的第三人称",
					link: '.',
					items: [
						{ text: "🗒简介", link: './intro', },
						{ text: "📖详细特性", link: './details', },
						{ text: "📝更新日志", link: './changelog', },
						{ text: "💬常见问题", link: './faq', },
						{ text: "🖼图册", link: './gallery', },
						{
							text: "其他",
							items: [
								{ text: '🏅徽章', link: './badges' },
							]
						},
					]
				},
			],
			'/zh-CN/Notes': buildSidebar('/zh-CN/Notes', '笔记'),
			'/zh-CN/misc': buildSidebar('/zh-CN/misc', '杂项'),
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
