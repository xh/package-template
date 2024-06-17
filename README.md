# 📦 package-template
A stub JS package to demo code sharing across Hoist client apps.
----------------------------------------------------------------

This project is a deliberately minimal JS package designed to provide a template for custom packages
used to share code and styles within an organization or group of Hoist applications.

See Toolbox ([repo](https://github.com/xh/toolbox) |
[app](https://toolbox.xh.io/app/other/customPackage)) for a demo usage of this package.

This package and its use in Toolbox follow the same approach as
[hoist-react](https://github.com/xh/hoist-react) itself, where the package is left unprocessed /
unpackaged when published to npm, but is then transpiled by Webpack/Babel along with Hoist and
application code during the app build. See Toolbox's commented `webpack.config.js` file for the
relevant settings to ensure this happens.

This approach makes package publishing itself very simple. We use XH's Teamcity to run the following
script:

```bash
# Update version number in package.json with version provided to build.
yarn version --new-version %xh.version.release%

# Pack to build tarball locally to use as an artifact, then publish to npm.
npm pack
npm publish

# Push to git with updated version in package.json and tag created by npm publish.
git push --follow-tags
```

We publish this particular package to
[npmjs.com](https://www.npmjs.com/package/@xh/package-template), but an organization would likely
publish their internal shared code to a privately hosted artifact repository such as Artifactory or
Nexus.

------------------------------------------

📫☎️🌎 info@xh.io | <https://xh.io>

Copyright © 2024 Extremely Heavy Industries Inc.
