export default {
	label: 'English',
	lang: 'en',
	title: "Leawind's Doc",
	titleTemplate: ":title | Leawind's Doc",
	description: "My static website build by vitepress",
	themeConfig: {
		nav: [
			{
				text: 'Projects',
				items: [
					{ text: "Leawind's Third Person", link: '/en/Third-Person/' },
					{ text: 'MCAFS', link: '/en/mcafs/' },
				]
			},
			{ text: 'Misc', link: '/misc/' },
		],
		sidebar: {
			'/en/Third-Person': [
				{ text: "Leawind's Third Person", link: '.', },
				{ text: "🗒Introduction", link: './intro', },
				{ text: "⚙️Configuration", link: './configuration', },
				{ text: "📝Changelog", link: './changelog', },
				{ text: "💬FAQ", link: './faq', },
				{ text: "🖼Gallery", link: './gallery', },
			]
		},
		footer: {
			message: '<a href=/en/donate>💰Donate</a>',
			copyright: 'Copyright © 2024 Leawind',
		},
		editLink: {
			pattern: 'https://github.com/LEAWIND/leawind.github.io/edit/main/docs/:path',
			text: 'Edit this page on Github',
		},
		lastUpdated: { text: "Last updated", },
	},
};
