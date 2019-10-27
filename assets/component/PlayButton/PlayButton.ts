const {ccclass, property} = cc._decorator;
import { eventBus } from '../../common/EventBus'
import { EventType, GameState } from '../../common/Const'
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_END, ()=>{
            console.log('开始游戏按钮被点击')
            eventBus.emit(EventType.PLAY_BUTTON_EVENT, {})
        })
    }

    onDisable(){
        this.node.off(cc.Node.EventType.TOUCH_END, ()=>{})
    }

    start () {

    }

    // update (dt) {}
}
