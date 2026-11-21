# 📦 package-template
A stub package to demo code sharing across Hoist client apps.
----------------------------------------------------------------

This project is a deliberately minimal template for a Hoist companion package: an npm package that
shares components, models, and styles across a group of [Hoist](https://github.com/xh/hoist-react)
apps. Copy its layout to start your own.

It shows each part of the setup in its simplest form:

- **Source-only publishing.** The package ships its TypeScript and SCSS as written. Each app
  compiles it with its own build, as it does hoist-react.
- **Docs for agents.** The package ships a [Hoist Docs](https://github.com/xh/hoist-docs) index, so
  AI coding agents in an app can search its docs and API next to Hoist's.
- **Unit tests.** A sample spec runs on Vitest with hoist-react's test kit.
- **CI and releases.** GitHub Actions workflows check every PR and publish releases to npm.

See Toolbox ([repo](https://github.com/xh/toolbox) |
[app](https://toolbox.xh.io/app/other/customPackage)) for a demo usage of this package. Toolbox
also shows this package's docs in its docs viewer.

## Docs

- [Package Structure](./docs/package-structure.md) explains each part of the setup, and how to run
  an app against a local checkout of the package.
- [Docs index](./docs/README.md) lists what the package provides.

## Local development

This repo uses [pnpm](https://pnpm.io), pinned via the `packageManager` field in `package.json`.
Run `corepack enable pnpm` once to have Corepack provide the right version.

```bash
pnpm install      # requires FONTAWESOME_PACKAGE_TOKEN configured in your ~/.npmrc
pnpm lint         # eslint + stylelint + prettier
pnpm typecheck    # tsc, against the installed @xh/hoist
pnpm test         # unit tests
pnpm build:docs   # build the Hoist Docs index into hoist-docs/
```

## Publishing

The **Deploy Release** workflow (`.github/workflows/deployRelease.yml`) publishes releases to
[npmjs.com](https://www.npmjs.com/package/@xh/package-template). Run it by hand from the Actions
tab with the version number. The **CI** workflow (`.github/workflows/ci.yml`) runs the same checks
on every PR and push to `main`.

Both workflows install `@xh/hoist`, which resolves `@fortawesome/*` from a private registry. They
need these repo or org secrets:

| Secret | Used by | Purpose |
| --- | --- | --- |
| `FONTAWESOME_PACKAGE_TOKEN` | CI, Deploy Release | Auth for the private Font Awesome registry during install |
| `NPM_TOKEN` | Deploy Release | Auth for `pnpm publish` |

`GITHUB_TOKEN` is provided automatically. Dependabot also needs `FONTAWESOME_PACKAGE_TOKEN` under
**Dependabot secrets**, which are separate from Actions secrets, to resolve npm updates.

An organization would likely publish its internal packages to a private registry such as
Artifactory or Nexus rather than to public npm.

------------------------------------------

📫☎️🌎 info@xh.io | <https://xh.io>

Copyright © 2026 Extremely Heavy Industries Inc.
