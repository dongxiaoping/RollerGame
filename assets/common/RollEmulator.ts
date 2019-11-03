const { ccclass, property } = cc._decorator;
import { eventBus } from '../common/EventBus'
import { RollControlerOb } from './RollControler'
import RaceManage from '../store/Races/RaceManage'
import RoomManage from '../store/Room/RoomManage'
import { roomState } from '../store/Room/RoomBase'
import { randEventId } from '../common/Util'
import RoomItem from '../store/Room/RoomItem'
import UserManage from '../store/User/UserManage'
import GameMember from '../store/GameMember/GameMemberManage'
import GameMemberItem from '../store/GameMember/GameMemberItem'
import { gameMemberType } from '../store/GameMember/GameMemberBase'
import { PromiseParam, PushEventType, EventType, GameState, ChildGameParam } from '../common/Const'
import Room from '../store/Room/RoomManage'
import GameMemberManage from '../store/GameMember/GameMemberManage'
import {raceState} from '../store/Races/RaceBase'
@ccclass
class RollEmulator extends RollControlerOb {
    startRun(): void {
        cc.log('游戏模拟器被启动')
        this.initData() //将本地数据全部初始化一遍，这样后续数据可以直接使用，不用接口请求
        super.startRun()
    }

    //初始化本地数据
    async initData() {
        cc.log('模拟器初始化本地数据')
        let infoOne = await Room.requestRoomInfo()
        let infoTwo = await GameMemberManage.requestGameMemberList()
        let infoThree = await UserManage.requestUserInfo()
        RaceManage.updateBetToRaceInfo() //初始化本地的比赛数据
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
        cc.log('模拟器发起模拟下注')
        let memberList = GameMember.gameMenmberList
        memberList.forEach((item: GameMemberItem) => {
            if (item.roleType !== gameMemberType.LANDLORD) {
                RaceManage.raceList[1].betInfo[item.userId].bridg = 10
                RaceManage.raceList[1].betInfo[item.userId].land = 50
            }
        })

    }

    responsePlayBottomEvent() {
        cc.log('模拟器控制器接收到游戏开始按钮通知')
        cc.log('房间改为游戏中')
        RoomManage.roomItem.roomState = roomState.PLAYING //改变房间状态为游戏中
        RaceManage.raceList[1].state = raceState.CHOICE_LANDLORD
        eventBus.emit(EventType.PUSH_EVENT, { //推送地主邀请
            eventType: PushEventType.LANDLOAD_WELCOME, userId: UserManage.userInfo.id
        })
    }

    responseLocalBeLandlordDeal(wantLandlord: boolean) {
        cc.log('模拟控制器接收到用户是否愿意当地主通知')
        if (wantLandlord) {
            GameMemberManage.gameMenmberList[23].roleType = gameMemberType.LANDLORD
        } else {
            GameMemberManage.gameMenmberList[24].roleType = gameMemberType.LANDLORD
        }
        setTimeout(()=>{
            cc.log('模拟器开启摇色子环节')
            RaceManage.raceList[1].state = raceState.ROLL_DICE
        },1000)
    }

}

export default new RollEmulator()
