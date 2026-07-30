import type { DefaultTheme } from 'vitepress/theme'
import { findNextLink } from './sidebar.ts'

function assertPage(
  actual: ReturnType<typeof findNextLink>,
  expected: { text: string; link: string } | undefined,
): void {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    )
  }
}

const sidebar: DefaultTheme.SidebarItem[] = [
  { text: 'Perspective API', link: '/zh_cn/Perspective-API' },
  { text: '玩家指南', link: '/zh_cn/Perspective-API/player-guide' },
  {
    text: '开发者指南',
    link: '/zh_cn/Perspective-API/developer-guide',
    items: [
      {
        text: '约定',
        link: '/zh_cn/Perspective-API/developer-guide/convention',
        items: [
          {
            text: '旋转',
            link: '/zh_cn/Perspective-API/developer-guide/convention/rotation',
          },
        ],
      },
    ],
  },
]

Deno.test('finds the next group after a leaf group index', () => {
  assertPage(
    findNextLink(
      sidebar,
      'zh_cn/Perspective-API/10-player-guide/index.md',
    ),
    {
      text: '开发者指南',
      link: '/zh_cn/Perspective-API/developer-guide',
    },
  )
})

Deno.test('finds the first child after a group index', () => {
  assertPage(
    findNextLink(
      sidebar,
      'zh_cn/Perspective-API/20-developer-guide/index.md',
    ),
    {
      text: '约定',
      link: '/zh_cn/Perspective-API/developer-guide/convention',
    },
  )
})

Deno.test('finds nested pages with numeric ordering prefixes', () => {
  assertPage(
    findNextLink(
      sidebar,
      'zh_cn/Perspective-API/20-developer-guide/05-convention/index.md',
    ),
    {
      text: '旋转',
      link: '/zh_cn/Perspective-API/developer-guide/convention/rotation',
    },
  )
})
