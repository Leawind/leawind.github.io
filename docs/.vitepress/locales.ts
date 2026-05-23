import { defineLocale } from './utils/locale.ts'

export default {
  zh_cn: defineLocale({
    lang: 'zh_cn',
    translation: {
      label: '简体中文',
      title: 'Leawind的文档',
      description: 'Leawind的文档站',
      themeConfig: {
        nav: [
          { text: '🏠首页', link: '/zh_cn/' },
          { text: '💰捐赠', link: '/zh_cn/donate' },
          {
            text: 'Minecraft',
            items: [
              { text: 'SystemStorageLib', link: '/zh_cn/SystemStorageLib' },
              {
                text: 'Leawind的第三人称',
                link: 'https://leawind.github.io/Third-Person/zh-CN/?autolang',
              },
            ],
          },
          {
            text: '📦',
            items: [
              {
                text: 'Docs-template',
                link: 'https://github.com/LEAWIND/docs-template',
              },
            ],
          },
        ],
        editLink: {
          text: '在 Github 上编辑此页',
        },
        lastUpdated: { text: '上次更新' },
        search: {
          translations: {
            button: {
              buttonText: '搜索',
              buttonAriaLabel: '搜索',
            },
            modal: {
              displayDetails: '显示详细列表',
              resetButtonTitle: '重置搜索',
              backButtonTitle: '关闭搜索',
              noResultsText: '没有结果',
              footer: {
                selectText: '选择',
                selectKeyAriaLabel: '输入',
                navigateText: '导航',
                navigateUpKeyAriaLabel: '上箭头',
                navigateDownKeyAriaLabel: '下箭头',
                closeText: '关闭',
                closeKeyAriaLabel: 'Esc',
              },
            },
          },
        },
      },
    },
  }),
  en_us: defineLocale({
    lang: 'en_us',
    translation: {
      label: 'English',
      title: "Leawind's Docs",
      description: "Leawind's documentation site",
      themeConfig: {
        nav: [
          { text: '🏠Home', link: '/en_us/' },
          { text: '💰Donate', link: '/en_us/donate' },
          {
            text: 'Minecraft',
            items: [
              { text: 'SystemStorageLib', link: '/en_us/SystemStorageLib' },
              {
                text: "Leawind's Third-Person",
                link: 'https://leawind.github.io/Third-Person/zh-CN/?autolang',
              },
            ],
          },
          {
            text: '📦',
            items: [
              {
                text: 'Docs-template',
                link: 'https://github.com/LEAWIND/docs-template',
              },
            ],
          },
        ],
        editLink: {
          text: 'Edit this page on GitHub',
        },
        lastUpdated: { text: 'Last updated' },
        search: {
          translations: {
            button: {
              buttonText: 'Search',
              buttonAriaLabel: 'Search',
            },
            modal: {
              displayDetails: 'Display detailed list',
              resetButtonTitle: 'Reset search',
              backButtonTitle: 'Close search',
              noResultsText: 'No results',
              footer: {
                selectText: 'Select',
                selectKeyAriaLabel: 'Enter',
                navigateText: 'Navigate',
                navigateUpKeyAriaLabel: 'Up arrow',
                navigateDownKeyAriaLabel: 'Down arrow',
                closeText: 'Close',
                closeKeyAriaLabel: 'Esc',
              },
            },
          },
        },
      },
    },
  }),
}
