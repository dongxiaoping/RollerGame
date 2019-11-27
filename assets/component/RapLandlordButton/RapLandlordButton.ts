import { eventBus } from "../../common/EventBus";
import { EventType, LocalNoticeEventType } from "../../common/Const";
const { ccclass } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    start() {
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            cc.log('点击按钮确认当地主')
            eventBus.emit(EventType.LOCAL_NOTICE_EVENT, { type: LocalNoticeEventType.LOCAL_BE_LANDLORD_RESULT, info: true } as LocalNoticeEventPara)
            this.node.active = false
            this.node.destroy()
        })
    }
}
