import {code, p} from '@xh/hoist/cmp/layout';
import {creates, hoistCmp} from '@xh/hoist/core';
import {Panel, panel} from '@xh/hoist/desktop/cmp/panel';
import {Icon} from '@xh/hoist/icon';
import './CustomPanel.scss';
import {CustomPanelModel} from './CustomPanelModel';

export const [CustomPanel, customPanel] = hoistCmp.withFactory({
    displayName: 'CustomPanel',
    model: creates(CustomPanelModel),
    className: 'xh-custom-panel',

    render({model, ...props}) {
        return panel({
            title: 'CustomPanel component from @xh/package-template',
            icon: Icon.boxFull(),
            items: [
                p(model.greeting),
                p(
                    'This is a simple panel component imported from ',
                    code('@xh/package-template'), '.'
                ),
                p('The text inside of it should be orange.')
            ],
            ...props
        });
    }
});

CustomPanel.propTypes = {...Panel.propTypes};
