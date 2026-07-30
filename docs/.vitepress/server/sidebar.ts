import { Path, type PathLike } from '@leawind/inventory/fs'
import * as fs from '@leawind/inventory/fs'
import * as frontMatter from '@std/front-matter'
import { DefaultTheme } from 'vitepress/theme'

/** 去掉路径片段中的 `NN-` 序号前缀 */
function stripPrefix(segment: string): string {
  return segment.replace(/^\d+-/, '')
}

/** 对路径各段去掉序号前缀，返回 join 后的相对路径 */
function stripPath(file: PathLike, base: PathLike): string {
  return Path.from(file).relative(base)
    .toString()
    .replace(/(^\/*)|(\/*$)/g, '')
    .split('/')
    .map(stripPrefix)
    .join('/')
}

/** stripPath 后是否与原始路径不同（即有前缀） */
function pathHasPrefix(file: PathLike, base: PathLike): boolean {
  const raw = Path.from(file).relative(base)
    .toString()
    .replace(/(^\/*)|(\/*$)/g, '')
    .split('/')
    .join('/')
  return stripPath(file, base) !== raw
}

/** 按文件名中的 `NN-` 前缀数值排序 */
function sortByPrefix(a: { name: string }, b: { name: string }): number {
  const num = (name: string) => {
    const match = name.match(/^(\d+)-/)
    return match ? parseInt(match[1], 10) : Infinity
  }
  const aPrefix = num(a.name)
  const bPrefix = num(b.name)
  if (aPrefix !== bPrefix) { return aPrefix - bPrefix }
  return a.name < b.name ? -1 : a.name > b.name ? 1 : 0
}

function isMarkdownFile(entry: Path): boolean {
  return entry.isFileSync() && entry.name.endsWith('.md')
}

/**
 * 收集目录下去掉前缀后可能冲突的文件。
 * @returns Map<baseName, originalNames[]>
 */
function collectConflicts(entries: Path[]): Map<string, string[]> {
  const conflicts = new Map<string, string[]>()
  for (const entry of entries) {
    if (!isMarkdownFile(entry) || entry.name === 'index.md') { continue }
    const base = stripPrefix(entry.nameNoExt)
    if (!conflicts.has(base)) { conflicts.set(base, []) }
    conflicts.get(base)!.push(entry.name)
  }
  return conflicts
}

/** 检查冲突并抛出包含所有冲突文件的错误 */
function assertNoConflicts(
  dir: PathLike,
  conflicts: Map<string, string[]>,
): void {
  const messages: string[] = []
  for (const [base, files] of conflicts) {
    if (files.length > 1) {
      messages.push(
        `${files.join(', ')} 去掉前缀后都映射到 "${base}"`,
      )
    }
  }
  if (messages.length > 0) {
    throw new Error(`文件名冲突 (${dir}): ${messages.join('; ')}`)
  }
}

// ---- Sidebar ----

export function buildSidebars(
  base: PathLike,
  lang: string,
): DefaultTheme.SidebarMulti {
  const sidebars: DefaultTheme.SidebarMulti = {}
  for (const dir of fs.P`${base}/${lang}`.listSync()) {
    if (dir.isDirectorySync()) {
      sidebars[`/${lang}/${dir.name}`] = buildSidebar({ dir, base })
    }
  }
  return sidebars
}

type Options = { dir: PathLike; base?: PathLike }
const DEFAULT_BASE = 'docs'

export function buildSidebar(options: Options): DefaultTheme.SidebarItem[] {
  const { dir, base = DEFAULT_BASE } = options
  const sidebar: DefaultTheme.SidebarItem = {
    ...buildSidebarRecursive({ dir, base }),
    collapsed: false,
    link: getLink(dir, base),
  }
  // 将嵌套的子分组提升到顶层
  const allItems = sidebar.items ?? []
  const groups = allItems.filter((it) => 'items' in it)
  sidebar.items = allItems.filter((it) => !('items' in it))
  return [sidebar, ...groups] as DefaultTheme.SidebarItem[]
}

function buildSidebarRecursive(
  { dir, base = DEFAULT_BASE }: Options,
): DefaultTheme.SidebarItem {
  const d = Path.from(dir)
  const b = Path.from(base)

  const indexInfo = parseFile(d.join('index.md'))
  const dirTitle = indexInfo.title || d.nameNoExt.replace(/^\d+-/, '')
  const dirHasBody = indexInfo.body.trim() !== ''

  const entries = d.listSync()
  assertNoConflicts(d, collectConflicts(entries))

  return {
    text: dirTitle,
    collapsed: true,
    ...(dirHasBody ? { link: getLink(d, b) } : {}),
    items: entries
      .filter((entry) => entry.isDirectorySync() || isMarkdownFile(entry))
      .sort(sortByPrefix)
      .map((entry) => {
        if (entry.isFileSync()) {
          if (entry.name === 'index.md') { return undefined }
          return {
            text: parseFile(entry).title
              || entry.nameNoExt.replace(/^\d+-/, ''),
            link: getLink(entry, b),
          }
        }
        return buildSidebarRecursive({ dir: entry, base: b })
      })
      .filter((item): item is NonNullable<typeof item> => item !== undefined),
  }
}

export function parseFile(file: PathLike): {
  title?: string
  attrs: Record<string, unknown>
  body: string
} {
  const path = Path.from(file)
  if (!path.existsSync()) { return { attrs: {}, body: '' } }

  try {
    const fm = frontMatter.extractYaml(path.readTextSync())
    const attrs = fm.attrs as Record<string, unknown>
    return {
      ...('title' in attrs ? { title: attrs.title as string } : {}),
      attrs,
      body: fm.body.trim(),
    }
  } catch (e) {
    throw new Error(`无法解析 Markdown frontmatter: ${file}`, { cause: e })
  }
}

function getLink(file: PathLike, base: PathLike): string {
  return '/' + stripPath(file, base)
    .replace(/\.md$/g, '')
    .replace(/\.html?$/g, '')
}

/** 按侧边栏的深度优先阅读顺序查找指定页面的下一页。 */
export function findNextLink(
  sidebar: DefaultTheme.SidebarItem[],
  relativePath: string,
): { text: string; link: string } | undefined {
  const pages: { text: string; link: string }[] = []
  collectPages(sidebar)

  const currentIndex = pages.findIndex((page) =>
    normalizePagePath(page.link) === normalizePagePath(relativePath)
  )
  return currentIndex >= 0 ? pages[currentIndex + 1] : undefined

  function collectPages(items: DefaultTheme.SidebarItem[]): void {
    for (const item of items) {
      if (item.link && item.text) {
        pages.push({ text: item.text, link: item.link })
      }
      if (item.items) {
        collectPages(item.items)
      }
    }
  }
}

/** 将源文件路径和公开页面链接统一成无序号前缀的页面路径。 */
function normalizePagePath(path: string): string {
  const segments = path
    .replace(/\.md$/, '')
    .replace(/(^|\/)index$/, '$1')
    .split('/')
    .filter(Boolean)
    .map(stripPrefix)
  return '/' + segments.join('/')
}

// ---- Rewrites ----

/**
 * 扫描语言目录下所有 .md 文件，生成 VitePress rewrites 映射表。
 * 同时检测去掉前缀后 base-name 重复的文件，发现冲突则报错退出。
 */
export function buildRewrites(
  base: PathLike,
  langs: string[],
): Record<string, string> {
  const rewrites: Record<string, string> = {}
  const basePath = Path.from(base)

  for (const lang of langs) {
    scanDir(fs.P`${basePath}/${lang}`)
  }

  return rewrites

  function scanDir(dir: Path): void {
    const entries = dir.listSync()
    assertNoConflicts(dir, collectConflicts(entries))

    for (const entry of entries) {
      if (entry.isDirectorySync()) {
        scanDir(entry)
        continue
      }
      if (!isMarkdownFile(entry)) { continue }

      const relativePath = entry.relative(basePath).toString()
      const rewritten = stripPath(entry, basePath)

      if (entry.name === 'index.md') {
        if (pathHasPrefix(dir, basePath)) { rewrites[relativePath] = rewritten }
        continue
      }

      rewrites[relativePath] = rewritten
    }
  }
}
