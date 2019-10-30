/* 游戏开始按钮，只有房主才会显示
 *
 */
const { ccclass, property } = cc._decorator;
import { eventBus } from '../../common/EventBus'
import { EventType, GameState, ChildGameState, ChildGameParam } from '../../common/Const'
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
            console.log('开始游戏按钮被点击')
            eventBus.emit(EventType.CHILD_GAME_STATE_CHANGE, { parentState: GameState.WAIT_BEGIN, childState: ChildGameState.WAIT_BEGIN.PLAY_BUTTON_EVENT } as ChildGameParam)
            this.node.destroy()
        })
    }

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_END, () => { })
    }

    start() {

    }

    // update (dt) {}
}
