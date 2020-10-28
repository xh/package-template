import {HoistModel, XH} from '@xh/hoist/core';

@HoistModel
export class CustomPanelModel {

    get greeting() {
        return `Hello, ${XH.getUser().displayName}!`;
    }

}
