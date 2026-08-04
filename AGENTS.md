# Repository Guidelines

## Project Structure & Module Organization

This repository builds Leawind's documentation site with VitePress and Deno.
Content lives in `docs/`: language trees use `docs/en_us/` and `docs/zh_cn/`,
while `docs/public/` contains static images, GIFs, and icons. VitePress
configuration, custom theme components, sidebar generation, and tests live in
`docs/.vitepress/`. Keep reusable navigation and metadata logic in its
`server/` and `shared/` directories rather than duplicating it in pages.

Numeric filename or directory prefixes control sidebar order. They are omitted
from generated URLs: `20-developer-guide/00-start.md` routes below
`/20-developer-guide/start`.

## Build, Test, and Development Commands

- `deno task docs:dev` starts the local VitePress development server.
- `deno task docs:build` produces the production site in `docs/.vitepress/dist`.
- `deno task docs:preview` serves the built output for a local check.
- `deno task check` runs formatting, linting, type checks, unit tests, and a
  production build. Run it before proposing a completed documentation change.
- `deno task check:test` runs the VitePress tests with the required read/write
  permissions.

## Coding Style & Naming Conventions

Use Deno formatting as the source of truth: two spaces, LF line endings,
single quotes, no semicolons, and an 80-column target for TypeScript. Run
`deno fmt` on edited supported files when needed. Write Markdown headings and
paths consistently with nearby pages. Use lowercase, hyphenated page names;
prefix ordered pages with two digits such as `10-player-guide.md`. Maintain
parallel English and Chinese documentation structure when the topic is shared.

## Testing Guidelines

Tests are Deno tests, currently concentrated in
`docs/.vitepress/server/sidebar_test.ts`. Add or update a focused test whenever
changing sidebar ordering, URL generation, frontmatter handling, or navigation.
Test names should describe the observable behavior. There is no separate
coverage threshold; the full `deno task check` is the required validation.

## Commit & Pull Request Guidelines

Recent history follows concise Conventional Commit-style subjects, for example
`docs: add luau`, `fix: follow sidebar order for next-page links`, and
`ci: retry and cache Deno dependency installs`. Use an appropriate type such as
`docs`, `fix`, `test`, `build`, `ci`, or `style`, followed by a specific
imperative summary. Keep commits scoped to one concern.

Pull requests should explain the user-visible or tooling change, identify
affected language trees, and list validation performed. Include screenshots or
preview links for visual/theme changes, and link relevant issues when present.
