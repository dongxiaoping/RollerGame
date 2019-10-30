const { ccclass, property } = cc._decorator;
import { eventBus } from '../common/EventBus'
import { EventType, GameState } from '../common/Const'
import { RollControlerOb } from './RollControler'
@ccclass
class RollEmulator extends RollControlerOb {

    startRun(): void {
        cc.log('游戏模拟器被启动')
        super.startRun()
    }

    //模拟器模拟相关推送数据
    serverEventReceive(): void {
        cc.log('模拟器将模拟相关推送数据')
    }
}

export default new RollEmulator()
