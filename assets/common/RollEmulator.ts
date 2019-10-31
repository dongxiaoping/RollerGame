const { ccclass, property } = cc._decorator;
import { eventBus } from '../common/EventBus'
import { EventType, GameState } from '../common/Const'
import { RollControlerOb } from './RollControler'
import RaceManage  from '../store/Races/RaceManage'
import {randEventId} from '../common/Util'
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
       // BetManage.requestBetList()
       cc.log('模拟器发起模拟下注')
       cc.log(RaceManage.raceList[1])
       RaceManage.raceList[1].betInfo[23].bridg = 10
    }

}

export default new RollEmulator()
