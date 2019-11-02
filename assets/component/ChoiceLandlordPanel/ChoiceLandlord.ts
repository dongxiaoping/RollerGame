/* 是否选中当地主选择提示框
 *
 */
const { ccclass, property } = cc._decorator;
import { EventType, GameState, ChildGameState, ChildGameParam } from '../../common/Const'
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
            cc.log('点击按钮确认当地主')
            eventBus.emit(EventType.CHILD_GAME_STATE_CHANGE, { parentState: GameState.CHOICE_LANDLORD, childState: ChildGameState.CHOICE_LANDLORD.LOCAL_BE_LANDLORD_RESULT, val:true} as ChildGameParam)
            // cc.log('发出选地主结束通知')
            // eventBus.emit(EventType.GAME_LINK_FINISH, {
            //     state: GameState.CHOICE_LANDLORD
            // })
            this.node.destroy()
        })
        cancelButton.on(cc.Node.EventType.TOUCH_END, () => {
            eventBus.emit(EventType.CHILD_GAME_STATE_CHANGE, { parentState: GameState.CHOICE_LANDLORD, childState: ChildGameState.CHOICE_LANDLORD.LOCAL_BE_LANDLORD_RESULT, val:false} as ChildGameParam)
            cc.log('点击按钮拒绝当地主')
            // cc.log('发出选地主结束通知')
            // eventBus.emit(EventType.GAME_LINK_FINISH, {
            //     state: GameState.CHOICE_LANDLORD
            // })
            this.node.destroy()
        })
    }

    // update (dt) {}
}
