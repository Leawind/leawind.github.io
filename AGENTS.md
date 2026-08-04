# 仓库指南

## 项目结构与模块组织

本仓库使用 VitePress 和 Deno 构建文档网站。
文档内容位于 `docs/`，其中 `docs/en_us/` 和 `docs/zh_cn/` 分别保存英文与中文文档，`docs/public/` 保存图片、GIF 和图标等静态资源。
VitePress 配置、自定义主题组件、侧边栏生成逻辑和测试位于 `docs/.vitepress/`；
可复用的导航与元数据逻辑应放在其中的 `server/` 或 `shared/` 目录，避免复制到具体页面中。

## 侧边栏生成规则

`buildSidebars` 扫描 `docs/<语言>/` 的直接子目录，为每个子目录生成一份独立的侧边栏配置。`buildSidebar` 递归读取其中的子目录和 `.md` 文件；板块根目录中的普通页面保留在根分组内，根目录的直接子目录则被提升为与根分组并列的顶层分组，更深层的目录继续保持嵌套。

- `index.md` 不会作为子项出现。它的 frontmatter `title` 用作目录标题；没有该标题时，使用去掉数字前缀的目录名。普通页面同样优先使用 frontmatter `title`，否则使用去掉数字前缀和扩展名的文件名。
- 板块根分组始终链接到该目录首页并默认展开。其他目录只有在其 `index.md` 的正文非空时才带有目录首页链接，并默认折叠。
- 同一目录内的子目录和 Markdown 页面先按名称开头的“数字 + `-`”前缀数值升序排列；前缀数值相同时按原名称排序，没有前缀的项目排在最后。根目录排序后还会执行上述顶层分组提升。
- 公开链接会移除每个路径片段的数字前缀以及文件扩展名，例如 `docs/zh_cn/Perspective-API/20-developer-guide/00-start.md` 对应 `/zh_cn/Perspective-API/developer-guide/start`。重写规则仅扫描 `.md` 文件。
- 同一目录内，两个非 `index.md` 的 Markdown 文件若在去掉数字前缀后同名，构建会因公开路径冲突而失败；侧边栏读取的 frontmatter 无法解析时也会终止构建。其他文件不会出现在侧边栏中。

## 构建、测试与开发命令

- `deno task docs:dev`：启动本地 VitePress 开发服务器。
- `deno task docs:build`：将生产站点构建到 `docs/.vitepress/dist`。
- `deno task docs:preview`：启动构建结果的本地预览。
- `deno task check`：依次执行格式检查、Lint、类型检查、单元测试和生产构建；提交文档改动前应运行此命令。
- `deno task check:test`：使用测试所需的读写权限运行 VitePress 测试。

## 编码风格与命名约定

以 Deno 格式化规则为准：使用两个空格缩进、LF 换行、单引号、不使用分号，TypeScript 行宽目标为 80 列；
必要时对修改过的受支持文件运行 `deno fmt`。
Markdown 标题和路径应与相邻页面保持一致。
页面文件名使用小写和连字符，需排序的页面使用两位数字前缀，例如 `10-player-guide.md`；
除非用户明确要求，不要求保持英文与中文文档的目录结构同步。

## 测试

测试使用 Deno，目前主要位于 `docs/.vitepress/server/sidebar_test.ts`。修改侧边栏排序、URL 生成、frontmatter 处理或页面导航时，应添加或更新针对性测试。测试名称应描述可观察的行为；项目没有单独的覆盖率门槛，完整的 `deno task check` 是必要的验证步骤。

## 提交

提交使用简洁的 Conventional Commit 风格主题，例如 `docs: add luau`、`fix: follow sidebar order for next-page links` 和 `ci: retry and cache Deno dependency installs`。
使用 `docs`、`fix`、`test`、`build`、`ci` 或 `style` 等合适类型，后接明确的祈使句摘要；
每次提交应只处理一个主题。
