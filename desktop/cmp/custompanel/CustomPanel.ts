import {code, p} from '@xh/hoist/cmp/layout';
import {BoxProps, creates, hoistCmp, HoistProps} from '@xh/hoist/core';
import {button} from '@xh/hoist/desktop/cmp/button';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import '@xh/hoist/desktop/register';
import {Icon} from '@xh/hoist/icon';
import {CustomPanelModel} from './CustomPanelModel';
import './CustomPanel.scss';

export interface CustomPanelProps extends HoistProps<CustomPanelModel>, BoxProps {}

export const [CustomPanel, customPanel] = hoistCmp.withFactory<CustomPanelProps>({
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
                    code('@xh/package-template'),
                    '.'
                ),
                p('The text inside of it should be orange.'),
                p(`Button clicked ${model.clickCount} time(s).`)
            ],
            bbar: [
                button({
                    text: 'Click me',
                    icon: Icon.add(),
                    onClick: () => model.increment()
                })
            ],
            ...props
        });
    }
});
