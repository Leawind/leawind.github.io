import { LocaleConfig } from 'vitepress'
import { buildSidebars } from './sidebar.ts'
import { DefaultTheme } from 'vitepress'

export type LocaleConfigValue<ThemeConfig = any> = LocaleConfig<
  ThemeConfig
>[string]

/**
 * Nav item for a locale's navigation bar.
 */
export type NavItem =
  | { text: string; link: string }
  | { text: string; items: NavItem[] }

type Options = {
  base?: string
  lang: string
  translation: {
    label: string
    title: string
    description: string
    themeConfig: {
      nav: NavItem[]
      editLink: { text: string }
      lastUpdated: { text: string }
      /**
       * @see DefaultTheme.LocalSearchOptions.locales
       */
      search?: Partial<Omit<DefaultTheme.LocalSearchOptions, 'locales'>>
    }
  }
}

/**
 * Define a locale configuration for VitePress.
 *
 * Auto-generates sidebar from the locale's content directory structure.
 */
export function defineLocale(options: Options) {
  const opts = Object.assign({}, { base: 'docs' }, options)
  const t = opts.translation

  return {
    lang: opts.lang,
    label: t.label,
    title: t.title,
    titleTemplate: `:title | ${t.title}`,
    description: t.description,
    themeConfig: {
      nav: t.themeConfig.nav,

      sidebar: buildSidebars(opts.base, opts.lang),
      editLink: {
        pattern:
          'https://github.com/LEAWIND/leawind.github.io/edit/main/docs/:path',
        text: t.themeConfig.editLink.text,
      },

      search: {
        provider: 'local',
        options: {
          locales: {
            ...(t.themeConfig.search
              ? { [opts.lang]: t.themeConfig.search }
              : {}),
          },
        },
      },
      lastUpdated: { text: t.themeConfig.lastUpdated.text },
    },
  } satisfies LocaleConfigValue<DefaultTheme.Config>
}
