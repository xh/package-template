# 📦 package-template
A stub package to demo code sharing across Hoist client apps.
----------------------------------------------------------------

This project is a deliberately minimal TypeScript package designed to provide a template for custom
packages used to share code and styles within an organization or group of Hoist applications.

See Toolbox ([repo](https://github.com/xh/toolbox) |
[app](https://toolbox.xh.io/app/other/customPackage)) for a demo usage of this package.

This package and its use in Toolbox follow the same approach as
[hoist-react](https://github.com/xh/hoist-react) itself, where the package is left unprocessed /
unpackaged when published to npm. The consuming app then transpiles it with Rsbuild/SWC along with
Hoist and app code during the app build. See the `extraIncludePaths` option in Toolbox's commented
`rsbuild.config.mjs` for the relevant setting.

Code in this package follows the same conventions as the Hoist version it targets. For Hoist v88+,
that means TC39 decorators (`@bindable accessor foo`), not the legacy `experimentalDecorators` form.
The consuming app's build applies the decorator transform to this package's source.

## Publishing

Releases are published to npm by the **Deploy Release** GitHub Actions workflow
(`.github/workflows/deployRelease.yml`). Trigger it manually from the Actions tab with the desired
version number. The workflow lints and type-checks, sets the version, publishes to [npmjs.com](https://www.npmjs.com/package/@xh/package-template), and
tags the source commit with an auto-generated GitHub release. The **CI** workflow
(`.github/workflows/ci.yml`) checks formatting, lints, and type-checks on every PR and push to `main`.

Both workflows install `@xh/hoist` (so `tsc` can type-check against the real library), which in turn
resolves `@fortawesome/*` from a private registry. They therefore require these repo (or org)
secrets:

| Secret | Used by | Purpose |
| --- | --- | --- |
| `FONTAWESOME_PACKAGE_TOKEN` | CI, Deploy Release | Auth for the private Font Awesome registry during install |
| `NPM_TOKEN` | Deploy Release | Auth for `pnpm publish` |

`GITHUB_TOKEN` is provided automatically. Dependabot additionally needs `FONTAWESOME_PACKAGE_TOKEN`
configured under **Dependabot secrets** (separate from Actions secrets) to resolve npm updates.

An organization would likely publish its internal shared code to a privately hosted artifact
repository such as Artifactory or Nexus rather than to public npm.

## Local development

This repo uses [pnpm](https://pnpm.io), pinned via the `packageManager` field in `package.json`.
Run `corepack enable pnpm` once to have Corepack provide the right version.

```bash
pnpm install   # requires FONTAWESOME_PACKAGE_TOKEN configured in your ~/.npmrc
pnpm lint      # eslint + stylelint + prettier + tsc
```

`tsc` type-checks against the installed `@xh/hoist` source. Hoist imports types from a few packages
that apps normally provide, so they are listed here as devDependencies purely for type-checking:
`ag-grid-community`, `ag-grid-react`, `@types/lodash`, and `type-fest`.

------------------------------------------

📫☎️🌎 info@xh.io | <https://xh.io>

Copyright © 2026 Extremely Heavy Industries Inc.
