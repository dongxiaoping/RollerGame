const { ccclass, property } = cc._decorator;
import { eventBus } from '../common/EventBus'
import { EventType, GameState } from '../common/Const'
import { RollControlerOb } from './RollControler'
import RaceManage from '../store/Races/RaceManage'
import { randEventId } from '../common/Util'
import GameMember from '../store/GameMember/GameMemberManage'
import GameMemberItem from '../store/GameMember/GameMemberItem'
import { gameMemberType } from '../store/GameMember/GameMemberBase'
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

    emulateBet(): void {
        /////////
        cc.log('添加一个成员')


        ///////
        cc.log('模拟器发起模拟下注')
        let memberList = GameMember.gameMenmberList
        memberList.forEach((item: GameMemberItem) => {
            if (item.roleType !== gameMemberType.LANDLORD) {
                RaceManage.raceList[1].betInfo[item.userId].bridg = 10
                RaceManage.raceList[1].betInfo[item.userId].land = 50
            }
        })

    }



}

export default new RollEmulator()
