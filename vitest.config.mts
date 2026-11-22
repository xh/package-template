/**
 * Vitest config, built on the `configureVitest()` preset from hoist-dev-utils. The preset compiles
 * specs with the same SWC settings and `XH` constants as an app build, and loads hoist-react's test
 * kit (`@xh/hoist/test-support`), which runs Hoist's real client services against a fake
 * hoist-core. See the "Unit Tests in an App" section of hoist-react's `docs/unit-testing.md`.
 */
import configureVitest from '@xh/hoist-dev-utils/configureVitest';
import {defineConfig} from 'vitest/config';

export default defineConfig(
    configureVitest({
        appCode: 'packageTemplate',
        appName: 'Package Template',
        include: ['desktop/**/*.spec.ts']
    })
);
