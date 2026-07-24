/**
 * All locale-related definitions — the single source of truth.
 *
 * Adding a new language: just add an entry to `locales`.
 * BCP47_MAP is auto-derived — no separate bcp47.ts needed.
 */

export type NavItem =
  | { text: string; link: string }
  | { text: string; items: NavItem[] }

export interface LocaleEntry {
  lang: string
  /** BCP 47 language tag (e.g. 'zh-CN', 'en-US') */
  bcp47: string
  label: string
  title: string
  description: string
  nav: NavItem[]
  editLinkText: string
  lastUpdatedText: string
  search?: Record<string, unknown>
}

const locales: Record<string, LocaleEntry> = {
  zh_cn: {
    lang: 'zh_cn',
    bcp47: 'zh-CN',
    label: '简体中文 (中国大陆)',
    title: 'Leawind的文档',
    description: '',
    nav: [
      { text: '💰捐赠', link: '/zh_cn/donate' },
      {
        text: 'Minecraft 模组',
        items: [
          { text: '视角 API', link: '/zh_cn/Perspective-API' },
          { text: '视角 API 演示', link: '/zh_cn/Perspective-API/example' },
          { text: 'SystemStorageLib', link: '/zh_cn/SystemStorageLib' },
          {
            text: 'Leawind的第三人称',
            link: 'https://leawind.github.io/Third-Person/zh_cn/?autolang',
          },
        ],
      },
      {
        text: '其他',
        items: [
          { text: 'modstitch', link: '/zh_cn/Others/modstitch' },
        ],
      },
      {
        text: '🗑️',
        items: [
          {
            text: 'Docs-template',
            link: 'https://github.com/Leawind/docs-template',
          },
          { text: 'Git-Parcel', link: 'https://github.com/Git-Parcel/Mod' },
        ],
      },
    ],
    editLinkText: '在 Github 上编辑此页',
    lastUpdatedText: '上次更新',
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
  en_us: {
    lang: 'en_us',
    bcp47: 'en-US',
    label: 'English (US)',
    title: "Leawind's Docs",
    description: "Leawind's documentation site",
    nav: [
      { text: '💰Donate', link: '/en_us/donate' },
      {
        text: 'Minecraft Mods',
        items: [
          { text: 'Perspective API', link: '/en_us/Perspective-API' },
          {
            text: 'Perspective API Demo',
            link: '/en_us/Perspective-API/example',
          },
          { text: 'SystemStorageLib', link: '/en_us/SystemStorageLib' },
          {
            text: "Leawind's Third-Person",
            link: 'https://leawind.github.io/Third-Person/en_us/?autolang',
          },
        ],
      },
      {
        text: '🗑️',
        items: [
          {
            text: 'Docs-template',
            link: 'https://github.com/Leawind/docs-template',
          },
          { text: 'Git-Parcel', link: 'https://github.com/Git-Parcel/Mod' },
        ],
      },
    ],
    editLinkText: 'Edit this page on GitHub',
    lastUpdatedText: 'Last updated',
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
}

export default locales
