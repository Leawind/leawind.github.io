import type { DefaultTheme } from 'vitepress/theme'
import { buildRewrites, buildSidebar, findNextLink } from './sidebar.ts'

function assertEquals(actual: unknown, expected: unknown): void {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    )
  }
}

function assertThrows(fn: () => unknown, expectedMessage: string): void {
  try {
    fn()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (!message.includes(expectedMessage)) {
      throw new Error(
        `Expected error containing ${JSON.stringify(expectedMessage)}, got ${
          JSON.stringify(message)
        }`,
      )
    }
    return
  }
  throw new Error(
    `Expected an error containing ${JSON.stringify(expectedMessage)}`,
  )
}

function withTempDocs(
  files: Record<string, string>,
  run: (root: string) => void,
): void {
  const root = Deno.makeTempDirSync({ prefix: 'vitepress-sidebar-' })
  try {
    for (const [relativePath, content] of Object.entries(files)) {
      const file = `${root}/${relativePath}`
      Deno.mkdirSync(file.slice(0, file.lastIndexOf('/')), { recursive: true })
      Deno.writeTextFileSync(file, content)
    }
    run(root)
  } finally {
    Deno.removeSync(root, { recursive: true })
  }
}

function assertPage(
  actual: ReturnType<typeof findNextLink>,
  expected: { text: string; link: string } | undefined,
): void {
  assertEquals(actual, expected)
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

Deno.test('sorts pages deterministically and ignores non-Markdown files', () => {
  withTempDocs(
    {
      'docs/zh_cn/guide/index.md': '---\ntitle: Guide\n---\nOverview',
      'docs/zh_cn/guide/10-first.md': '---\ntitle: First\n---',
      'docs/zh_cn/guide/10-also.md': '---\ntitle: Also\n---',
      'docs/zh_cn/guide/20-second.md': '---\ntitle: Second\n---',
      'docs/zh_cn/guide/zeta.md': '---\ntitle: Zeta\n---',
      'docs/zh_cn/guide/alpha.md': '---\ntitle: Alpha\n---',
      'docs/zh_cn/guide/image.png': 'not an image',
    },
    (root) => {
      const sidebar = buildSidebar({
        dir: `${root}/docs/zh_cn/guide`,
        base: `${root}/docs`,
      })
      assertEquals(
        sidebar[0].items?.map((item) => item.text),
        ['Also', 'First', 'Second', 'Alpha', 'Zeta'],
      )
    },
  )
})

Deno.test('rewrites only Markdown documents', () => {
  withTempDocs(
    {
      'docs/zh_cn/index.md': '---\ntitle: Home\n---',
      'docs/zh_cn/10-guide/index.md': '---\ntitle: Guide\n---',
      'docs/zh_cn/10-guide/20-start.md': '---\ntitle: Start\n---',
      'docs/zh_cn/10-guide/image.png': 'not an image',
    },
    (root) => {
      const rewrites = buildRewrites(`${root}/docs`, ['zh_cn'])
      assertEquals(
        Object.fromEntries(Object.entries(rewrites).sort()),
        {
          'zh_cn/10-guide/20-start.md': 'zh_cn/guide/start.md',
          'zh_cn/10-guide/index.md': 'zh_cn/guide/index.md',
        },
      )
    },
  )
})

Deno.test('reports conflicting public document paths without exiting', () => {
  withTempDocs(
    {
      'docs/zh_cn/guide/10-start.md': '---\ntitle: First\n---',
      'docs/zh_cn/guide/20-start.md': '---\ntitle: Second\n---',
    },
    (root) => {
      assertThrows(
        () => buildRewrites(`${root}/docs`, ['zh_cn']),
        '10-start.md, 20-start.md',
      )
    },
  )
})

Deno.test('fails the build when frontmatter is malformed', () => {
  withTempDocs(
    {
      'docs/zh_cn/guide/index.md': '---\ntitle: [\n---',
    },
    (root) => {
      assertThrows(
        () =>
          buildSidebar({
            dir: `${root}/docs/zh_cn/guide`,
            base: `${root}/docs`,
          }),
        '无法解析 Markdown frontmatter',
      )
    },
  )
})
