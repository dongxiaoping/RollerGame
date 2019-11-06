/* 是否选中当地主选择提示框
 *
 */
const { ccclass, property } = cc._decorator;
import { EventType, LocalNoticeEventPara, LocalNoticeEventType } from '../../common/Const'
import { eventBus } from '../../common/EventBus'
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        cc.log(22)
        let sureButton = this.node.getChildByName('Sure')
        let cancelButton = this.node.getChildByName('Cancel')
        sureButton.on(cc.Node.EventType.TOUCH_END, () => {
            cc.log('点击按钮确认当地主')
            eventBus.emit(EventType.LOCAL_NOTICE_EVENT, { type: LocalNoticeEventType.LOCAL_BE_LANDLORD_RESULT, info: true } as LocalNoticeEventPara)
            this.node.active = false
            this.node.destroy()
        })
        cancelButton.on(cc.Node.EventType.TOUCH_END, () => {
            eventBus.emit(EventType.LOCAL_NOTICE_EVENT, { type: LocalNoticeEventType.LOCAL_BE_LANDLORD_RESULT, info: false } as LocalNoticeEventPara)
            cc.log('点击按钮拒绝当地主')
            this.node.active = false
            this.node.destroy()
        })
    }

    // update (dt) {}
}
