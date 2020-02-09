import { eventBus } from "../../common/EventBus";
import { EventType, LocalNoticeEventType, LocalNoticeEventPara } from "../../common/Const";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Sprite)
    private focus: cc.Sprite = null
    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            //cc.log('点击按钮确认当地主')
            this.node.parent.parent.getComponent('RollRoomScene').playWoQiangVoice()
            eventBus.emit(EventType.LOCAL_NOTICE_EVENT, { type: LocalNoticeEventType.LOCAL_BE_LANDLORD_RESULT, info: true } as LocalNoticeEventPara)
            this.node.active = false
        })
    }
    update(dt) {
        this.focus.node.angle = this.focus.node.angle + 0.2
    }
}
