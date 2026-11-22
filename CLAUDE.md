# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`@xh/package-template` is a deliberately minimal template for a Hoist companion package: an npm
package that shares code and styles across a group of [Hoist](https://github.com/xh/hoist-react)
apps. It is published to npm as a working example. Downstream organizations copy its structure to
share their own internal code. Keep it simple: each part of the setup should appear once, in its
smallest working form.

The `desktop/cmp/custompanel/` component is sample content, not a real feature. It exists to
demonstrate the package layout and to be consumed by Toolbox
([repo](https://github.com/xh/toolbox) | [demo](https://toolbox.xh.io/app/other/customPackage)),
which is the only app that uses this package.

`docs/package-structure.md` is the human and agent-facing explanation of the setup. Keep it in sync
when the setup changes.

## Commands

```bash
pnpm lint          # lint:all - runs the three below
pnpm lint:code     # eslint (flat config)
pnpm lint:styles   # stylelint over .scss/.sass/.css
pnpm lint:format   # prettier --check
pnpm typecheck     # tsc (no emit) - type-checks against the installed @xh/hoist
pnpm test          # vitest run - unit tests
pnpm build:docs    # build the Hoist Docs index into hoist-docs/ (gitignored); also run by prepack
```

The package manager is pnpm, pinned via `packageManager` in `package.json` (use Corepack). pnpm
settings live in `pnpm-workspace.yaml`. Do not add a `yarn.lock` or `package-lock.json`.

For Hoist API and docs lookups, use the `hoist-docs` MCP server (`.mcp.json`), from the
`@xh/hoist-docs` devDependency. It serves the installed `@xh/hoist`, so it needs `pnpm install`
first and a restart after a Hoist upgrade. Without MCP, read the docs under
`node_modules/@xh/hoist/docs/`.

There is no build or bundle step (see "Architecture" below). A `pre-commit` hook
(`.husky/pre-commit`) runs `lint-staged` (prettier + eslint/stylelint on staged files) and
`pnpm typecheck` when relevant files change.

`pnpm install` and the CI/release workflows require `FONTAWESOME_PACKAGE_TOKEN` in `.npmrc`, because
installing `@xh/hoist` (a devDep, for type-checking and tests) transitively pulls `@fortawesome/*`
from a private registry. Toolbox is the only consumer and already has this token.

## Architecture

The key idea: this package is published to npm **unprocessed and untranspiled**. Source `.ts`/`.scss`
files ship as-is, and the consuming Hoist app compiles them through its own Rsbuild/SWC pipeline
alongside Hoist and app code. This mirrors how `hoist-react` itself is published. Rsbuild compiles
TypeScript from `node_modules` by default, so apps need no `extraIncludePaths` entry for this
package. `@xh/hoist`, `react`, and `react-dom` are `peerDependencies`, resolved by the host app.

The `files` field in `package.json` whitelists what gets published: source, `docs`, and the built
`hoist-docs` index, minus `*.spec.ts`. Add any new top-level source directory (e.g. `mobile`) there.

`@xh/hoist` also appears in `devDependencies` so `tsc`, the IDE, and the unit tests resolve the real
library. `tsc` compiles Hoist's `.ts` source, so packages Hoist imports types from
(`ag-grid-community`, `ag-grid-react`, `@types/lodash`, `type-fest`) are also devDependencies.
`@xh/hoist-dev-utils` is a devDependency only for its `configureVitest()` preset.

Apps run against a local checkout of this package with `XH_INLINE_PACKAGES=@xh/package-template`
(a hoist-dev-utils feature). See `docs/package-structure.md`.

Write code as the installed Hoist version expects. Use the `hoist-docs` MCP tools to check current
APIs rather than relying on memory, and follow Hoist's upgrade notes when moving to a new major.
`tsconfig.json` mirrors a Hoist app's settings.

Components follow the standard Hoist component-plus-model pattern, written as TypeScript:
- `CustomPanel.ts` - the view, `hoistCmp.withFactory<CustomPanelProps>(...)` paired with its model via
  `creates(CustomPanelModel)`. Props are a typed interface extending `HoistProps<CustomPanelModel>`
  and `BoxProps`. Imports `@xh/hoist/desktop/register` and its own `.scss`.
- `CustomPanelModel.ts` - a `HoistModel` subclass holding state and logic.
- `CustomPanelModel.spec.ts` - a Vitest spec beside the code it tests.
- `index.ts` - re-exports the component and model (`export * from ...`).

Modern Hoist components do NOT use React `propTypes` (typed props replace them). Source files carry
no per-file copyright header, matching this repo's minimal convention (the "belongs to Hoist" header
in hoist-react is specific to that repo - do not copy it here).

Styling uses Hoist CSS variables (e.g. `var(--xh-orange)`, `var(--xh-spacing)`) scoped under the
component's `className` (`xh-custom-panel`). Check `node_modules/@xh/hoist/styles/vars.scss` for
current names.

## Docs (Hoist Docs index)

The package ships a Hoist Docs index so agents and the Toolbox docs viewer can read its docs. See
hoist-react's `docs/companion-library-docs.md` for the contract.
- `docs/doc-registry.json` lists each doc, with `mcpInstructions` (short agent guidance, honored
  only for `@xh` packages) and `viewerCategories` for Toolbox.
- `package.json` `hoistDocs` declares the index (`id: "package-template"`).
- `prepack` runs `hoist-docs-build`, so every `pnpm publish` ships an index of its own source.

Add a new doc to the registry with a description and API-name `keywords`.

## Unit tests

Vitest, configured in `vitest.config.mts` on `configureVitest()` from `@xh/hoist-dev-utils`. Specs
use hoist-react's test kit (`@xh/hoist/test-support`) and its fake hoist-core. See hoist-react's
`docs/unit-testing.md` for how to write them.

## Conventions

Formatting is owned by Prettier (`.prettierrc.json`): 4-space indent, single quotes, semicolons,
100-char width, no trailing commas, `bracketSpacing: false`. ESLint uses the flat-config
`@xh/eslint-config` plus `eslint-config-prettier`. SCSS/JSON use 2-space indent.

## CI / Publishing

GitHub Actions:
- `.github/workflows/ci.yml` - lint, type-check, unit tests, and `pnpm pack --dry-run` (which builds
  the docs index) on PRs and pushes to `main`.
- `.github/workflows/deployRelease.yml` - manual dispatch. Runs the same checks with the newest
  `@xh/hoist-docs-builder` in range, sets the version, `pnpm publish` (whose `prepack` builds the
  index), then tags the commit and creates a GitHub release. Uses shared composite actions from
  `xh/hoist-dev-utils` (pinned by SHA, bumped by Dependabot). The repo `package.json` always holds
  a `-SNAPSHOT` version (e.g. `5.0.0-SNAPSHOT`), like hoist-react. The workflow sets the release
  version at publish time and does not commit it back, so the tag points at the SNAPSHOT commit.
  Never set `package.json` to the exact release version - `pnpm version` then fails with
  `ERR_PNPM_VERSION_NOT_CHANGED`.

Required secrets: `FONTAWESOME_PACKAGE_TOKEN` (plus the same token in Dependabot secrets). Publishing
uses npm trusted publishing over OIDC (`id-token: write`), with no npm token. npm checks the
`repository` URL in `package.json` against the repo, so keep it in full URL form.
