# Package Template Docs

`@xh/package-template` is a sample companion package for [Hoist](https://github.com/xh/hoist-react)
apps. It shows how an organization can share Hoist components, models, and styles across its apps
from one npm package. Copy its layout to start your own package.

These docs ship inside the package. AI coding agents read them through
[Hoist Docs](https://github.com/xh/hoist-docs), next to Hoist's own docs. The Toolbox docs viewer
shows them too.

## What This Package Provides

| Export | Import from | Description |
| --- | --- | --- |
| `customPanel`, `CustomPanel` | `@xh/package-template/desktop/cmp/custompanel` | A sample desktop panel with a greeting and a click counter. |
| `CustomPanelModel` | `@xh/package-template/desktop/cmp/custompanel` | The model behind `customPanel`. |

Use `customPanel` where an app would build the same panel by hand. A real package lists its own
components here, and says which Hoist APIs they replace.

## Docs

| Doc | Description |
| --- | --- |
| [Package Structure](./package-structure.md) | How a companion package is laid out, published, tested, and developed against an app. |
