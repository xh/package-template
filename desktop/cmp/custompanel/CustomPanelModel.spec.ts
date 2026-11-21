/**
 * Sample spec for a companion package. It boots a headless Hoist app against hoist-react's fake
 * hoist-core, so the model under test reads the real `XH` singleton and the test user it serves.
 */
import {hoistCore, initTestAppAsync} from '@xh/hoist/test-support';
import {beforeAll, describe, expect, it, onTestFinished} from 'vitest';
import {CustomPanelModel} from './CustomPanelModel';

describe('CustomPanelModel', () => {
    beforeAll(async () => {
        hoistCore.user = {...hoistCore.user, displayName: 'Jane Doe'};
        await initTestAppAsync();
    });

    it('greets the current user by display name', () => {
        const model = createModel();
        expect(model.greeting).toBe('Hello, Jane Doe!');
    });

    it('counts clicks from zero', () => {
        const model = createModel();
        expect(model.clickCount).toBe(0);

        model.increment();
        model.increment();
        expect(model.clickCount).toBe(2);
    });
});

function createModel(): CustomPanelModel {
    const ret = new CustomPanelModel();
    onTestFinished(() => ret.destroy());
    return ret;
}
