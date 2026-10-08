import {HoistModel, XH} from '@xh/hoist/core';
import {action, bindable} from '@xh/hoist/mobx';

export class CustomPanelModel extends HoistModel {
    // TC39 decorator on an `accessor` field, transformed by the consuming app's build.
    @bindable accessor clickCount: number = 0;

    get greeting(): string {
        return `Hello, ${XH.getUser().displayName}!`;
    }

    @action
    increment() {
        this.clickCount++;
    }
}
