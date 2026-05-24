import log from '@leawind/inventory/log'
import { Path, type PathLike } from '@leawind/inventory/fs'
import * as fs from '@leawind/inventory/fs'
import * as frontMatter from 'jsr:@std/front-matter@1.0.9'
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
  return num(a.name) - num(b.name)
}

/**
 * 收集目录下去掉前缀后可能冲突的文件。
 * @returns Map<baseName, originalNames[]>
 */
function collectConflicts(entries: Path[]): Map<string, string[]> {
  const conflicts = new Map<string, string[]>()
  for (const entry of entries) {
    if (!entry.isFileSync() || entry.name === 'index.md') { continue }
    const base = stripPrefix(entry.nameNoExt)
    if (!conflicts.has(base)) { conflicts.set(base, []) }
    conflicts.get(base)!.push(entry.name)
  }
  return conflicts
}

/** 检查冲突并打印错误，返回是否有冲突 */
function checkConflicts(conflicts: Map<string, string[]>): boolean {
  let hasConflict = false
  for (const [base, files] of conflicts) {
    if (files.length > 1) {
      log.error(`文件名冲突: ${files.join(', ')} 去掉前缀后都映射到 "${base}"`)
      hasConflict = true
    }
  }
  return hasConflict
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
  if (checkConflicts(collectConflicts(entries))) { Deno.exit(1) }

  return {
    text: dirTitle,
    collapsed: true,
    ...(dirHasBody ? { link: getLink(d, b) } : {}),
    items: entries
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
    log.error(`Error parsing file ${file}: ${e}`)
    return { attrs: {}, body: '' }
  }
}

function getLink(file: PathLike, base: PathLike): string {
  return '/' + stripPath(file, base)
    .replace(/\.md$/g, '')
    .replace(/\.html?$/g, '')
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
  let hasConflict = false

  for (const lang of langs) {
    scanDir(fs.P`${basePath}/${lang}`)
  }

  if (hasConflict) { Deno.exit(1) }
  return rewrites

  function scanDir(dir: Path): void {
    const entries = dir.listSync()
    if (checkConflicts(collectConflicts(entries))) { hasConflict = true }

    for (const entry of entries) {
      if (entry.isDirectorySync()) {
        scanDir(entry)
        continue
      }

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
