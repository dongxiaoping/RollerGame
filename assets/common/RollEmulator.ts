const { ccclass, property } = cc._decorator;
import { eventBus } from '../common/EventBus'
import { EventType, GameState } from '../common/Const'
import { RollControlerOb } from './RollControler'
import { randEventId } from '../common/Util'
import BetManage from '../store/Bets/BetManage'
@ccclass
class RollEmulator extends RollControlerOb {

    startRun(): void {
        cc.log('游戏模拟器被启动')
        super.startRun()
    }

    //模拟器模拟相关推送数据
    serverEventReceive(): void {
        eventBus.on(EventType.GAME_STATE_CHANGE, randEventId(), (info: any): void => {
            let to = info.to
            switch (to) {
                case GameState.BET:
                    cc.log('模拟器接收到下注环节通知')
                    this.emulateBet()
                    break
            }
        })
    }

    emulateBet():void{
        BetManage.requestBetList()
    }

}

export default new RollEmulator()
