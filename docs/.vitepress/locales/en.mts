import { buildSidebar } from "../builders.mts";

export default {
	label: 'English',
	lang: 'en',
	title: "Leawind's Doc",
	titleTemplate: ":title | Leawind's Doc",
	description: "My static website build by vitepress",
	themeConfig: {
		nav: [
			{
				text: '🌐Projects',
				items: [
					{ text: "Leawind's Third Person", link: 'https://leawind.github.io/Third-Person/en-US/' },
					{ text: 'MCAFS', link: '/en/mcafs/' },
				],
			},
			{ text: '💰Donate', link: '/en/donate' },
		],
		sidebar: {
		},
		footer: {
			message: '<a href=/en/donate>💰Donate</a> <br> This doc is build by <a href=https://vitepress.dev>vitepress</a>',
			copyright: 'Copyright © 2024 Leawind',
		},
		editLink: {
			pattern: 'https://github.com/LEAWIND/leawind.github.io/edit/main/docs/:path',
			text: 'Edit this page on Github',
		},
		lastUpdated: { text: "Last updated", },
	},
};
