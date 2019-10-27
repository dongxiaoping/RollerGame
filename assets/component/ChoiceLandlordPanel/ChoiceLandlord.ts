const { ccclass, property } = cc._decorator;
import { EventType, GameState } from '../../common/Const'
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
        let sureButton = this.node.getChildByName('Sure')
        let cancelButton = this.node.getChildByName('Cancel')
        sureButton.on(cc.Node.EventType.TOUCH_END, () => {
            cc.log('发出选地主结束通知')
            eventBus.emit(EventType.GAME_LINK_FINISH, {
                state: GameState.CHOICE_LANDLORD
            })
            this.node.destroy()
        })
        cancelButton.on(cc.Node.EventType.TOUCH_END, () => {
            cc.log('发出选地主结束通知')
            eventBus.emit(EventType.GAME_LINK_FINISH, {
                state: GameState.CHOICE_LANDLORD
            })
            this.node.destroy()
        })
    }

    // update (dt) {}
}
