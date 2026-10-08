# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`@xh/package-template` is a deliberately minimal stub package that serves as a template for custom
packages used to share code and styles across a group of [Hoist](https://github.com/xh/hoist-react)
applications. It is published to npm as a working example; downstream organizations clone its
structure to share their own internal code.

The `desktop/cmp/custompanel/` component is sample content, not a real feature. It exists to
demonstrate the package layout and to be consumed by Toolbox
([repo](https://github.com/xh/toolbox) | [demo](https://toolbox.xh.io/app/other/customPackage)),
which is the only app that uses this package.

## Commands

```bash
pnpm lint          # lint:all - runs all four below
pnpm lint:code     # eslint over .js/.jsx/.ts/.tsx (flat config)
pnpm lint:styles   # stylelint over .scss/.sass/.css
pnpm lint:format   # prettier --check over the repo
pnpm lint:types    # tsc (no emit) - type-checks against installed @xh/hoist
```

The package manager is pnpm, pinned via `packageManager` in `package.json` (use Corepack). pnpm
settings live in `pnpm-workspace.yaml`. Do not add a `yarn.lock` or `package-lock.json`.

For Hoist API and docs lookups, use the `hoist-react` MCP server (`.mcp.json`). It runs from the
installed `@xh/hoist`, so it needs `pnpm install` first and a restart after a Hoist upgrade. The
CLI equivalents read the installed version on every call:
`node node_modules/@xh/hoist/bin/hoist-docs.mjs` and `.../hoist-ts.mjs`.

There is no build or bundle step (see "Architecture" below). A `pre-commit` hook (`.husky/pre-commit`)
runs `lint-staged` (prettier + eslint/stylelint on staged files) and `tsc` when relevant files change.

`pnpm install` and the CI/release workflows require `FONTAWESOME_PACKAGE_TOKEN` in `.npmrc`, because
installing `@xh/hoist` (a devDep, used only so `tsc` can resolve real types) transitively pulls
`@fortawesome/*` from a private registry. Toolbox is the only consumer and already has this token.

## Architecture

The key idea: this package is published to npm **unprocessed and untranspiled**. There is no
compilation here. Source `.ts`/`.scss` files ship as-is, and the consuming Hoist app transpiles them
through its own Rsbuild/SWC pipeline alongside Hoist and app code (Toolbox does this via
`extraIncludePaths` in its `rsbuild.config.mjs`). This mirrors how `hoist-react` itself is published.
Consequently `@xh/hoist`, `react`, and `react-dom` are `peerDependencies`, resolved by the host app.
The `files` field in `package.json` whitelists what gets published. Add any new top-level source
directory (e.g. `mobile`) there.

`@xh/hoist` also appears in `devDependencies` purely so local `tsc`/IDE type-checking resolves
against the real library. It is never bundled or shipped. `tsc` compiles Hoist's `.ts` source, so
packages Hoist imports types from (`ag-grid-community`, `ag-grid-react`, `@types/lodash`,
`type-fest`) are also devDependencies. Apps get these from their own deps or `@xh/hoist-dev-utils`.
This package does not depend on dev-utils, as it has no build. It uses `@xh/eslint-config` directly.

Hoist v88+ uses TC39 decorators. `tsconfig.json` must NOT set `experimentalDecorators`. Observable
fields need `accessor` (`@bindable accessor foo = null`), with no `makeObservable(this)` call.

Components follow the standard Hoist component-plus-model pattern, written as TypeScript:
- `CustomPanel.ts` - the view, `hoistCmp.withFactory<CustomPanelProps>(...)` paired with its model via
  `creates(CustomPanelModel)`. Props are a typed interface extending `HoistProps<CustomPanelModel>`
  and `BoxProps`. Imports `@xh/hoist/desktop/register` and its own `.scss`.
- `CustomPanelModel.ts` - a `HoistModel` subclass holding state and logic.
- `index.ts` - re-exports the component and model (`export * from ...`).

Modern Hoist components do NOT use React `propTypes` (typed props replace them). Source files carry
no per-file copyright header, matching this repo's minimal convention (the "belongs to Hoist" header
in hoist-react is specific to that repo - do not copy it here).

Styling uses Hoist CSS variables (e.g. `var(--xh-orange)`, `var(--xh-pad-px)`) scoped under the
component's `className` (`xh-custom-panel`).

## Conventions

Formatting is owned by Prettier (`.prettierrc.json`): 4-space indent, single quotes, semicolons,
100-char width, no trailing commas, `bracketSpacing: false`. ESLint uses the flat-config
`@xh/eslint-config` (resolved transitively via `@xh/hoist-dev-utils`) plus `eslint-config-prettier`.
SCSS/JSON use 2-space indent.

## CI / Publishing

GitHub Actions:
- `.github/workflows/ci.yml` - format-check + lint + type-check on PRs and pushes to `main`.
- `.github/workflows/deployRelease.yml` - manual dispatch; lints, sets the version, `pnpm publish`,
  then tags the commit and creates a GitHub release. Uses shared composite actions from
  `xh/hoist-dev-utils` (pinned by SHA, bumped by Dependabot). The tag points at a commit whose
  `package.json` still shows the prior version; the release version is not committed back.

Required secrets: `FONTAWESOME_PACKAGE_TOKEN` and `NPM_TOKEN` (plus the same FA token in Dependabot
secrets).
