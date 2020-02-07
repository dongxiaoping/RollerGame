/* 游戏开始按钮，只有房主才会显示
 *
 */
const { ccclass, property } = cc._decorator;
import { eventBus } from '../../common/EventBus'
import { EventType, LocalNoticeEventType, LocalNoticeEventPara } from '../../common/Const'
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            //console.log('start_game_test:开始游戏按钮被点击')
            eventBus.emit(EventType.LOCAL_NOTICE_EVENT, {type: LocalNoticeEventType.PLAY_BUTTON_EVENT} as LocalNoticeEventPara)
            this.node.destroy()
        })
    }

    onDisable() {
        //cc.log('开始按钮对象被销毁')
        this.node.off(cc.Node.EventType.TOUCH_END, () => { })
    }

    start() {

    }

    // update (dt) {}
}
