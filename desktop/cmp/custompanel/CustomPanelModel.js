import {HoistModel, XH} from '@xh/hoist/core';

export class CustomPanelModel extends HoistModel {

    get greeting() {
        return `Hello, ${XH.getUser().displayName}!`;
    }

}
