# Package Structure

This doc explains how `@xh/package-template` is set up. Each section covers one part of the setup
that a companion package needs. Copy the parts your package uses.

## Ship Source, Not a Build

The package has no build step. It publishes its TypeScript and SCSS source to npm as written, the
same way hoist-react does. The app that installs it compiles the source with its own Rsbuild and
SWC pipeline, together with Hoist and the app code. The package therefore uses the same decorator
transform, `XH` constants, and browser targets as the app.

An app needs no build config for a package that ships only TypeScript. Rsbuild compiles TypeScript
from `node_modules` by default. Add the package to `extraIncludePaths` in `rsbuild.config.mjs` only
if it also ships plain `.js` source.

The `files` field in `package.json` lists what ships:

- `desktop` - the source. Add each new top-level source folder, such as `mobile`.
- `docs` - the markdown docs.
- `hoist-docs` - the docs index, built at publish time. See
  [Docs for Agents and Viewers](#docs-for-agents-and-viewers).
- `!**/*.spec.ts` - keeps unit tests out of the package.

## Dependencies

Declare `@xh/hoist`, `react`, and `react-dom` as `peerDependencies`. The app provides them, so the
app and the package always share one copy. Two copies of Hoist or React break an app at runtime.
Declare any other library that the package shares with the app as a peer too.

List `@xh/hoist` in `devDependencies` as well, so `tsc`, the IDE, and the unit tests resolve the
real library. Hoist imports types from a few packages that apps provide, so these are also
devDependencies: `ag-grid-community`, `ag-grid-react`, `@types/lodash`, and `type-fest`.

## Code Conventions

Write package code the same way as app code for the Hoist version you target. The docs that ship
with `@xh/hoist`, and the Hoist Docs tools that serve them, describe the current patterns. When you
move the package to a new Hoist major, follow its upgrade notes here as an app would.

Two conventions matter more in a shared package than in an app:

- Give components typed props that extend `HoistProps` and `BoxProps`. Apps then get type checks
  and editor help when they use the component.
- Scope styles under the component's `className`, and build them on Hoist CSS variables. The
  component then follows each app's theme and does not leak styles into it.

Each component folder holds the component, its model, its stylesheet, an `index.ts` barrel, and
its specs. Apps import from the folder, as in
`import {customPanel} from '@xh/package-template/desktop/cmp/custompanel'`.

## Docs for Agents and Viewers

The package ships a [Hoist Docs](https://github.com/xh/hoist-docs) index, so agents in an app can
search its docs and symbols with the same tools they use for Hoist. hoist-react's
`companion-library-docs.md` describes the full contract. This package uses these parts of it:

1. Write docs as markdown under `docs/`, with `##` and `###` headings. Search returns one section
   at a time, so give each section a heading that names its task.
2. List each doc in `docs/doc-registry.json`, with a description and the API names it covers as
   `keywords`. `docs/README.md` is the index doc.
3. Declare the index in `package.json`, under `hoistDocs`. Its `id` is the library name that agents
   pass to the tools.
4. Build the index with `@xh/hoist-docs-builder` in the `prepack` script. `pnpm publish` runs it, so
   every published version carries an index of its own source.

In an app with `@xh/hoist-docs` set up as an MCP server, `hoist-ping` lists the package with its
version. Toolbox's docs viewer reads the same index, with the categories under `viewerCategories`
in the registry.

Run `pnpm build:docs` to build the index locally and check the registry. The index is gitignored.

## Unit Tests

Specs sit next to the code they test, as `CustomPanelModel.spec.ts` for `CustomPanelModel.ts`. They
run on [Vitest](https://vitest.dev), with the `configureVitest()` preset from
`@xh/hoist-dev-utils`. The preset compiles specs with the same SWC settings as an app build. It also
loads hoist-react's test kit, which boots a headless Hoist app against a fake hoist-core.

```bash
pnpm test         # run all specs once
pnpm test:watch   # re-run specs as files change
```

See hoist-react's `unit-testing.md` for how to write specs.

## Run an App Against a Local Checkout of the Package

To see a change in an app before you publish it, run the app against your local checkout. Set
`XH_INLINE_PACKAGES` to the package name when you start the app. From Toolbox's `client-app`:

```bash
# Uses a sibling checkout at ../../package-template
XH_INLINE_PACKAGES=@xh/package-template pnpm start

# Uses a checkout at another path, such as a worktree
XH_INLINE_PACKAGES=@xh/package-template=$HOME/dev/package-template-wt pnpm start
```

The app build compiles the checkout in place of the installed copy. It shares Hoist, React, and the
package's other peers with the app. The checkout needs its own `pnpm install` first. The
hoist-dev-utils README describes the full behavior.

## CI and Releases

Two GitHub Actions workflows run the checks:

- **CI** runs on each pull request and each push to `main`. It lints, type-checks, runs the unit
  tests, and builds the docs index.
- **Deploy Release** runs by hand from `main`, with a version number. It runs the same checks, sets
  the version, publishes to npm, and tags the commit.

`package.json` always holds a `-SNAPSHOT` version. The release workflow sets the real version at
publish time and does not commit it back.
